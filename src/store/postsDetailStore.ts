import { create } from 'zustand';
import { fetchPostsDetailApi } from './../api/postApi';

interface Tag {
  tagId: number;
  tagName: string;
}

export interface PostDetail {
  id: number;
  memberId: number;
  memberName: string;
  drink: {
    id: number;
    placeName: string;
    name: string;
    drinkType: string;
    degree: number;
    sweetness: number;
    cost: number;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
  type: 'REVIEW' | 'ADVERTISEMENT';
  content: string;
  rating: number;
  tags: Tag[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  postsDetail: PostDetail[];
  setPostsDetail: (postsDetail: PostDetail[]) => void;
  fetchPostsDetail: () => Promise<void>;
}

export const usePostsDetailStore = create<PostsState>(set => ({
  postsDetail: [],
  setPostsDetail: postsDetail => set({ postsDetail }),
  fetchPostsDetail: async () => {
    try {
      const data = await fetchPostsDetailApi();
      set({ postsDetail: data });
      console.log('!!!!!!!!', data);
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ postsDetail: [] });
    }
  },
}));