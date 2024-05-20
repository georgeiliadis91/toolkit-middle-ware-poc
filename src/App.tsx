import React from "react";
import PostsList from "./PostsList";
import EventSubscriber from "./EventSubscriber";

const App: React.FC = () => {
  return (
    <div>
      <h1>Posts</h1>
      <PostsList />
      <EventSubscriber />
    </div>
  );
};

export default App;
