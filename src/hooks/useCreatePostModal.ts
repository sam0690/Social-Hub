"use client";

import { useContext } from "react";
import { CreatePostContext } from "@/providers/create-post-provider";
import { useMutation } from '@tanstack/react-query';
import { postServices } from "@/services/postServices";

export function useCreatePostModal() {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error("useCreatePostModal must be used within CreatePostProvider");
  }
  return context;
}

type CreatePostPayload = {
  content: string;
  visibility?: "PUBLIC" | "PRIVATE" | "FOLLOWERS";
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => {
      return postServices.createPost({
        content: payload.content,
        visibility: payload.visibility ?? "PUBLIC",
      });
    },
  });
}