import { isAnyOf, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import { UnknownAction } from "@reduxjs/toolkit";
import { setPosts } from "../store/posts/postsSlice";
import { ExtraArg } from "../store/store"; // Import the ExtraArg type from the appropriate package
import { fetchPosts, stopPolling } from "../store/posts/postsSlice";
import PubSub from "pubsub-js";
import { EVENTS } from "../utils/eventEmitter";

const POLLING_INTERVAL = 2_000;

let intervalId: number | null | undefined = null;


//@todo: figure out how to extract the state type
type ApiState = Record<
  typeof postsApi.reducerPath,
  ReturnType<typeof postsApi.reducer>
>;

const fetchPostsMiddleware: Middleware<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ApiState,
  ThunkDispatch<ApiState, ExtraArg, UnknownAction>
> = (store) => (next) => (action) => {

  // Check if the action is one of the actions we're interested in
  // to run on the middleware else ignore it
  const isIncludedInMiddleware = isAnyOf(
    fetchPosts,
    postsApi.endpoints.getPosts.matchFulfilled,
    stopPolling
  );

  if (!isIncludedInMiddleware(action)) {
    return next(action);
  }

  if (fetchPosts.match(action)) {
    // figure out hwo to fix the types here
    const state = store.getState();
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
    return next(action);
  }

  if (postsApi.endpoints.getPosts.matchFulfilled(action)) {
    store.dispatch(setPosts(action.payload));
    PubSub.publish(EVENTS.DIFF, action.payload);
    return next(action);
  }

  if (stopPolling.match(action)) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return next(action);
  }
};

export default fetchPostsMiddleware;
