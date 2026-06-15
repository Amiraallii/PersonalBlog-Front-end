import { useNavigate } from "react-router-dom"; 
import { RouteGuard } from "../../../components/RouteGuard";
import { ROLES } from "../../../types/auth";

const PostHeaderBar = () => {
  const navigate = useNavigate();

  return (
    <RouteGuard allowedRoles={[ROLES.ADMIN]}>
      <button 
        onClick={() => navigate("/Posts/newPost")}
        className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mb-4"
      >
        پست جدید +
      </button>
    </RouteGuard>
  );
};

export default PostHeaderBar;