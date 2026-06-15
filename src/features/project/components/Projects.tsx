import { useNavigate } from "react-router-dom";
import ProjectItems from "./ProjectItems";
import { RouteGuard } from "../../../components/RouteGuard"; 
import { ROLES } from "../../../types/auth"; 

const Projects = () => {
  const navigate = useNavigate();

  return (
    <>
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