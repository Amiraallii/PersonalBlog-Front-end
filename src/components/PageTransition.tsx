import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useSwipeNavigationContext } from "../context/SwipeNavigationContext";
import { menuPaths } from "../routes/menuConfig";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const { isSwipeNavigationRef } = useSwipeNavigationContext();
  const previousIndex = useRef<number>(0);

  const direction = useMemo(() => {
    const currentIndex = menuPaths.indexOf(location.pathname);

    if (currentIndex === -1) {
      return 0;
    }

    const dir = currentIndex > previousIndex.current ? 1 : -1;

    previousIndex.current = currentIndex;

    return dir;
  }, [location.pathname]);
  const shouldSkipAnimation = isSwipeNavigationRef.current;

  if (shouldSkipAnimation) {
    isSwipeNavigationRef.current = false;
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        initial={
          shouldSkipAnimation
            ? false
            : {
                x: direction > 0 ? 80 : -80,
                opacity: 0,
              }
        }
        animate={{
          x: 0,
          opacity: 1,
        }}
        exit={
          shouldSkipAnimation
            ? undefined
            : {
                x: direction > 0 ? -80 : 80,
                opacity: 0,
              }
        }
        transition={
          shouldSkipAnimation
            ? { duration: 0 }
            : {
                duration: 0.25,
                ease: "easeOut",
              }
        }
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
