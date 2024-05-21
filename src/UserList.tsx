import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/user/userSlice";
import { RootState } from "./store/store";
import { stopPolling } from "./store/extraActions";

const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const activeUser = useSelector((state: RootState) => state.user);

  // When this component is unmounted, we need to stop polling
  useEffect(() => {
    return () => {
      dispatch(stopPolling());
    };
  }, [dispatch]);

  return (
    <>
      <ul>
        <span>Active User: {activeUser}</span>
        {Array.from({ length: 3 }).map((_, index) => {
          const user = index + 1;
          return (
            <li key={index}>
              <button onClick={() => dispatch(setUser(user))}>
                set user: {user}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Filters;
