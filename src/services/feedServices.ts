import {apiClient} from '@/lib/apiClient'
import {endpoints} from '@/api/endpoints'

export const feedServices = {
    async getHomeFeed({ limit, cursor }: { limit?: number; cursor?: string }) {
        const params: any = { limit };
        if (cursor) {
            params.cursor = cursor;
        }
        const response = await apiClient.get(endpoints.feed.getHomeFeed, {params})
        return response.data
    },
    async getFollowingFeed({ limit, cursor }: { limit?: number; cursor?: string }) {
        const params: any = { limit };
        if (cursor) {
            params.cursor = cursor;
        }
        const response = await apiClient.get(endpoints.feed.getFollowingFeed, {params})
        return response.data
    },
    async getTrendingFeed({ limit, cursor }: { limit?: number; cursor?: string }) {
        const params: any = { limit };
        if (cursor) {
            params.cursor = cursor;
        }
        const response = await apiClient.get(endpoints.feed.getTrendingFeed, {params})
        return response.data
    },
}