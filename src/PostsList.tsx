import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, stopPolling } from "./store/posts/postsSlice";
import { RootState } from "./store/store";

const PostsList: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts({userId:1}));

    return () => {
      dispatch(stopPolling());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statePosts = useSelector((state: RootState) => state.posts.items);

  return (
    <ul>
      {statePosts.map((post) => (
        <li key={post.id}>
          <span>{post.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default PostsList;
