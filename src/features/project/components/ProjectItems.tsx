import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  PencilSquareIcon,
  ListBulletIcon,
  CalendarDaysIcon,
} from "@heroicons/react/16/solid";

import { projectService } from "../services";
import { convertToJalali } from "../../../utils/dateHelper";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import PageCacheManager from "../../../components/PageCacheManager";

const ProjectItemsContent = ({
  cachedItems,
  cachedHasNextPage,
  cachedTotalCount,
  scrollY,
  saveCache,
}: any) => {
  const navigate = useNavigate();

  const formatLink = (link: string): string => {
    if (!link) return "#";
    return link.startsWith("http://") || link.startsWith("https://")
      ? link
      : `https://${link}`;
  };

  const PAGE_SIZE = 10;

  const {
    items: projects,
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

      const data = (await projectService.getAll(PAGE_SIZE, currentSkip)) as any;

      return {
        items: data.items || [],
        hasNextPage: data.hasNextPage,
        totalCount: data.totalCount || 0,
      };
    },
  });
  useEffect(() => {
    if (projects.length > 0 && scrollY > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: "instant" });
        });
      });
    }
  }, [projects.length, scrollY]);
  useEffect(() => {
    if (projects.length > 0) {
      saveCache(projects, projects.length, hasNextPage, totalCount);
    }
  }, [projects.length, hasNextPage, totalCount]);

  return (
    <>
      <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ListBulletIcon className="w-5 h-5 text-[var(--accent)]" />
            <span className="font-bold text-[var(--text)]">لیست تجربه‌ها</span>
            {totalCount > 0 && (
              <span className="text-[var(--muted)] text-sm mr-2">
                ({totalCount})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {projects.length === 0 && !isLoading ? (
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
            {projects.map((project) => (
              <div
                key={project.id}
                className="group w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 flex flex-col md:flex-row h-auto md:h-52 shadow-md"
              >
                <div className="p-4 md:p-6 flex flex-col justify-between w-full">
                  <div
                    onClick={() => navigate(`/projects/Detail/${project.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-bold text-lg md:text-xl text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[var(--muted)] text-sm line-clamp-2 leading-relaxed mb-1">
                      {project.summary}
                    </p>
                    <p className="text-[var(--muted)] text-xs mb-2 italic">
                      کارفرما: {project.owner}
                    </p>
                    <a
                      href={formatLink(project.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{project.link}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-1 text-[var(--muted)] text-xs">
                      <CalendarDaysIcon className="w-4 h-4 text-[var(--accent)]" />
                      <span>شروع: {convertToJalali(project.startDate)}</span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center gap-1 text-[var(--muted)] text-xs">
                        <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
                        <span>پایان: {convertToJalali(project.endDate)}</span>
                      </div>
                    )}
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
          {!hasNextPage && projects.length > 0 && (
            <p className="text-xs text-[var(--muted)] text-center tracking-widest bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)]">
              شما به انتهای بخش تجربه ها رسیده‌اید
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default function ProjectItems() {
  return (
    <PageCacheManager cacheKey="projects_list">
      {(cacheProps) => <ProjectItemsContent {...cacheProps} />}
    </PageCacheManager>
  );
}
