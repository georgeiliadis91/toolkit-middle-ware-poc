import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import postsSlice from "./posts/postsSlice";
import fetchPostsMiddleware from "../middleware/fetchPostsMiddleware";
import { useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({
  [postsApi.reducerPath]: postsApi.reducer,
  posts: postsSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(postsApi.middleware, fetchPostsMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type ExtraArg = undefined; // Update this if we even start passing extra args on the middleware

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export { store };
