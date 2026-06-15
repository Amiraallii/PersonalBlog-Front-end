import { useState, type TouchEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { convertToJalali } from "../../../utils/dateHelper";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
  setParentId: (id: string | number | null) => void;
  isSubmitting: boolean;
  onDeleteSuccess: (id: string | number) => void;
  onActionStart: () => void;
  onActionEnd: () => void;
}

const CommentItem = ({
  comment,
  setParentId,
  isSubmitting,
  onDeleteSuccess,
  onActionStart,
  onActionEnd
}: CommentItemProps) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  
  const { currentUserId } = useAuth();
  const isOwner = comment.authorId === currentUserId;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (isOwner && diff < 0) {
      setSwipeOffset(Math.max(diff, -80));
    } else if (diff > 0) {
      setSwipeOffset(Math.min(diff, 160));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swipeOffset < -40) {
      setSwipeOffset(-80);
    } else if (swipeOffset > 40 && swipeOffset < 100) {
      setSwipeOffset(80);
    } else if (swipeOffset >= 100) {
      setSwipeOffset(160);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleDelete = async () => {
    onActionStart();
    try {
      onDeleteSuccess(comment.id);
    } finally {
      onActionEnd();
      setSwipeOffset(0);
    }
  };

  const handleReply = () => {
    setParentId(comment.id);
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden bg-[var(--surface)] mb-4">
      <div className="absolute inset-0 flex justify-between">
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="absolute right-1 top-1 bottom-1 w-20 bg-red-500 flex items-center justify-center rounded-lg"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        <div className="absolute left-1 top-1 bottom-1 flex gap-1">
          <button
            onClick={handleReply}
            disabled={isSubmitting}
            className="w-20 bg-blue-500 flex items-center justify-center rounded-lg"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={() => setSwipeOffset(0)}
            disabled={isSubmitting}
            className="w-20 bg-gray-500 flex items-center justify-center rounded-lg"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="relative bg-[var(--surface)] transition-transform duration-200 ease-out touch-pan-y"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-3 pb-4 border-b border-[var(--border)] last:border-0 bg-[var(--surface)] p-2">
          <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {comment.authorName?.charAt(0) || "؟"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[var(--text)]">{comment.authorName}</span>
              <span className="text-xs text-[var(--muted)]">{convertToJalali(comment.createdAt)}</span>
            </div>
            <p className="text-[var(--text)] leading-relaxed whitespace-pre-line">{comment.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;