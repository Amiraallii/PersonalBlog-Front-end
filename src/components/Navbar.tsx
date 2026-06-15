import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import swal from "sweetalert";
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { path: "/", label: "خانه", icon: HomeIcon },
    { path: "/AboutMe", label: "درباره من", icon: UserIcon },
    { path: "/Projects", label: "تجربه‌ها", icon: BriefcaseIcon },
    { path: "/Posts", label: "بلاگ", icon: BookOpenIcon },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/api/Auth/Logout");
      logout();
      navigate("/login");
    } catch {
      swal("خطا", "ارتباط با سرور برقرار نشد!", "error");
    }
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-theme hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold">
            Amir<span className="text-[var(--accent)]">Ali</span>
          </div>

          <div className="flex gap-8">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "active_nav" : "inactive_nav"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-xs bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent)] hover:text-black text-[var(--text)] border border-[var(--border)] px-4 py-2 rounded-lg transition"
              >
                خروج
              </button>
            ) : (
              <NavLink
                to="/Login"
                className="inactive_nav hover:text-[var(--accent)] transition-colors"
              >
                ورود/ثبت نام
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 z-[1001] h-20 pb-5 bg-[var(--surface)]/90 backdrop-blur-md border-t border-[var(--border)] md:hidden flex items-center justify-around">
        <div className="flex justify-around items-center w-full h-full px-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`
                }
              >
                <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />

                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[var(--background)] border border-[var(--border)] text-[var(--text)] text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl text-red-500 hover:opacity-80 transition-all"
            >
              <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[var(--background)] border border-[var(--border)] text-red-500 text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                خروج
              </span>
            </button>
          ) : (
            <NavLink
              to="/Login"
              className={({ isActive }) =>
                `relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`
              }
            >
              <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[var(--background)] border border-[var(--border)] text-[var(--text)] text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                ورود
              </span>
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
