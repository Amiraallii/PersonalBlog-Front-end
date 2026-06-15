import { useEffect, useState } from "react";

interface UseInfiniteScrollOptions {
  fetchData: (
    skip: number,
  ) => Promise<{ hasNextPage: boolean; items: any[]; totalCount: number }>;
  pageSize: number;
}

export function useInfiniteScroll({
  fetchData,
  pageSize,
}: UseInfiniteScrollOptions) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(
    null,
  );
  const observerTarget = (node: HTMLDivElement | null) => {
    setTargetElement(node);
  };
  useEffect(() => {
    if (!hasNextPage || isLoading) return;
    const target = targetElement;
    if (!target) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          try {
            const res = await fetchData(skip);
            setItems((prev) => [...prev, ...res.items]);
            setHasNextPage(res.hasNextPage);
            setTotalCount(res.totalCount);
            setSkip((prevSkip) => prevSkip + pageSize);
          } catch (error) {
            console.error("Infinite scroll error:", error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [skip, hasNextPage, isLoading, fetchData, pageSize, targetElement]);

  const resetList = () => {
    setItems([]);
    setSkip(0);
    setHasNextPage(true);
  };

  return {
    items,
    isLoading,
    hasNextPage,
    observerTarget,
    resetList,
    totalCount,
  };
}
