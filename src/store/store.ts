import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import postsSlice from "./posts/postsSlice";
import fetchPostsMiddleware from "../middleware/fetchPostsMiddleware";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    posts: postsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(postsApi.middleware, fetchPostsMiddleware),
});

export type ExtraArg = { postsApi: typeof postsApi };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export { store };
