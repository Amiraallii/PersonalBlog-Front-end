import { type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode; 
  className?: string;  
  id: string;          
}

export default function HorizontalScroll({ children, className = "", id }: HorizontalScrollProps) {
  return (
    <div
      id={id}
      className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 disable-swipe ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {children}
    </div>
  );
}