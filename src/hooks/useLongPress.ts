import { useState, useEffect, useRef, useCallback } from "react";

interface UseLongPressOptions {
  onLongPress: (e: any) => void;
  onClick?: (e: any) => void;
  delay?: number;
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 3000,
}: UseLongPressOptions) {
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  const start = useCallback(
    (e: any) => {
      if (e.type === "mousedown" && e.button !== 0) return;

      hasMovedRef.current = false;
      setIsPressing(true);

      timerRef.current = setTimeout(() => {
        if (!hasMovedRef.current) {
          onLongPress(e);
        }
      }, delay);
    },
    [onLongPress, delay],
  );

  const stop = useCallback(
    (e: any) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (isPressing && !hasMovedRef.current && timerRef.current) {
        onClick?.(e);
      }

      setIsPressing(false);
    },
    [isPressing, onClick],
  );

  const move = useCallback(() => {
    hasMovedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsPressing(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: move,
  };
}
