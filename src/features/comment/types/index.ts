export interface Comment {
  id: string ;
  postId: string ;
  content: string;
  createdAt: string;
  authorId: string;
  replyCount: string | number;
  authorName: string;
  parentId: string | null;
}

export interface CreateCommentDTO {
  postId: string ;
  content: string;
  parentId: string | null;
}

export interface CommentResponse {
  items: Comment[];
  totalCount: number;
  hasNextPage: boolean;
}