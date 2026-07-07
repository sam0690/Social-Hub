import { postServices } from '@/services/postServices'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetPostByUsername = (username: string) => {
    return useInfiniteQuery({
        queryKey: ["posts-by-username", username],
        queryFn: ({pageParam}) => postServices.getPostByUsername({
            username, 
            cursor: pageParam, 
            limit: 10,
        }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        enabled: !!username,
        staleTime: 0,
        refetchOnMount: true,
        retry: false,
    });
}

export const useGetUsersWhoLikedPost = (postId: string, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: ["users-who-liked-post", postId],
        queryFn: ({pageParam}) => postServices.getUsersWhoLikedPost({
            postId, 
            cursor: pageParam,
            limit: 10,
        }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        enabled: !!postId && enabled,
        staleTime: 0,
        refetchOnMount: true,
        retry: false,
    });
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) =>
            postServices.likePost({ postId }),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey:["posts"]})
            await queryClient.cancelQueries({ queryKey: ["post", postId] });
            const previousPost = queryClient.getQueryData(["post", postId]);
            queryClient.setQueryData(["post", postId], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    isLiked: true,
                    likeCount: old.likeCount + 1,
                };
            });
            return { previousPost };
        },
        onError: (_err, postId, context) => {
            queryClient.setQueryData(["post", postId], context?.previousPost);
        },
        onSettled: (_, _err, postId) => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });
}
export const useUnlikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) =>
            postServices.unlikePost({ postId }),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["post", postId] });
            const previousPost = queryClient.getQueryData(["post", postId]);
            queryClient.setQueryData(["post", postId], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    isLiked: false,
                    likeCount: old.likeCount - 1,
                };
            });
            return { previousPost };
        },
        onError: (_err, postId, context) => {
            queryClient.setQueryData(["post", postId], context?.previousPost);
        },
        onSettled: (_, _err, postId) => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });
}