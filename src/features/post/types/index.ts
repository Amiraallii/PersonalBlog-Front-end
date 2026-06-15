export interface PostResponse {
  items: Post[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface CreatePostDTO {
  title: string;
  publishDate: string;
  summary: string;
  coverImage: string;
  postContents: PostContent[] | null;
}

export interface PostContent {
  content: string;
  contentType: number;
  order: number;
  media: File | null;         
  mediaAddress?: string | null;
}

export interface Post {
  id: string | number;
  title: string;
  publishDate: string;
  summary: string;
  coverImageAddress: string;
  postContents: PostContent[] | null;
}

export interface CreatePostFormState {
  id?: string;
  title: string;
  publishDate: string;
  summary: string;
  coverImage: File | null;
  coverImageAddress?: string;
  postContents: PostContent[];
}