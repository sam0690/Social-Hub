import { queryKeys } from "@/query-keys";
import { postServices } from "@/services/postServices";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { postId: string; content: string; parentCommentId?: string }) =>
            postServices.createComment(data),
        onSuccess: (_, variables) => {
            if (variables.parentCommentId) {
                queryClient.invalidateQueries({ queryKey: ["comments", "replies", variables.parentCommentId] });
            }
            queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
        }
    })
}

export function useGetComments(postId: string) {
    return useInfiniteQuery({
        queryKey: ["comments", postId],
        queryFn: ({ pageParam }) => postServices.getComments({
            postId,
            cursor: pageParam,
            limit: 10
        }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
        enabled: !!postId,
    })
}

export function useGetReplyComments(commentId: string) {
    return useInfiniteQuery({
        queryKey: ["comments", "replies", commentId],
        queryFn: ({ pageParam }) => postServices.getReplyComments({
            commentId,
            cursor: pageParam,
            limit: 10
        }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
        enabled: !!commentId,
    })
}

export const useLikeComment = () => {
    return useMutation({
        mutationFn: (commentId: string) =>
            postServices.likeComment({ commentId })
    });
}

export const useUnlikeComment = () => {
    return useMutation({
        mutationFn: (commentId: string) =>
            postServices.unlikeComment({ commentId })
    });
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postServices.deleteComment({ commentId }),

    onMutate: async (commentId) => {
      // Cancel any in-flight refetches
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      // Snapshot previous state in case we need to roll back
      const previousData = queryClient.getQueriesData({ queryKey: ["comments"] });

      // Remove comment from cache immediately
      queryClient.setQueriesData({ queryKey: ["comments"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((c: any) => c.id !== commentId),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _commentId, context) => {
      // Roll back on failure
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
