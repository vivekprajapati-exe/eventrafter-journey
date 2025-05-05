
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Event } from "@/types";
import { format } from "date-fns";

interface GoogleCalendarButtonProps {
  event: Event;
}

export default function GoogleCalendarButton({ event }: GoogleCalendarButtonProps) {
  const createGoogleCalendarUrl = () => {
    // Format dates for Google Calendar
    const startDate = new Date(event.startDate);
    startDate.setHours(
      parseInt(event.startTime.split(':')[0]),
      parseInt(event.startTime.split(':')[1])
    );
    
    const endDate = new Date(event.endDate);
    endDate.setHours(
      parseInt(event.endTime.split(':')[0]),
      parseInt(event.endTime.split(':')[1])
    );
    
    const startDateString = format(startDate, "yyyyMMdd'T'HHmmss");
    const endDateString = format(endDate, "yyyyMMdd'T'HHmmss");
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDateString}/${endDateString}`,
      details: event.description || '',
      location: event.location || '',
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex gap-2 group hover:border-blue/50 hover:shadow-md hover:shadow-blue/20 transition-all duration-300"
      onClick={(e) => {
        e.preventDefault();
        window.open(createGoogleCalendarUrl(), '_blank');
      }}
    >
      <CalendarDays className="h-4 w-4 group-hover:text-blue group-hover:animate-pulse transition-all" />
      <span className="hidden sm:inline">Add to Google Calendar</span>
      <span className="sm:hidden">Calendar</span>
    </Button>
  );
}
