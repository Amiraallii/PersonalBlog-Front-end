import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { projectService } from "../services";
import swal from "sweetalert";
import {
  CalendarDaysIcon,
  CalendarIcon,
  PencilSquareIcon,
} from "@heroicons/react/16/solid";
import { convertToJalali } from "../../../utils/dateHelper";
import type { Project } from "../types";
const formatLink = (link: string): string => {
  if (!link) return "#";
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }
  return `https://${link}`;
};
const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (projectId: string) => {
      try {
        const result = await projectService.getById(projectId);
        setProjectDetail(result);
      } catch (error) {
        swal("خطا", "ارتباط با سرور برقرار نشد!", "error");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <div className="w-full flex flex-col gap-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      ) : !projectDetail ? (
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
          <div className="group w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 flex flex-col md:flex-row h-auto md:h-52 shadow-md">
            <div className="p-4 md:p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/4">
              <div>
                <h1 className="font-bold text-lg md:text-xl text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {projectDetail.title}
                </h1>
                <p className="text-[var(--muted)] text-sm line-clamp-2 leading-relaxed md:block">
                  {projectDetail.summary}
                </p>
                <span>توسط {projectDetail.owner}</span>
                <a
                  href={formatLink(projectDetail.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm line-clamp-1 leading-relaxed flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
                >
                  <span className="line-clamp-1">{projectDetail.link}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>

              <div className="flex items-center justify-between mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] text-xs">
                    <CalendarDaysIcon className="w-4 h-4 text-[var(--accent)]" />
                    <span>تاریخ شروع:</span>
                    <span>{convertToJalali(projectDetail.startDate)}</span>
                  </div>

                  {projectDetail.endDate && (
                    <div className="flex items-center gap-2 text-[var(--muted)] text-xs">
                      <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
                      <span>تاریخ پایان:</span>
                      <span>{convertToJalali(projectDetail.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
