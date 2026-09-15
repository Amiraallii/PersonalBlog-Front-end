import type { PostContentType } from "../constants/postContentTypes";

export interface PostContent {
  id?: number;
  contentType: PostContentType;
  order: number;
  content?: string;
  media?: File | null;
  mediaAddress?: string | null;
}

export interface PostContentFormState extends PostContent {
  clientId: string;
}