
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/context/EventContext";
import EventForm from "@/components/EventForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EventCreate() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const { user } = useAuth();
  
  const handleCreateEvent = (eventData: any) => {
    console.log("Creating event with data:", eventData);
    
    // Attempt to create the event without role check
    const newEventId = addEvent(eventData);
    
    if (newEventId) {
      toast.success("Event created successfully!");
      navigate(`/events/${newEventId}`);
    } else {
      toast.error("Failed to create event. Please try again.");
    }
  };
  
  return (
    <div className="container py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight mb-8 self-start">Create New Event</h1>
      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
}
