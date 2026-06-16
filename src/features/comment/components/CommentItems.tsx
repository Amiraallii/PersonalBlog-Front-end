import { useState } from "react";
import CommentItem from "./CommentItem";
import { CommentService } from "../services";
import type { Comment } from "../types";

interface CommentItemsProps {
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  setParentId: (id: string | null) => void;
  onDeleteComment: (id: string | number) => void;
  onActionStart: () => void;
  onActionEnd: () => void;
}

interface PageInfo {
  skip: number;
  hasNextPage: boolean;
}

const CommentItems = ({
  comments,
  isLoading,
  isSubmitting,
  setParentId,
  onDeleteComment,
  onActionStart,
  onActionEnd
}: CommentItemsProps) => {
  
  const [repliesMap, setRepliesMap] = useState<Record<string, Comment[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [visibleRepliesState, setVisibleRepliesState] = useState<Record<string, boolean>>({});
  
  const [pageInfoMap, setPageInfoMap] = useState<Record<string, PageInfo>>({});

  const PAGE_SIZE = 10;

  const handleToggleRepliesFetch = async (commentId: string | number) => {
    const idStr = String(commentId);
    const isCurrentlyVisible = !!visibleRepliesState[idStr];
    
    setVisibleRepliesState(prev => ({ ...prev, [idStr]: !isCurrentlyVisible }));

    if (isCurrentlyVisible || repliesMap[idStr]) return;

    await loadMoreReplies(idStr, 0);
  };

  const loadMoreReplies = async (parentIdStr: string, currentSkip: number) => {
    setLoadingReplies((prev) => ({ ...prev, [parentIdStr]: true }));
    try {
      const data = await CommentService.getReplies(parentIdStr, currentSkip, PAGE_SIZE);
      
      setRepliesMap((prev) => ({
        ...prev,
        [parentIdStr]: [...(prev[parentIdStr] || []), ...(data.items || [])]
      }));

      setPageInfoMap((prev) => ({
        ...prev,
        [parentIdStr]: {
          skip: currentSkip + PAGE_SIZE,
          hasNextPage: data.hasNextPage 
        }
      }));
    } catch (error) {
      console.error("خطا در دریافت پاسخ‌ها:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [parentIdStr]: false }));
    }
  };

  const CommentSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-10 h-10 bg-[var(--border)] rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--border)] rounded w-1/4"></div>
            <div className="h-3 bg-[var(--border)] rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (comments.length === 0 && !isLoading) {
    return (
      <p className="text-center text-[var(--muted)] text-sm py-6">
        هنوز هیچ نظری اضافه نشده است.
      </p>
    );
  }

  const rootComments = comments.filter(c => !c.parentId);

  return (
    <>
      <div className="space-y-1">
        {rootComments.map((comment) => {
          const isReplySectionOpen = !!visibleRepliesState[comment.id];
          const pageInfo = pageInfoMap[comment.id] || { skip: 0, hasNextPage: false };

          return (
            <div key={comment.id} className="w-full flex flex-col">
              
              <CommentItem
                comment={comment}
                setParentId={setParentId}
                isSubmitting={isSubmitting}
                onDeleteSuccess={onDeleteComment}
                onActionStart={onActionStart}
                onActionEnd={onActionEnd}
                onShowRepliesClick={handleToggleRepliesFetch}
              />

              {isReplySectionOpen && (
                <div className="mr-12 border-r border-[var(--border)] pr-3 space-y-1 mb-2 animate-fade-in">
                  
                  {repliesMap[comment.id]?.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      setParentId={setParentId}
                      isSubmitting={isSubmitting}
                      onDeleteSuccess={onDeleteComment}
                      onActionStart={onActionStart}
                      onActionEnd={onActionEnd}
                    />
                  ))}

                  {loadingReplies[comment.id] && (
                    <p className="text-xs text-[var(--accent)] animate-pulse py-1">
                      در حال بارگذاری پاسخ‌ها...
                    </p>
                  )}

                  {pageInfo.hasNextPage && !loadingReplies[comment.id] && (
                    <div className="pt-1 pb-2">
                      <button
                        onClick={() => loadMoreReplies(String(comment.id), pageInfo.skip)}
                        className="text-xs text-[var(--muted)] hover:text-[var(--accent)] font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-4 h-[1px] bg-[var(--border)] inline-block"></span>
                        مشاهده پاسخ‌های بیشتر...
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {isLoading && <CommentSkeleton />}
    </>
  );
};

export default CommentItems;