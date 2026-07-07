import React from 'react'
import { useFollowUser, useUnfollowUser } from "@/components/profile/hooks/useProfile";

type FollowButtonProps = {
    username: string;
    isFollowing: boolean
};

export function FollowButton({ username, isFollowing }: FollowButtonProps) {
    const { isPending: isFollowPending, mutate: followUser } = useFollowUser();
    const { isPending: isUnfollowPending, mutate: unfollowUser } = useUnfollowUser();

    if (isFollowing) {
        return (
            <button
                disabled={isUnfollowPending}
                className="ml-2 rounded-md px-5 md:px-16 py-2 border border-black/10 dark:border-white/10 bg-black/4 dark:bg-white/4 text-sm font-medium disabled:opacity-50"
                onClick={() => unfollowUser(username)}
            >
                {isUnfollowPending ? "Loading..." : "Unfollow"}
            </button>
        );
    }

    return (
        <button
            disabled={isFollowPending}
            className="rounded-md px-5 md:px-16 py-2 border border-black/10 dark:border-white/10 bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
            onClick={() => followUser(username)}
        >
            {isFollowPending ? "Loading..." : "Follow"}
        </button>
    );
}

