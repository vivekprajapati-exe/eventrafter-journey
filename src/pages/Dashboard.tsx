import { useEvents } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, ListChecks, Plus, Users, Zap, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

export default function Dashboard() {
  const {
    events,
    deleteEvent
  } = useEvents();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [fadeIn, setFadeIn] = useState(false);

  const upcomingEvents = [...events].filter(event => event.status !== "Completed" && event.status !== "Cancelled").sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 3);
  const completedEvents = [...events].filter(event => event.status === "Completed").sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()).slice(0, 3);
  const highPriorityEvents = [...events].filter(event => event.tasks.some(task => task.priority === "High" && !task.completed)).slice(0, 3);

  const totalEvents = events.length;
  const completedEventsCount = events.filter(event => event.status === "Completed").length;
  const inProgressEvents = events.filter(event => event.status === "In Progress").length;
  const totalTasks = events.reduce((acc, event) => acc + event.tasks.length, 0);
  const completedTasks = events.reduce((acc, event) => acc + event.tasks.filter(task => task.completed).length, 0);
  const completionRate = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(completionRate);
    }, 500);
    return () => clearTimeout(timer);
  }, [completionRate]);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return <div className={`container py-8 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Event Manager. Manage your events and tasks efficiently.</p>
        </div>
        <Button asChild>
          <Link to="/events/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {completedEventsCount} completed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressEvents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(inProgressEvents / totalEvents * 100) || 0}% of all events
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-primary" />
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

      <Card className="mb-8 bg-background/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#c1121f]" />
            Overall Progress
          </CardTitle>
          <CardDescription>Task completion across all events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{completedTasks} of {totalTasks} tasks completed</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={animatedProgress} className="h-2 bg-[#003049]/20" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center p-4 bg-[#003049]/10 rounded-lg">
                <div className="text-3xl font-bold text-[#c1121f]">{completedEventsCount}</div>
                <div className="text-sm text-muted-foreground">Completed Events</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-[#003049]/10 rounded-lg">
                <div className="text-3xl font-bold text-[#669bbc]">{inProgressEvents}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-[#003049]/10 rounded-lg">
                <div className="text-3xl font-bold text-[#780000]">
                  {events.filter(event => event.tasks.some(task => task.priority === "High")).length}
                </div>
                <div className="text-sm text-muted-foreground">With High Priority Tasks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">Event Overview</h2>
          <TabsList className="bg-background/60">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#c1121f] data-[state=active]:text-white">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="text-green-500 font-medium">Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-[#669bbc] data-[state=active]:text-white">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-[#780000] data-[state=active]:text-white">
              <Zap className="mr-2 h-4 w-4" />
              High Priority
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="upcoming" className="mt-0 space-y-4">
          {upcomingEvents.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map(event => <EventCard key={event.id} event={event} onDelete={deleteEvent} />)}
            </div> : <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-2 text-muted-foreground">No upcoming events</p>
                  <Button asChild size="sm" className="bg-[#c1121f] hover:bg-[#780000]">
                    <Link to="/events/new">
                      <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0 space-y-4">
          {completedEvents.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedEvents.map(event => <EventCard key={event.id} event={event} onDelete={deleteEvent} />)}
            </div> : <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-2 text-muted-foreground">No completed events yet</p>
                </div>
              </CardContent>
            </Card>}
        </TabsContent>
        
        <TabsContent value="priority" className="mt-0 space-y-4">
          {highPriorityEvents.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highPriorityEvents.map(event => <EventCard key={event.id} event={event} onDelete={deleteEvent} />)}
            </div> : <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-2 text-muted-foreground">No high priority events</p>
                </div>
              </CardContent>
            </Card>}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/10 transform transition-transform hover:scale-105">
          <Link to="/events">View All Events</Link>
        </Button>
      </div>
    </div>;
}
