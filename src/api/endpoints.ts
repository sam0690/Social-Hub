export const endpoints = {
    auth: {
        register: `/api/v1/auth/register`,
        login: `/api/v1/auth/login`,
        refresh: `/api/v1/auth/refresh`,
        logout: `/api/v1/auth/logout`,
        forgotPassword: `/api/v1/auth/forgot-password`,
        resetPassword: `/api/v1/auth/reset-password`,
        authenticateUser: `/api/v1/auth/me`,
    },

    users: {
        activeStatus: 'api/v1/users/{id}/presence',
        getMyProfile: 'api/v1/users/me',
        updateMyProfile: 'api/v1/users/me',
        deleteMyProfile: 'api/v1/users/me',
        searchUsers: 'api/v1/users/search',
        getBlockedUsers: 'api/v1/users/me/blocked',
        getMutedUsers: 'api/v1/users/me/muted',
        getUserProfile: 'api/v1/users/{username}',
        followUser: 'api/v1/users/{username}/follow',
        unfollowUser: 'api/v1/users/{username}/follow',
        getFollowers: 'api/v1/users/{username}/followers',
        getFollowing: 'api/v1/users/{username}/following',
        blockUser: 'api/v1/users/{username}/block',
        unblockUser: 'api/v1/users/{username}/block',
        muteUser: 'api/v1/users/{username}/mute',
        unmuteUser: 'api/v1/users/{username}/mute',
    },

    feed: {
        getHomeFeed: 'api/v1/feed',
        getFollowingFeed: 'api/v1/feed/following',
        getTrendingFeed: 'api/v1/feed/trending',
    },

    notifications: {
        getMyNotifications: 'api/v1/notifications',
        getUnreadNotifications: 'api/v1/notifications/unread-count',
        markAsRead: 'api/v1/notifications/{id}/read', 
        markAllAsRead: 'api/v1/notifications/read-all', 
    },

    posts: {
        //18
        createPost: 'api/v1/posts',
        getPostById: 'api/v1/posts/{postId}',
        updatePost: 'api/v1/posts/{postId}',
        deletePost: 'api/v1/posts/{postId}',
        getUsersWhoLikedPost: 'api/v1/posts/{postId}/likes',
        getPostByUsername: 'api/v1/users/{username}/posts',
        likePost: 'api/v1/posts/{postId}/like',
        unlikePost: 'api/v1/posts/{postId}/like',
        createComment: 'api/v1/posts/{postId}/comments',
        getComments: 'api/v1/posts/{postId}/comments',
        likeComment: 'api/v1/comments/{commentId}/like',
        unlikeComment: 'api/v1/comments/{commentId}/like',
        deleteComment: 'api/v1/comments/{commentId}',
        getReplyComments: 'api/v1/comments/{commentId}/replies',
        // createReplyComment: 'api/v1/comments/{commentId}/replies',
        bookmarkPost: 'api/v1/posts/{postId}/bookmark',
        removeBookmark: 'api/v1/posts/{postId}/bookmark',
        getMyBookmarks: 'api/v1/me/bookmarks',
        getPostByHashtag: 'api/v1/hashtags/{hashtag}/posts',
    },

    conversations: {
        createConversation: 'api/v1/conversations',
        getMyConversations: 'api/v1/conversations',
    },


}