import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ReloadPrompt from "./components/ReloadPrompt";
import {
  Projects,
  ProjectDetail,
  ProjectModify,
  RequestNewProject,
} from "./features/project";
import { Posts, PostDetail, PostInputForm } from "./features/post";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";
import { RouteGuard } from "./components/RouteGuard";
import { ROLES } from "./types/auth";
import { AboutMeIndex, PersonalInfoForm } from "./features/aboutMe";
import { Login, Register } from "./features/Authentication";
import { useRef } from "react";
import { menuPaths } from "./routes/menuConfig";
import PageTransition from "./components/PageTransition";
import { useSwipeNavigationContext } from "./context/SwipeNavigationContext";
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const mainContentRef = useRef<HTMLDivElement>(null);

  const currentMenuIndex = menuPaths.indexOf(pathname);
  const { isSwipeNavigationRef } = useSwipeNavigationContext();
  const isDetailPage =
    pathname.includes("/postdetail/") || pathname.includes("/Detail/");

  const canSwipeLeft = !isDetailPage && currentMenuIndex > 0;

  const canSwipeRight =
    isDetailPage ||
    (currentMenuIndex !== -1 && currentMenuIndex < menuPaths.length - 1);
  useSwipeNavigation({
    elementRef: mainContentRef,
    canSwipeLeft,
    canSwipeRight,
    excludeSelector: ".disable-swipe",
    onSwipeLeft: () => {
      isSwipeNavigationRef.current = true;

      navigate(menuPaths[currentMenuIndex - 1]);
    },

    onSwipeRight: () => {
      isSwipeNavigationRef.current = true;

      if (isDetailPage) {
        navigate(-1);
        return;
      }

      navigate(menuPaths[currentMenuIndex + 1]);
    },
  });
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <ReloadPrompt />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-6 pb-32 md:pt-28 md:pb-10 touch-pan-y">
        <div ref={mainContentRef} className="w-full">
          <PageTransition>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />

              <Route path="/Posts" element={<Posts />} />
              <Route path="/Posts/postdetail/:id" element={<PostDetail />} />

              <Route
                path="/Posts/newPost"
                element={
                  <RouteGuard allowedRoles={[ROLES.ADMIN]} isRoute>
                    <PostInputForm />
                  </RouteGuard>
                }
              />

              <Route
                path="/Posts/newPost/:id"
                element={
                  <RouteGuard allowedRoles={[ROLES.ADMIN]} isRoute>
                    <PostInputForm />
                  </RouteGuard>
                }
              />

              <Route path="/Projects" element={<Projects />} />
              <Route path="/Projects/Detail/:id" element={<ProjectDetail />} />

              <Route
                path="/Projects/AddNewProject"
                element={
                  <RouteGuard allowedRoles={[ROLES.ADMIN]} isRoute>
                    <ProjectModify />
                  </RouteGuard>
                }
              />

              <Route
                path="/Projects/RequestNewProject"
                element={
                  <RouteGuard allowedRoles={[ROLES.USER, ROLES.ADMIN]} isRoute>
                    <RequestNewProject />
                  </RouteGuard>
                }
              />

              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />

              <Route path="/AboutMe" element={<AboutMeIndex />} />

              <Route
                path="/AboutMe/Modify"
                element={
                  <RouteGuard allowedRoles={[ROLES.ADMIN]} isRoute>
                    <PersonalInfoForm />
                  </RouteGuard>
                }
              />
            </Routes>
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default App;
