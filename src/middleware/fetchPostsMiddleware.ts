import { isAnyOf, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import { postsApi } from "../api/postsApi";
import { UnknownAction } from "@reduxjs/toolkit";
import { ExtraArg, RootState } from "../store/store"; // Import the ExtraArg type from the appropriate package
import { stopPolling } from "../store/extraActions";
import { setUser } from "../store/user/userSlice";
import PubSub from "pubsub-js";
import { EVENTS } from "../utils/eventEmitter";
import loaderSlice, {
  setIsLoading,
  setIsNotLoading,
} from "../store/loader/loaderSlice";

const POLLING_INTERVAL = 2_000;
let intervalId: number | null | undefined = null;

const initiatePolling = (
  dispatch: ThunkDispatch<RootState, ExtraArg, UnknownAction>,
  userId: number
) => {
  dispatch(postsApi.endpoints.getPosts.initiate(userId));
  if (!intervalId) {
    intervalId = setInterval(() => {
      dispatch(
        postsApi.endpoints.getPosts.initiate(userId, {
          forceRefetch: true,
        })
      );
    }, POLLING_INTERVAL);
  }
};

const clearPolling = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// We need to define a type guard to check if the action is registered
const isRegisteredAction = isAnyOf(
  postsApi.endpoints.getPosts.matchFulfilled,
  postsApi.endpoints.getPosts.matchRejected,
  postsApi.endpoints.getPosts.matchPending,
  stopPolling,
  setUser
);

const fetchPostsMiddleware: Middleware<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  RootState,
  ThunkDispatch<RootState, ExtraArg, UnknownAction>
> = (store) => (next) => (action) => {
  // if the action is not one that we want to act on this middleware
  // let it pass through
  if (!isRegisteredAction(action)) {
    return next(action);
  }

  const state = store.getState();

  switch (true) {
    case stopPolling.match(action): {
      clearPolling();
      break;
    }
    case setUser.match(action): {
      // When the user changes, we should do in order:
      // 1- We first need to cancel any previous polling mechanism
      // 2- Then we need to make a new request for our data
      // 3- Register and start polling
      clearPolling();
      const userId = action.payload;
      store.dispatch(postsApi.endpoints.getPosts.initiate(userId));
      initiatePolling(store.dispatch, userId);
      // Allow the action to pass through and update the state on the userSlice
      break;
    }
    case postsApi.endpoints.getPosts.matchPending(action): {
      // Check if we already have data in the postsApi store to display a loader if empty

      // @todo: find if there is a better way to do this, i do not like
      // accessing the store by a string of the cached function call
      if (state.postsApi.queries[`getPosts(${state.user})`]?.data) {
        store.dispatch(setIsNotLoading());
      } else {
        // check if the loader is already set to false to avoid
        // dispatching the action multiple times
        if (state.loader === false) {
          store.dispatch(setIsLoading());
        }
      }
      break;
    }
    case postsApi.endpoints.getPosts.matchFulfilled(action): {
      // Use the pub-sub event emitter to notify the subscribed components
      // on the new data
      PubSub.publish(EVENTS.DIFF, action.payload);
      break;
    }
    case postsApi.endpoints.getPosts.matchRejected(action): {
      console.error(action.error);
      break;
    }
    default:
      break;
  }
  return next(action);
};

export default fetchPostsMiddleware;
