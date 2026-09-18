import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/16/solid";
import swal from "sweetalert";

import { useAuth } from "../../../context/AuthContext";
import { CommentService } from "../services";
import type { Comment } from "../types";
import CommentItems from "./CommentItems";
import CommentInput from "./CommentInput";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";

interface CommentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  postId: string;
}
const PAGE_SIZE = 10;

const CommentModal = ({ isOpen, closeModal, postId }: CommentModalProps) => {
  const { isAuthenticated } = useAuth();
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fetchComments = useCallback(
    async (currentSkip: number) => {
      if (!isOpen || !postId) {
        return {
          items: [],
          hasNextPage: false,
          totalCount: 0,
        };
      }

      const data = await CommentService.getByPostId(
        postId,
        PAGE_SIZE,
        currentSkip,
      );

      return {
        items: data.items ?? [],
        hasNextPage: data.hasNextPage,
        totalCount: data.totalCount ?? 0,
      };
    },
    [isOpen, postId],
  );
  const {
    items: fetchedItems,
    isLoading,
    hasNextPage,
    observerTarget,
    totalCount,
    resetList,
  } = useInfiniteScroll<Comment>({
    pageSize: PAGE_SIZE,
    fetchData: fetchComments,
  });

  useEffect(() => {
    if (fetchedItems && fetchedItems.length > 0) {
      setLocalComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const filteredNew = fetchedItems.filter((c) => !existingIds.has(c.id));
        return [...prev, ...filteredNew];
      });
    }
  }, [fetchedItems]);

  useEffect(() => {
    if (!isOpen) {
      setLocalComments([]);
      resetList();
    }
  }, [isOpen, resetList]);

  const handleSendComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      const newComment = await CommentService.create({
        postId,
        content,
        parentId,
      });

      setLocalComments((prev) => [...prev, newComment]);
      setParentId(null);
      swal("موفق", "نظر شما با موفقیت ثبت شد", "success");
    } catch (error) {
      console.error(error);
      swal("خطا", "ارسال نظر با مشکل مواجه شد", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await CommentService.delete(commentId);
      setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error(error);
      swal("خطا", "حذف نظر انجام نشد", "error");
    }
  };

  return (
    <Transition show={isOpen}>
      <Dialog as="div" className="relative z-[2000]" onClose={closeModal}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-end justify-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <DialogPanel className="fixed bottom-0 left-0 right-0 h-[80vh] flex flex-col transform overflow-hidden rounded-t-3xl bg-[var(--surface)] shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 flex-shrink-0">
                  <DialogTitle className="text-lg font-semibold text-[var(--text)]">
                    نظرات{" "}
                    {totalCount > 0 && (
                      <span className="text-xs text-[var(--muted)]">
                        ({totalCount})
                      </span>
                    )}
                  </DialogTitle>
                  <button
                    onClick={closeModal}
                    className="rounded-lg p-1 hover:bg-[var(--border)] transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-[var(--muted)]" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <CommentItems
                    comments={localComments}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    setParentId={setParentId}
                    onDeleteComment={handleDeleteComment}
                    onActionStart={() => setIsSubmitting(true)}
                    onActionEnd={() => setIsSubmitting(false)}
                  />
                  <div
                    ref={observerTarget}
                    className="w-full py-6 flex flex-col justify-center items-center gap-2"
                  >
                    {isLoading && (
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]"></div>
                    )}
                    {!hasNextPage && localComments.length > 0 && (
                      <p className="text-xs text-[var(--muted)] text-center tracking-widest bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)]">
                        شما به انتهای بخش نظرات ها رسیده‌اید
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[var(--border)] px-6 py-4 flex-shrink-0 bg-[var(--surface)]">
                  {isAuthenticated ? (
                    <CommentInput
                      isSubmitting={isSubmitting}
                      onSendComment={handleSendComment}
                    />
                  ) : (
                    <p className="text-sm text-[var(--muted)] text-center">
                      برای ثبت نظر باید وارد{" "}
                      <NavLink
                        className="text-[var(--accent)] font-medium underline"
                        to="/Login"
                      >
                        حساب کاربری
                      </NavLink>{" "}
                      خود شوید.
                    </p>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CommentModal;
