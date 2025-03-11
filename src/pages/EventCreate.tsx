
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/context/EventContext";
import EventForm from "@/components/EventForm";

export default function EventCreate() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  
  const handleCreateEvent = (eventData: any) => {
    const newEventId = addEvent(eventData);
    navigate(`/events/${newEventId}`);
  };
  
  return (
    <div className="container py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight mb-8 self-start">Create New Event</h1>
      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
}
