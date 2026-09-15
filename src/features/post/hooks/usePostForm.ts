import { useCallback, useState } from "react";

import { POST_CONTENT_TYPES } from "../constants/postContentTypes";
import type { PostContentFormState } from "../types/postContent";

const createEmptyContent = (order: number): PostContentFormState => ({
  clientId: crypto.randomUUID(),
  contentType: POST_CONTENT_TYPES.TEXT,
  order,
  content: "",
  media: null,
  mediaAddress: null,
});

export const usePostForm = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageAddress, setCoverImageAddress] = useState("");

  const [postContents, setPostContents] = useState<PostContentFormState[]>([]);

  const addContent = useCallback(() => {
    setPostContents((current) => [
      ...current,
      createEmptyContent(current.length),
    ]);
  }, []);

  const removeContent = useCallback((clientId: string) => {
    setPostContents((current) =>
      current
        .filter((item) => item.clientId !== clientId)
        .map((item, index) => ({
          ...item,
          order: index,
        })),
    );
  }, []);

  const updateContent = useCallback(
    <K extends keyof PostContentFormState>(
      clientId: string,
      field: K,
      value: PostContentFormState[K],
    ) => {
      setPostContents((current) =>
        current.map((item) =>
          item.clientId === clientId
            ? {
                ...item,
                [field]: value,
              }
            : item,
        ),
      );
    },
    [],
  );

  const initialize = useCallback(
    (data: {
      title: string;
      summary: string;
      publishDate: string;
      coverImageAddress?: string;
      postContents: PostContentFormState[];
    }) => {
      setTitle(data.title);
      setSummary(data.summary);
      setPublishDate(data.publishDate);
      setCoverImage(null);
      setCoverImageAddress(data.coverImageAddress ?? "");
      setPostContents(data.postContents);
    },
    [],
  );

  return {
    title,
    setTitle,

    summary,
    setSummary,

    publishDate,
    setPublishDate,

    coverImage,
    setCoverImage,

    coverImageAddress,
    setCoverImageAddress,

    postContents,
    setPostContents,

    addContent,
    removeContent,
    updateContent,

    initialize,
  };
};
