import { useEffect, type ReactNode } from "react";

interface CacheData {
  items: any[];
  skip: number;
  hasNextPage: boolean;
  totalCount: number;
  scrollY: number;
  timestamp: number;
}

interface PageCacheManagerProps {
  cacheKey: string;
  children: (cache: {
    cachedItems: any[];
    cachedSkip: number;
    cachedHasNextPage: boolean;
    cachedTotalCount: number;
    scrollY: number; 
    saveCache: (items: any[], skip: number, hasNextPage: boolean, totalCount: number) => void;
  }) => ReactNode;
}

const ONE_HOUR = 60 * 60 * 1000;

export default function PageCacheManager({ cacheKey, children }: PageCacheManagerProps) {
  const getValidCache = (): CacheData | null => {
    const saved = sessionStorage.getItem(`page_cache_${cacheKey}`);
    if (!saved) return null;

    try {
      const parsed: CacheData = JSON.parse(saved);
      if (Date.now() - parsed.timestamp > ONE_HOUR) {
        sessionStorage.removeItem(`page_cache_${cacheKey}`);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const cache = getValidCache();

  const saveCache = (items: any[], skip: number, hasNextPage: boolean, totalCount: number) => {
    const cacheData: CacheData = {
      items,
      skip,
      hasNextPage,
      totalCount,
      scrollY: window.scrollY,
      timestamp: cache?.timestamp || Date.now(),
    };
    sessionStorage.setItem(`page_cache_${cacheKey}`, JSON.stringify(cacheData));
  };

  useEffect(() => {
    const handleScroll = () => {
      const saved = sessionStorage.getItem(`page_cache_${cacheKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.scrollY = window.scrollY;
        sessionStorage.setItem(`page_cache_${cacheKey}`, JSON.stringify(parsed));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cacheKey]);

  return (
    <>
      {children({
        cachedItems: cache?.items || [],
        cachedSkip: cache?.skip || 0,
        cachedHasNextPage: cache?.hasNextPage ?? true,
        cachedTotalCount: cache?.totalCount || 0,
        scrollY: cache?.scrollY || 0, 
        saveCache,
      })}
    </>
  );
}