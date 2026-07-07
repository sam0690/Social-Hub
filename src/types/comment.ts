export type Comment = {
    id: string,
    postId: string,
    authorId: string,
    parentCommentId: string | null,
    content: string,
    likeCount: number,
    replyCount: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    author: {
        id: string,
        username: string,
        displayName: string,
        avatarUrl: string | null,
        isVerified: boolean
    }
}