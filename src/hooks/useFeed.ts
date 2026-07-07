import { useInfiniteQuery } from '@tanstack/react-query';
import { feedServices } from '@/services/feedServices';
import { useQuery } from '@tanstack/react-query';

export const useGetHomeFeed = () => {
    return useInfiniteQuery({
        queryKey: ["home-feed"],
        queryFn: ({ pageParam }) => feedServices.getHomeFeed({ limit: 10, cursor: pageParam }), // Fetch the first page of the home feed
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: 0,
        refetchOnMount: true,
        retry: false, // Don't retry on failure (e.g., if the user is not authenticated)
    });
}
export const useGetFollowingFeed = () => {
    return useInfiniteQuery({
        queryKey: ["following-feed"],
        queryFn: ({ pageParam }) => feedServices.getFollowingFeed({ limit: 10, cursor: pageParam }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: 0,
        refetchOnMount: true,
        retry: false,
    });
}
export const useGetTrendingFeed = () => {
    return useInfiniteQuery({
        queryKey: ["trending-feed"],
        queryFn: ({ pageParam }) => feedServices.getTrendingFeed({ limit: 10, cursor: pageParam }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: 0,
        refetchOnMount: true,
        retry: false,
    });
}   