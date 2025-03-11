
import { useEvents } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, ListChecks, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { events, deleteEvent } = useEvents();

  // Get upcoming events (sorted by start date)
  const upcomingEvents = [...events]
    .filter((event) => event.status !== "Completed" && event.status !== "Cancelled")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // Calculate stats
  const totalEvents = events.length;
  const completedEvents = events.filter((event) => event.status === "Completed").length;
  const inProgressEvents = events.filter((event) => event.status === "In Progress").length;
  const totalTasks = events.reduce((acc, event) => acc + event.tasks.length, 0);
  const completedTasks = events.reduce(
    (acc, event) => acc + event.tasks.filter((task) => task.completed).length,
    0
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to EventRafter. Manage your events and tasks efficiently.
          </p>
        </div>
        <Button asChild>
          <Link to="/events/new">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {completedEvents} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressEvents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((inProgressEvents / totalEvents) * 100) || 0}% of all events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((acc, event) => acc + event.attendees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      
      {upcomingEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} onDelete={deleteEvent} />
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <p className="mb-2 text-muted-foreground">No upcoming events</p>
              <Button asChild size="sm">
                <Link to="/events/new">
                  <Plus className="mr-2 h-4 w-4" /> Create Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link to="/events">View All Events</Link>
        </Button>
      </div>
    </div>
  );
}
