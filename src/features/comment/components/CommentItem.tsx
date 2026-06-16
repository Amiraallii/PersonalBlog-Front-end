import { useAuth } from "../../../context/AuthContext";
import { convertToJalali } from "../../../utils/dateHelper";
import type { Comment } from "../types";
import { useLongPress } from "../../../hooks/useLongPress";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  setParentId: (id: string | null) => void;
  isSubmitting: boolean;
  onDeleteSuccess: (id: string | number) => void;
  onActionStart: () => void;
  onActionEnd: () => void;
  onShowRepliesClick?: (commentId: string | number) => void;
}

const CommentItem = ({
  comment,
  setParentId,
  isSubmitting,
  onDeleteSuccess,
  onActionStart,
  onActionEnd,
  onShowRepliesClick,
}: CommentItemProps) => {
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState<boolean>(false);
  const { currentUserId } = useAuth();
  const isOwner = comment.authorId === currentUserId;

  const replyCountNumber = Number(comment.replyCount || 0);
  const longPressHooks = useLongPress({
    onLongPress: () => {
      setShowActionMenu(true);
    },
    onClick: () => {
      if (replyCountNumber > 0) {
        handleToggleReplies();
      }
    },
    delay: 1000, 
  });

  const handleDelete = async () => {
    onActionStart();
    try {
      onDeleteSuccess(comment.id);
    } finally {
      onActionEnd();
    }
  };
  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setParentId(comment.id);
  };
  const handleToggleReplies = () => {
    const nextState = !areRepliesVisible;
    setAreRepliesVisible(nextState);
    
    onShowRepliesClick?.(comment.id);
  };
  return (
    <div className="relative w-full bg-[var(--surface)] mb-2 rounded-xl border border-[var(--border)] p-3 transition-colors select-none">
      
      <div {...longPressHooks} className="flex gap-3 active:bg-[rgba(255,255,255,0.02)] rounded-lg p-1 transition-colors cursor-pointer">
        <div className="w-9 h-9 bg-[var(--accent)] text-black font-bold rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
          {comment.authorName?.charAt(0) || "؟"}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[var(--text)] truncate">{comment.authorName}</span>
            <span className="text-[10px] text-[var(--muted)]">{convertToJalali(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line break-words">{comment.content}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={handleReplyClick}
              className="text-xs text-[var(--muted)] hover:text-[var(--accent)] font-medium transition-colors"
            >
              پاسخ
            </button>
          </div>
        </div>
      </div>

      {replyCountNumber > 0 && (
        <div className="flex items-center gap-3 mt-3 mr-12">
          <span className="w-8 h-[1px] bg-[var(--border)] inline-block"></span>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleReplies(); }}
            className="text-xs text-[var(--accent)] font-semibold hover:underline"
          >
            {areRepliesVisible ? "پنهان کردن پاسخ‌ها" : `مشاهده همه پاسخ‌ها (${comment.replyCount})`}
          </button>
        </div>
      )}

      {showActionMenu && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in" onClick={() => setShowActionMenu(false)}>
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl p-2 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center py-3 border-b border-[var(--border)] text-xs text-[var(--muted)]">
              مدیریت کامنت {comment.authorName}
            </div>
            
            {isOwner ? (
              <button 
                onClick={handleDelete}
                disabled={isSubmitting}
                className="w-full text-center py-3.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                پاک کردن کامنت
              </button>
            ) : (
              <button 
                onClick={() => { setShowActionMenu(false); alert("گزارش تخلف ثبت شد."); }}
                className="w-full text-center py-3.5 text-sm font-bold text-orange-500 hover:bg-orange-500/10 rounded-xl transition-colors"
              >
                گزارش دادن (Report)
              </button>
            )}
            
            <button 
              onClick={() => setShowActionMenu(false)}
              className="w-full text-center py-3.5 text-sm font-medium text-[var(--text)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] mt-1 rounded-xl transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
