
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/context/EventContext";
import EventForm from "@/components/EventForm";

export default function EventEdit() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, updateEvent } = useEvents();
  
  const event = getEvent(eventId || "");
  
  if (!event) {
    navigate("/events");
    return null;
  }
  
  const handleUpdateEvent = (eventData: any) => {
    updateEvent(event.id, eventData);
    navigate(`/events/${event.id}`);
  };
  
  return (
    <div className="container py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight mb-8 self-start">Edit Event</h1>
      <EventForm event={event} onSubmit={handleUpdateEvent} />
    </div>
  );
}
