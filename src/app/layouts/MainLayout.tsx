import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import ReloadPrompt from "../../components/ReloadPrompt";
import PageTransition from "../../components/PageTransition";

import { useSwipeNavigation } from "../../hooks/useSwipeNavigation";
import { useSwipeNavigationContext } from "../../context/SwipeNavigationContext";

import { menuPaths } from "../../routes/menuConfig";

import AppRoutes from "../routes/AppRoutes";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainContentRef = useRef<HTMLDivElement>(null);

  const { isSwipeNavigationRef } = useSwipeNavigationContext();

  const pathname = location.pathname;

  const currentMenuIndex = menuPaths.indexOf(pathname);

  const isDetailPage =
    pathname.includes("/postdetail/") ||
    pathname.includes("/Detail/");

  const canSwipeLeft =
    !isDetailPage &&
    currentMenuIndex > 0;

  const canSwipeRight =
    isDetailPage ||
    (
      currentMenuIndex !== -1 &&
      currentMenuIndex < menuPaths.length - 1
    );

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
        <div
          ref={mainContentRef}
          className="w-full"
        >
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;