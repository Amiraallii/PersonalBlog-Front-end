import { useNavigate } from "react-router-dom";
import ProjectItems from "./ProjectItems";
import { RouteGuard } from "../../../components/RouteGuard";
import { ROLES } from "../../../types/auth";
import SEO from "../../../shared/seo/SEO";
import PersonStructuredData from "../../../shared/seo/PersonStructuredData";

const Projects = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="تجربه های امیرعلی آقایی | Amirali Aghaei"
        description="تجربه ها و پروژه های امیرعلی آقایی پور؛ مهندس نرم‌افزار و توسعه‌دهنده نرم‌افزار."
        canonical="https://amirali.me/AboutMe"
      />

      <PersonStructuredData
        name="امیرعلی آقایی پور"
        alternateName="Amirali Aghaei"
        description="مهندس نرم‌افزار و توسعه‌دهنده نرم‌افزار."
        sameAs={
          [
            "https://github.com/Amiraallii",
            "https://www.linkedin.com/in/amiraallii/",
            "https://charvandclub.com/"
          ]
        }
      />
      <div className="flex flex-wrap gap-3 mb-4">
        <RouteGuard allowedRoles={[ROLES.ADMIN]}>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            onClick={() => navigate("/Projects/AddNewProject")}
          >
            پروژه جدید +
          </button>
        </RouteGuard>

        <RouteGuard allowedRoles={[ROLES.USER, ROLES.ADMIN]}>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            onClick={() => navigate("/Projects/RequestNewProject")}
          >
            درخواست پروژه
          </button>
        </RouteGuard>
      </div>

      <ProjectItems />
    </>
  );
};

export default Projects;
