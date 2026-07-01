import { postServices } from '@/services/postServices'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from "@tanstack/react-query";

const listQueryKeys = [
    ["home-feed"],
    ["following-feed"],
    ["trending-feed"],
    ["posts-by-username"],
    ["bookmarks"],
]

const patchPostInInfiniteData = (data: any, postId: string, updater: (post: any) => any) => {
    if (!data?.pages) return data;

    return {
        ...data,
        pages: data.pages.map((page: any) => ({
            ...page,
            data: Array.isArray(page.data)
                ? page.data.map((post: any) => (post.id === postId ? updater(post) : post))
                : page.data,
        })),
    };
}

const updateOptimisticPost = (queryClient: ReturnType<typeof useQueryClient>, postId: string, updater: (post: any) => any) => {
    listQueryKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (old: any) => patchPostInInfiniteData(old, postId, updater));
    });

    queryClient.setQueryData(["post", postId], (old: any) => (old ? updater(old) : old));
}

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

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) =>
            postServices.likePost({ postId }),
        onMutate: async (postId) => {
            await Promise.all([
                ...listQueryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
                queryClient.cancelQueries({ queryKey: ["post", postId] }),
            ]);

            const previousStates = listQueryKeys.map((queryKey) => [queryKey, queryClient.getQueriesData({ queryKey })] as const);
            const previousPost = queryClient.getQueryData(["post", postId]);

            updateOptimisticPost(queryClient, postId, (old: any) => ({
                ...old,
                isLiked: true,
                likeCount: old.likeCount + 1,
            }));

            return { previousStates, previousPost };
        },
        onError: (_err, postId, context) => {
            context?.previousStates?.forEach(([, querySnapshots]) => {
                querySnapshots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            });

            queryClient.setQueryData(["post", postId], context?.previousPost);
        },
        onSettled: (_, _err, postId) => {
            listQueryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
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
            await Promise.all([
                ...listQueryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
                queryClient.cancelQueries({ queryKey: ["post", postId] }),
            ]);

            const previousStates = listQueryKeys.map((queryKey) => [queryKey, queryClient.getQueriesData({ queryKey })] as const);
            const previousPost = queryClient.getQueryData(["post", postId]);

            updateOptimisticPost(queryClient, postId, (old: any) => ({
                ...old,
                isLiked: false,
                likeCount: Math.max(0, old.likeCount - 1),
            }));

            return { previousStates, previousPost };
        },
        onError: (_err, postId, context) => {
            context?.previousStates?.forEach(([, querySnapshots]) => {
                querySnapshots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            });

            queryClient.setQueryData(["post", postId], context?.previousPost);
        },
        onSettled: (_, _err, postId) => {
            listQueryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });
}