import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  PencilSquareIcon,
  ListBulletIcon,
} from "@heroicons/react/16/solid";
import { PostService } from "../services/index";
import { convertToJalali } from "../../../utils/dateHelper";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import PageCacheManager from "../../../components/PageCacheManager";
import { useEffect } from "react";

const PostItemsContent = ({
  cachedItems,
  cachedHasNextPage,
  cachedTotalCount,
  scrollY,
  saveCache,
}: any) => {
  const navigate = useNavigate();
  const BucketAdd = "https://c110685.parspack.net/c110685";
  const PAGE_SIZE = 10;
  const {
    items: posts,
    isLoading,
    hasNextPage,
    observerTarget,
    totalCount,
  } = useInfiniteScroll({
    pageSize: PAGE_SIZE,
    fetchData: async (currentSkip) => {
      if (cachedItems.length > 0 && currentSkip === 0) {
        return {
          items: cachedItems,
          hasNextPage: cachedHasNextPage,
          totalCount: cachedTotalCount,
        };
      }
      const data = await PostService.getAll(PAGE_SIZE, currentSkip);

      return {
        items: data.items || [],
        hasNextPage: data.hasNextPage,
        totalCount: data.totalCount || 0,
      };
    },
  });
  useEffect(() => {
    if (posts.length > 0 && scrollY > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: "instant" });
        });
      });
    }
  }, [posts.length, scrollY]);

  useEffect(() => {
    if (posts.length > 0) {
      saveCache(posts, posts.length, hasNextPage, totalCount);
    }
  }, [posts.length, hasNextPage, totalCount]);

  return (
    <>
      <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ListBulletIcon className="w-5 h-5 text-[var(--accent)]" />
            <span className="font-bold text-[var(--text)]">
              لیست اخبار
              {totalCount > 0 && (
                <span className="text-[var(--muted)] text-sm mr-2">
                  ({totalCount})
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {posts.length === 0 && !isLoading ? (
          <div className="w-full bg-[var(--surface)] rounded-xl border border-[var(--border)] p-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
              <PencilSquareIcon className="w-8 h-8 text-[var(--muted)]" />
            </div>
            <p className="text-center text-[var(--text)] font-medium">
              هنوز هیچ محتوایی اضافه نشده است.
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div
                key={post.id}
                className="group w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 flex flex-col md:flex-row h-auto md:h-52 shadow-md"
              >
                <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-full relative overflow-hidden">
                  {post.coverImageAddress ? (
                    <img
                      src={`${BucketAdd}/${post.coverImageAddress}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => {
                        e.target.src = "https://via.placeholder.com/1080x720";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.2)] text-[var(--muted)]">
                      بدون تصویر
                    </div>
                  )}
                  <div className="absolute top-2 right-2 md:hidden bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {convertToJalali(post.publishDate)}
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/4">
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[var(--muted)] text-sm line-clamp-2 leading-relaxed hidden md:block">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-2 text-[var(--muted)] text-xs">
                        <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
                        <span>{convertToJalali(post.publishDate)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/Posts/postdetail/${post.id}`)}
                      className="text-xs bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent)] hover:text-black text-[var(--text)] border border border-[var(--border)] px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      مشاهده کامل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div
          ref={observerTarget}
          className="w-full py-6 flex flex-col justify-center items-center gap-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]"></div>
          )}
          {!hasNextPage && posts.length > 0 && (
            <p className="text-xs text-[var(--muted)] text-center tracking-widest bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)]">
              شما به انتهای مطالب وبلاگ رسیده‌اید
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default function PostItems() {
  return (
    <PageCacheManager cacheKey="postS_list">
      {(cacheProps) => <PostItemsContent {...cacheProps} />}
    </PageCacheManager>
  );
}
