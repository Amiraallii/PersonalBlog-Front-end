import { useState } from "react";
import swal from "sweetalert";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface CommentInputProps {
  isSubmitting: boolean;
  onSendComment: (content: string) => void;
}

const CommentInput = ({ isSubmitting, onSendComment }: CommentInputProps) => {
  const [content, setContent] = useState<string>("");

  const handleSubmit = () => {
    if (!content.trim()) {
      swal("خطا", "لطفا نظر خود را بنویسید", "warning");
      return;
    }
    onSendComment(content.trim());
    setContent("");
  };

  return (
    <div className="flex gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="نظر خود را بنویسید..."
        className="flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
        rows={2} 
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="text-[var(--accent)] rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-2"
      >
        {isSubmitting ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
        )}
      </button>
    </div>
  );
};

export default CommentInput;