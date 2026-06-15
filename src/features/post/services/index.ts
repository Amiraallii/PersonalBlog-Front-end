import { api } from "../../../services/api";

import type { CreatePostFormState, Post, PostResponse } from "../types";

const convertToFormData = (data: CreatePostFormState): FormData => {
  const formData = new FormData();
  formData.append("Title", data.title);
  formData.append("Summary", data.summary);
  formData.append("PublishDate", data.publishDate);

  if (data.coverImage instanceof File) {
    formData.append("CoverImage", data.coverImage);
  } else if (data.coverImageAddress) {
    formData.append("CoverImageAddress", data.coverImageAddress);
  }

  data.postContents.forEach((block, index) => {
    formData.append(`PostContents[${index}].ContentType`, block.contentType.toString());
    formData.append(`PostContents[${index}].Order`, index.toString());
    if (block.content) {
      formData.append(`PostContents[${index}].Content`, block.content);
    }
    if (block.media instanceof File) {
      formData.append(`PostContents[${index}].Media`, block.media);
    } else if (block.mediaAddress) {
      formData.append(`PostContents[${index}].MediaAddress`, block.mediaAddress);
    }
  });

  return formData;
};

export const PostService = {
  getAll: async (size: number, skip: number): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(
      `/Posts/GetAllPosts?PageSize=${size}&Skip=${skip}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`/Posts/GetPostById?id=${id}`);
    return response.data;
  },

  create: async (data: CreatePostFormState): Promise<void> => {
    const formData = convertToFormData(data);
    await api.post("/Posts/AddPost", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: async (id: string, data: CreatePostFormState): Promise<void> => {
    const formData = convertToFormData(data);
    formData.append("Id", id);
    await api.put(`/Posts/UpdatePost`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
