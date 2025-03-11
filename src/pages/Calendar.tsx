
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isEqual, isToday, isSameMonth, parseISO } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function Calendar() {
  const { events } = useEvents();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const selected = new Date(selectedDate);
        
        selected.setHours(0, 0, 0, 0);
        
        return (
          selected >= new Date(eventStartDate.setHours(0, 0, 0, 0)) &&
          selected <= new Date(eventEndDate.setHours(0, 0, 0, 0))
        );
      })
    : [];
    
  const statusColors = {
    "Not Started": "bg-gray-200",
    "In Progress": "bg-blue-200 text-blue-800",
    "Completed": "bg-green-200 text-green-800",
    "Cancelled": "bg-red-200 text-red-800",
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your events by date
          </p>
        </div>
        <Button asChild>
          <Link to="/events/new">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center pb-3">
            <CardTitle className="flex-1">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{format(date, 'MMMM yyyy')}</span>
              </div>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setDate(newDate);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={() => {
                  setDate(new Date());
                  setSelectedDate(new Date());
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setDate(newDate);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={date}
              onMonthChange={setDate}
              className="p-0"
              components={{
                DayContent: (props) => {
                  const eventsOnDay = events.filter((event) => {
                    const eventStartDate = new Date(event.startDate);
                    const eventEndDate = new Date(event.endDate);
                    const day = props.date;
                    
                    day.setHours(0, 0, 0, 0);
                    
                    return (
                      day >= new Date(eventStartDate.setHours(0, 0, 0, 0)) &&
                      day <= new Date(eventEndDate.setHours(0, 0, 0, 0))
                    );
                  });
                  
                  return (
                    <div className="flex flex-col items-center">
                      <div 
                        className={`
                          w-full text-center 
                          ${isEqual(props.date, selectedDate || new Date()) ? 'font-bold' : ''}
                          ${!isSameMonth(props.date, date) ? 'text-muted-foreground' : ''}
                          ${isToday(props.date) ? 'text-primary font-bold' : ''}
                        `}
                      >
                        {props.date.getDate()}
                      </div>
                      {eventsOnDay.length > 0 && (
                        <div className="w-5 h-1 rounded-full bg-primary mt-1"></div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                isToday(selectedDate) ? (
                  "Today's Events"
                ) : (
                  `Events for ${format(selectedDate, 'MMM d, yyyy')}`
                )
              ) : (
                "No date selected"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/events/${event.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {event.title}
                      </Link>
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[event.status as keyof typeof statusColors]}`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.location && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No events for this date</p>
                <Button asChild size="sm">
                  <Link to="/events/new">
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
