export interface Comment {
  id: string | number;
  postId: string | number;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  parentId: string | number | null;
}

export interface CreateCommentDTO {
  postId: string | number;
  content: string;
  parentId: string | number | null;
}

export interface CommentResponse {
  items: Comment[];
  totalCount: number;
  hasNextPage: boolean;
}