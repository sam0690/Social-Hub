import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userServices } from '@/services/userServices';

export const useGetMyProfile = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: userServices.getMyProfile,
        retry: false, // Don't retry on failure (e.g., if the user is not authenticated)
    });
}
export const useGetUserProfile = (username: string) => {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: () => userServices.getUserProfile({ username }),
        retry: false,
    });
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (username: string) =>
            userServices.followUser({ username }),

        onMutate: async (username) => {
            await queryClient.cancelQueries({ queryKey: ["profile", username] });

            const previousProfile = queryClient.getQueryData(["profile", username]);

            queryClient.setQueryData(["profile", username], (old: any) => ({
                ...old,
                isFollowing: true,
                followerCount: old.followerCount + 1,
            }));

            return { previousProfile };
        },
        onError: (_err, username, context) => {
            queryClient.setQueryData(["profile", username], context?.previousProfile);
        },
        onSettled: (_, _err, username) => {
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
        },
    });
};

export const useUnfollowUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (username: string) =>
            userServices.unfollowUser({ username }),

        onMutate: async (username) => {
            await queryClient.cancelQueries({ queryKey: ["profile", username] });

            const previousProfile = queryClient.getQueryData(["profile", username]);

            queryClient.setQueryData(["profile", username], (old: any) => ({
                ...old,
                isFollowing: false,
                followerCount: old.followerCount - 1,
            }));

            return { previousProfile };
        },
        onError: (_err, username, context) => {
            queryClient.setQueryData(["profile", username], context?.previousProfile);
        },
        onSettled: (_, _err, username) => {
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
        },
    });
};

export const useGetFollowers = (username: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["followers", username],
        queryFn: () => userServices.getFollowers({ username }),
        retry: false,
        enabled: options?.enabled ?? true,
    });
}

export const useGetFollowing = (username: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["following", username],
        queryFn: () => userServices.getFollowing({ username }),
        retry: false,
        enabled: options?.enabled ?? true,
    });
}

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { displayName: string; bio: string; isPrivate: boolean }) => userServices.updateMyProfile(data),
        
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["auth"] });
            const previousProfile = queryClient.getQueryData(["auth"]);

            queryClient.setQueryData(["auth"], (old: any) => ({
                ...old,
                displayName: data.displayName,
                bio: data.bio,
                isPrivate: data.isPrivate,
            }));
            return { previousProfile };
        },
        onError: (_err, _data, context) => {
            queryClient.setQueryData(["auth"], context?.previousProfile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth","profile",] });
        },
    });
}