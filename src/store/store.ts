import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import postsReducer from "./posts/postsSlice";
import fetchPostsMiddleware from "../middleware/fetchPostsMiddleware";

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, fetchPostsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
