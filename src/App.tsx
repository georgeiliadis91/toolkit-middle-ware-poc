import React, { useState } from "react";
import UsersList from "./UserList";
import EventSubscriber from "./EventSubscriber";

const App: React.FC = () => {
  const [displayUsers, setDisplayUsers] = useState(true);
  return (
    <div>
      <h1>Posts</h1>
      <button onClick={() => setDisplayUsers(!displayUsers)}>
        Toggle Users
      </button>
      {displayUsers && <UsersList />}
      <EventSubscriber />
    </div>
  );
};

export default App;
