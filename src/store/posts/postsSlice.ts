import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../api/postsApi";

interface PostsState {
  items: Post[];
}

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPosts: (state, action: PayloadAction<{ userId: number }>) =>
      state,
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload;
    },
    stopPolling: (state) => state,
  },
});

export const { fetchPosts, setPosts, stopPolling } = postsSlice.actions;
export default postsSlice.reducer;
