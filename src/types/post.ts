export type Post = {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
  };
  authorId: string;
  visibility: string;
  postType: string;
  content: string;
  img?: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  updatedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
};