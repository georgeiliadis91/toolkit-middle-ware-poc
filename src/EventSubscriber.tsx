import { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import { EVENTS } from "./utils/eventEmitter";

const EventSubscriber: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const token = PubSub.subscribe(EVENTS.DIFF, (_, data: string[]) => {
      console.log("new diff:", data);
      setEvents(data);
    });

    // Cleanup subscription on component unmount
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  return <div>{JSON.stringify(events)}</div>;
};
export default EventSubscriber;
