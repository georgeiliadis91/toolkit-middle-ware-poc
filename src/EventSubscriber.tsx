import { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import { EVENTS } from "./utils/eventEmitter";
import { useAppSelector } from "./store/store";

const EventSubscriber: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const isLoading = useAppSelector((state) => state.loader);

  useEffect(() => {
    const token = PubSub.subscribe(EVENTS.DIFF, (_, data: string[]) => {
      setEvents(data);
    });

    // Cleanup subscription on component unmount
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  if (events.length === 0 && !isLoading) return <div>No events</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div>{JSON.stringify(events)}</div>;
};
export default EventSubscriber;
