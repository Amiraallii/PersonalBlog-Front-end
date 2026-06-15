import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface SwipeNavigationContextType {
  isSwipeNavigationRef: React.MutableRefObject<boolean>;
}

const SwipeNavigationContext =
  createContext<SwipeNavigationContextType | null>(null);

export function SwipeNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isSwipeNavigationRef = useRef(false);

  return (
    <SwipeNavigationContext.Provider
      value={{ isSwipeNavigationRef }}
    >
      {children}
    </SwipeNavigationContext.Provider>
  );
}

export function useSwipeNavigationContext() {
  const context = useContext(SwipeNavigationContext);

  if (!context) {
    throw new Error(
      "useSwipeNavigationContext must be used داخل SwipeNavigationProvider"
    );
  }

  return context;
}