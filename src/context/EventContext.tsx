
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Event, EventContextType, Task } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

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
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  useEffect(() => {
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

  const addEvent = (event: Omit<Event, "id" | "progress" | "tasks">) => {
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
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, ...updatedData } : event
      )
    );
    toast.success("Event updated successfully");
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    toast.success("Event deleted successfully");
  };

  const getEvent = (id: string) => {
    // Get the most up-to-date events directly from localStorage
    const savedEvents = localStorage.getItem("events");
    const eventsData = savedEvents ? JSON.parse(savedEvents) : events;
    
    return eventsData.find((event: Event) => event.id === id);
  };

  const calculateProgress = (eventId: string) => {
    const event = getEvent(eventId);
    if (!event || event.tasks.length === 0) return 0;

    const completedTasks = event.tasks.filter((task) => task.completed).length;
    const progress = Math.round((completedTasks / event.tasks.length) * 100);

    updateEvent(eventId, { progress });
    return progress;
  };

  const addTask = (eventId: string, task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      completed: false,
    };

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedTasks = [...event.tasks, newTask];
          return {
            ...event,
            tasks: updatedTasks,
          };
        }
        return event;
      })
    );

    calculateProgress(eventId);
    toast.success("Task added successfully");
  };

  const updateTask = (eventId: string, taskId: string, updatedData: Partial<Task>) => {
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

    calculateProgress(eventId);
    toast.success("Task updated successfully");
  };

  const deleteTask = (eventId: string, taskId: string) => {
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

    calculateProgress(eventId);
    toast.success("Task deleted successfully");
  };

  const toggleTaskComplete = (eventId: string, taskId: string, completed: boolean) => {
    updateTask(eventId, taskId, { completed });
    
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
