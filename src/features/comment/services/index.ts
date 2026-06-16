import { api } from "../../../services/api";
import type { Comment, CommentResponse, CreateCommentDTO } from "../types";

export const CommentService = {
  getByPostId: async (postId: string | number, size: number, skip: number): Promise<CommentResponse> => {
    const response = await api.get<CommentResponse>(`/Comment/GetAllPostComments?PostId=${postId}&Size=${size}&Skip=${skip}`);
    return response.data;
  },

  create: async (data: CreateCommentDTO): Promise<Comment> => {
    const response = await api.post<Comment>("/Comment/AddComment", data);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/Comment/DeleteComment?id=${id}`);
  },

  getReplies: async (parentId: string, skip: number = 0, pageSize: number = 10): Promise<CommentResponse> => {
    const response = await api.get<CommentResponse>("/Comment/GetCommentReplies", {
      params: {
        ParentId: parentId,
        Skip: skip,
        PageSize: pageSize
      }
    });
    return response.data;
  }
};