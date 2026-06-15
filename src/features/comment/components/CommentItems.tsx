import CommentItem from "./CommentItem";
import type { Comment } from "../types";

interface CommentItemsProps {
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  setParentId: (id: string | number | null) => void;
  onDeleteComment: (id: string | number) => void;
  onActionStart: () => void;
  onActionEnd: () => void;
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


  if (comments.length === 0) {
    return (
      <p className="text-center text-[var(--muted)] text-sm py-6">
        هنوز هیچ نظری اضافه نشده است.
      </p>
    );
  }

  return (
  <>
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          setParentId={setParentId}
          isSubmitting={isSubmitting}
          onDeleteSuccess={onDeleteComment}
          onActionStart={onActionStart}
          onActionEnd={onActionEnd}
        />
      ))}
    </div>

    {isLoading && <CommentSkeleton />}
  </>
);
};

export default CommentItems;