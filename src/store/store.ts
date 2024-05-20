import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import postsReducer from "./posts/postsSlice";
import fetchPostsMiddleware from "../middleware/fetchPostsMiddleware";
import {
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
  useStore,
} from "react-redux";

const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(fetchPostsMiddleware)
      .concat(postsApi.middleware),
});

export type RootStore = ReturnType<typeof store.getState>;
export type ExtraArg = { postsApi: typeof postsApi };

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export { store };
