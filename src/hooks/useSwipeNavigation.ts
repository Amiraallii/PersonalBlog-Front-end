import { useEffect, useRef, type RefObject } from "react";

interface UseSwipeNavigationOptions {
  elementRef: RefObject<HTMLElement | null>;

  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;

  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;

  threshold?: number;

  excludeSelector?: string;
}

export function useSwipeNavigation({
  elementRef,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft = true,
  canSwipeRight = true,
  threshold = 0.3,
  excludeSelector,
}: UseSwipeNavigationOptions) {
  const startX = useRef(0);
  const startY = useRef(0);

  const currentX = useRef(0);

  const isDragging = useRef(false);

  const isHorizontal = useRef(false);

  const isBlockedDirection = useRef(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (
        excludeSelector &&
        (e.target as HTMLElement)?.closest(excludeSelector)
      ) {
        return;
      }
      const touch = e.touches[0];

      startX.current = touch.clientX;
      startY.current = touch.clientY;

      currentX.current = 0;

      isDragging.current = true;
      isHorizontal.current = false;
      isBlockedDirection.current = false;
      element.style.transition = "none";
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      const touch = e.touches[0];
      const diffX = touch.clientX - startX.current;
      const diffY = touch.clientY - startY.current;
      if (diffX > 0 && !canSwipeRight) {
        isBlockedDirection.current = true;
        return;
      }

      if (diffX < 0 && !canSwipeLeft) {
        isBlockedDirection.current = true;
        return;
      }

      if (!isHorizontal.current) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          if (Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        isHorizontal.current = true;
      } else {
        isDragging.current = false;
        return;
      }
        }
      }

      if (!isHorizontal.current) return;

      currentX.current = diffX;

      element.style.transform = `translateX(${diffX}px)`;
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;

      if (isBlockedDirection.current) {
        isDragging.current = false;

        element.style.transition = "transform 250ms ease";

        element.style.transform = "translateX(0)";

        return;
      }

      const isRight = currentX.current > 0;

      if (isRight && !canSwipeRight) {
        isDragging.current = false;

        element.style.transition = "transform 250ms ease";
        element.style.transform = "translateX(0)";

        return;
      }

      if (!isRight && !canSwipeLeft) {
        isDragging.current = false;

        element.style.transition = "transform 250ms ease";
        element.style.transform = "translateX(0)";

        return;
      }
      isDragging.current = false;

      element.style.transition = "transform 250ms ease";

      const width = window.innerWidth;

      const movedRatio = Math.abs(currentX.current) / width;

      if (movedRatio >= threshold) {
        const isRight = currentX.current > 0;

        element.style.transform = `translateX(${isRight ? width : -width}px)`;

        setTimeout(() => {
          if (isRight) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }

          element.style.transition = "none";

          element.style.transform = "translateX(0)";
        }, 250);

        return;
      }

      element.style.transform = "translateX(0)";
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });

    element.addEventListener("touchmove", handleTouchMove, { passive: true });

    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);

      element.removeEventListener("touchmove", handleTouchMove);

      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, threshold]);
}
