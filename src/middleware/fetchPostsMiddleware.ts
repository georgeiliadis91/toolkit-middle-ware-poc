import { Middleware } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import { RootState } from "../store/store";
import { UnknownAction } from "@reduxjs/toolkit";
import { setPosts } from "../store/posts/postsSlice";

const POLLING_INTERVAL = 1000;

let intervalId: number | null | undefined = null;

const fetchPostsMiddleware: Middleware =
  (store) => (next) => (action: UnknownAction) => {
    if (action.type === "posts/fetchPosts") {
      const state: RootState = store.getState();
      const shouldFetchPosts = state.posts.items.length === 0;

      if (shouldFetchPosts) {
        const { userId } = action.payload;
        store.dispatch(postsApi.endpoints.getPosts.initiate(userId));

        if (!intervalId) {
          intervalId = setInterval(() => {
            store.dispatch(
              postsApi.endpoints.getPosts.initiate(userId, {
                forceRefetch: true,
              })
            );
          }, POLLING_INTERVAL);
        }
      }
    }

    if (postsApi.endpoints.getPosts.matchFulfilled(action)) {
      store.dispatch(setPosts(action.payload));
    }

    if (action.type === "posts/stopPolling") {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    return next(action);
  };

export default fetchPostsMiddleware;
