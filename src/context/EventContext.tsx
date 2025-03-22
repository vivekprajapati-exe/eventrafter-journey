
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Event, EventContextType, Task, UserRole } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Company Annual Conference",
    description: "Annual company-wide conference with keynote speakers and workshops",
    location: "Grand Hotel Convention Center",
    startDate: "2023-12-10",
    endDate: "2023-12-12",
    startTime: "09:00",
    endTime: "18:00",
    status: "In Progress",
    attendees: 250,
    progress: 65,
    tasks: [
      {
        id: "t1",
        title: "Book venue",
        description: "Secure the convention center",
        completed: true,
        priority: "High",
      },
      {
        id: "t2",
        title: "Send invitations",
        description: "Email all department heads",
        completed: true,
        priority: "High",
      },
      {
        id: "t3",
        title: "Arrange catering",
        description: "Order lunch and refreshments",
        completed: false,
        priority: "Medium",
      },
    ],
  },
  {
    id: "2",
    title: "Product Launch",
    description: "Launch event for our new software product",
    location: "Tech Hub",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    startTime: "14:00",
    endTime: "20:00",
    status: "Not Started",
    attendees: 100,
    progress: 30,
    tasks: [
      {
        id: "t4",
        title: "Prepare demo",
        description: "Create product demonstration",
        completed: true,
        priority: "High",
      },
      {
        id: "t5",
        title: "Media invitations",
        description: "Invite press and industry analysts",
        completed: false,
        priority: "Medium",
      },
    ],
  },
  {
    id: "3",
    title: "Team Building Retreat",
    description: "Outdoor team building activities and workshops",
    location: "Mountain View Resort",
    startDate: "2023-09-15",
    endDate: "2023-09-17",
    startTime: "08:00",
    endTime: "22:00",
    status: "Completed",
    attendees: 50,
    progress: 100,
    tasks: [
      {
        id: "t6",
        title: "Book accommodations",
        description: "Reserve rooms for all team members",
        completed: true,
        priority: "High",
      },
      {
        id: "t7",
        title: "Plan activities",
        description: "Schedule team building exercises",
        completed: true,
        priority: "Medium",
      },
      {
        id: "t8",
        title: "Organize transportation",
        description: "Arrange buses for the team",
        completed: true,
        priority: "Medium",
      },
    ],
  },
];

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const { user, hasPermission } = useAuth();
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  useEffect(() => {
    // This is a temporary solution using localStorage
    // In a real-world app, we would use Supabase to store events
    localStorage.setItem("events", JSON.stringify(events));
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "events" && e.newValue) {
        setEvents(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [events]);

  // Only allow certain actions if user has appropriate permissions
  const checkPermission = (action: string, requiredRole: UserRole = 'organizer'): boolean => {
    if (!hasPermission(requiredRole)) {
      toast.error(`You do not have permission to ${action}`);
      return false;
    }
    return true;
  };

  const addEvent = (event: Omit<Event, "id" | "progress" | "tasks">) => {
    if (!checkPermission('create events')) return "";
    
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      progress: 0,
      tasks: [],
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    toast.success("Event created successfully");
    return newEvent.id;
  };

  const updateEvent = (id: string, updatedData: Partial<Event>) => {
    if (!checkPermission('update events')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, ...updatedData } : event
      )
    );
    toast.success("Event updated successfully");
  };

  const deleteEvent = (id: string) => {
    if (!checkPermission('delete events', 'admin')) return;
    
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    toast.success("Event deleted successfully");
  };

  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const calculateProgress = (eventId: string) => {
    const event = getEvent(eventId);
    if (!event) return 0;
    if (event.tasks.length === 0) return 0;

    const completedTasks = event.tasks.filter((task) => task.completed).length;
    const progress = Math.round((completedTasks / event.tasks.length) * 100);

    // Update the event with the new progress
    setEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === eventId ? { ...e, progress } : e
      )
    );

    return progress;
  };

  const addTask = (eventId: string, task: Omit<Task, "id" | "completed">) => {
    if (!checkPermission('add tasks')) return;
    
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      completed: false,
    };

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedTasks = [...event.tasks, newTask];
          const updatedEvent = {
            ...event,
            tasks: updatedTasks,
          };
          return updatedEvent;
        }
        return event;
      })
    );

    // Calculate progress after state update
    setTimeout(() => calculateProgress(eventId), 0);
    toast.success("Task added successfully");
  };

  const updateTask = (eventId: string, taskId: string, updatedData: Partial<Task>) => {
    if (!checkPermission('update tasks')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedTasks = event.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedData } : task
          );
          return {
            ...event,
            tasks: updatedTasks,
          };
        }
        return event;
      })
    );

    // Calculate progress after state update
    setTimeout(() => calculateProgress(eventId), 0);
    toast.success("Task updated successfully");
  };

  const deleteTask = (eventId: string, taskId: string) => {
    if (!checkPermission('delete tasks')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedTasks = event.tasks.filter((task) => task.id !== taskId);
          return {
            ...event,
            tasks: updatedTasks,
          };
        }
        return event;
      })
    );

    // Calculate progress after state update
    setTimeout(() => calculateProgress(eventId), 0);
    toast.success("Task deleted successfully");
  };

  const toggleTaskComplete = (eventId: string, taskId: string, completed: boolean) => {
    if (!checkPermission('complete tasks')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedTasks = event.tasks.map((task) =>
            task.id === taskId ? { ...task, completed } : task
          );
          
          const completedTasksCount = updatedTasks.filter(t => t.completed).length;
          const totalTasks = updatedTasks.length;
          const progress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
          
          return {
            ...event,
            tasks: updatedTasks,
            progress
          };
        }
        return event;
      })
    );
    
    if (completed) {
      toast.success("Task marked as complete");
    } else {
      toast.info("Task marked as incomplete");
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
