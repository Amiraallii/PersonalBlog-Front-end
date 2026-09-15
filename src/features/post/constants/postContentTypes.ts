export const POST_CONTENT_TYPES = {
  TEXT: 0,
  HEADING: 1,
  IMAGE: 2,
  VIDEO: 3,
} as const;

export type PostContentType =
  (typeof POST_CONTENT_TYPES)[keyof typeof POST_CONTENT_TYPES];