import React, { useState } from "react";
import UsersList from "./UserList";
import EventSubscriber from "./EventSubscriber";

const App: React.FC = () => {
  const [displayUsers, setDisplayUsers] = useState(true);
  return (
    <section>
      <ul>
        <li>
          When you click on a user we start a request for the post of that user,
          and register the polling mechanism.
        </li>
        <li>
          Every time you swap the user, we cancel the previous polling mechanism
          and start a new one, for the new user.
        </li>
        <li>When you toggle off the menu, we stop the polling mechanism.</li>
      </ul>
      <button onClick={() => setDisplayUsers(!displayUsers)}>
        Toggle Users
      </button>
      {displayUsers && <UsersList />}
      <EventSubscriber />
    </section>
  );
};

export default App;
