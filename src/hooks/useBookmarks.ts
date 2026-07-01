import { postServices } from "../services/postServices";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const removePostFromBookmarksData = (data: any, postId: string) => {
    if (!data?.pages) return data;

    return {
        ...data,
        pages: data.pages.map((page: any) => ({
            ...page,
            data: Array.isArray(page.data)
                ? page.data.filter((post: any) => post.id !== postId)
                : page.data,
        })),
    };
}

const updatePostAcrossCaches = (queryClient: ReturnType<typeof useQueryClient>, postId: string, updater: (post: any) => any) => {
    listQueryKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (old: any) => patchPostInInfiniteData(old, postId, updater));
    });

    queryClient.setQueryData(["post", postId], (old: any) => (old ? updater(old) : old));
}

export const useBookmarkPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => postServices.bookmarkPost({ postId }),

        onMutate: async (postId) => {
            await Promise.all([
                ...listQueryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
                queryClient.cancelQueries({ queryKey: ["post", postId] }),
            ]);

            const previousStates = listQueryKeys.map((queryKey) => [queryKey, queryClient.getQueriesData({ queryKey })] as const);
            const previousPost = queryClient.getQueryData(["post", postId]);

            updatePostAcrossCaches(queryClient, postId, (old: any) => ({
                ...old,
                isBookmarked: true,
            }));

            return { previousStates, previousPost };
        },

        onError: (_err, _postId, context) => {
            context?.previousStates?.forEach(([, querySnapshots]) => {
                querySnapshots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            });

            queryClient.setQueryData(["post", _postId], context?.previousPost);
        },

        onSettled: () => {
            listQueryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
        }
    });
}

export const useUnbookmarkPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => postServices.removeBookmark({ postId }),

        onMutate: async (postId) => {
            await Promise.all([
                ...listQueryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
                queryClient.cancelQueries({ queryKey: ["post", postId] }),
            ]);

            const previousStates = listQueryKeys.map((queryKey) => [queryKey, queryClient.getQueriesData({ queryKey })] as const);
            const previousPost = queryClient.getQueryData(["post", postId]);

            listQueryKeys.forEach((queryKey) => {
                queryClient.setQueriesData({ queryKey }, (old: any) => {
                    if (queryKey[0] === "bookmarks") {
                        return removePostFromBookmarksData(old, postId);
                    }

                    return patchPostInInfiniteData(old, postId, (post: any) => ({
                        ...post,
                        isBookmarked: false,
                    }));
                });
            });

            queryClient.setQueryData(["post", postId], (old: any) => (old ? { ...old, isBookmarked: false } : old));

            return { previousStates, previousPost };
        },

        onError: (_err, _postId, context) => {
            context?.previousStates?.forEach(([, querySnapshots]) => {
                querySnapshots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            });

            queryClient.setQueryData(["post", _postId], context?.previousPost);
        },
        onSettled: () => {
            listQueryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
        },
    });
}

export const useGetMyBookmarks = () => {
  return useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: ({ pageParam }) =>
      postServices.getMyBookmarks({
        cursor: pageParam,
        limit: 10,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        data: page.data.map((post: any) => ({
          ...post,
          isBookmarked: true,
          isLiked: post.isLiked ?? false,
        })),
      })),
    }),
    staleTime: 0,
    refetchOnMount: true,
    enabled: true,
    retry: false,
  });
};