import { apiClient } from "@/lib/apiClient"
import { endpoints } from "@/api/endpoints"

export const postServices = {
    async createPost(payload: { content: string; visibility: string }) {
        const { data } = await apiClient.post(endpoints.posts.createPost, payload);
        return data;
    },

    async getPostById(payload: { postId: string }) {
        const { data } = await apiClient.get(endpoints.posts.getPostById, { params: payload });
        return data;
    },

    async updatePost(payload: { postId: string; content: string; visibility: string }) {
        const { data } = await apiClient.patch(endpoints.posts.updatePost, { params: payload });
        return data;
    },

    async deletePost(payload: { postId: string }) {
        const { data } = await apiClient.delete(endpoints.posts.deletePost, { params: payload });
        return data;
    },

    async getUsersWhoLikedPost(payload: { postId: string; limit?: number; cursor?: string }) {
        const { data } = await apiClient.get(endpoints.posts.getUsersWhoLikedPost, { params: payload });
        return data;
    },

    async likePost({ postId }: { postId: string; }) {
        const { data } = await apiClient.post(endpoints.posts.likePost.replace("{postId}", postId));
        return data;
    },

    async unlikePost({ postId }: { postId: string; }) {
        const { data } = await apiClient.delete(endpoints.posts.likePost.replace("{postId}", postId));
        return data;
    },

    // query & path parameter example
    async getPostByUsername(payload: { username: string; limit?: number; cursor?: string }) {
        const { username, limit, cursor } = payload;
        const { data } = await apiClient.get(endpoints.posts.getPostByUsername.replace("{username}", username), { params: { limit, ...(cursor && { cursor }) } });
        return data;
    },

    async createComment({postId, content, parentCommentId}: { postId: string, content: string, parentCommentId?: string }) {
        const { data } = await apiClient.post(endpoints.posts.createComment.replace("{postId}", postId), { content, parentCommentId });
        return data;
    },
    async getComments({ postId, limit, cursor }: { postId: string; limit?: number; cursor?: string }) {
        const { data } = await apiClient.get(endpoints.posts.getComments.replace("{postId}", postId), {params: {limit, ...(cursor && {cursor})}});
        return data;
    },
    async likeComment({ commentId}: { commentId: string}) {
        const { data } = await apiClient.post(endpoints.posts.likeComment.replace("{commentId}",commentId));
        return data;
    },

    async unlikeComment({ commentId}: { commentId: string}) {
        const { data } = await apiClient.delete(endpoints.posts.likeComment.replace("{commentId}",commentId));
        return data;
    },

    async deleteComment({commentId}: { commentId: string }) {
        const { data } = await apiClient.delete(endpoints.posts.deleteComment.replace("{commentId}", commentId));
        return data;
    },
    async getReplyComments({ commentId, limit, cursor }: { commentId: string; limit?: number; cursor?: string }) {
        const { data } = await apiClient.get(endpoints.posts.getReplyComments.replace("{commentId}", commentId), { params: { limit, ...(cursor && { cursor }) } });
        return data;
    },
    async bookmarkPost({postId}: { postId: string }) {
        const { data } = await apiClient.post(endpoints.posts.bookmarkPost.replace("{postId}", postId));
        return data;
    },
    async removeBookmark({ postId }: { postId: string }) {
        const { data } = await apiClient.delete(endpoints.posts.bookmarkPost.replace("{postId}", postId));
        return data;
    },

    async getMyBookmarks({ limit, cursor }: { limit?: number; cursor?: string }) {
        const { data } = await apiClient.get(endpoints.posts.getMyBookmarks, { params: { limit, ...(cursor &&{cursor}) } });
        return data;
    },

    async getPostByHashtag({ hashtag, limit, cursor }: { hashtag: string; limit?: number; cursor?: string }) {
        const { data } = await apiClient.get(endpoints.posts.getPostByHashtag, { params: { hashtag, limit, cursor } });
        return data;
    },
}