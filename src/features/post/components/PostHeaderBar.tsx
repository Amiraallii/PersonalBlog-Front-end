import { useNavigate } from "react-router-dom"; 
import { ROLES } from "../../../types/auth";
import { useAuth } from "../../../context/AuthContext";

const PostHeaderBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || role !== ROLES.ADMIN) return null;

  return (
    <>
      <button 
        onClick={() => navigate("/Posts/newPost")}
        className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mb-4"
      >
        پست جدید +
      </button>
    </>
  );
};

export default PostHeaderBar;
