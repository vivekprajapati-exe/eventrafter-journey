
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Event, EventContextType, Task, UserRole, BudgetItem } from "@/types";
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
    budget: {
      totalEstimated: 15000,
      totalActual: 12500,
      items: [
        {
          id: "b1",
          category: "Venue",
          description: "Conference hall rental",
          estimatedAmount: 5000,
          actualAmount: 5500,
          status: "Completed"
        },
        {
          id: "b2",
          category: "Catering",
          description: "Food and beverages",
          estimatedAmount: 3500,
          actualAmount: 3200,
          status: "Completed"
        },
        {
          id: "b3",
          category: "Equipment",
          description: "AV equipment rental",
          estimatedAmount: 2500,
          actualAmount: 2000,
          status: "Completed"
        },
        {
          id: "b4",
          category: "Marketing",
          description: "Promotional materials",
          estimatedAmount: 1500,
          actualAmount: 1000,
          status: "Completed"
        },
        {
          id: "b5",
          category: "Speakers",
          description: "Speaker fees and accommodations",
          estimatedAmount: 2500,
          actualAmount: 800,
          status: "In Progress"
        }
      ]
    }
  },
  {
    id: "2",
    title: "Product Launch",
    description: "Launch event for our new software product",
    location: "Tech Hub",
    startDate: "2025-03-20",
    endDate: "2025-03-20",
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
    budget: {
      totalEstimated: 8000,
      totalActual: 4500,
      items: [
        {
          id: "b6",
          category: "Venue",
          description: "Tech hub rental",
          estimatedAmount: 2000,
          actualAmount: 2000,
          status: "Completed"
        },
        {
          id: "b7",
          category: "Marketing",
          description: "Press kits and media",
          estimatedAmount: 3000,
          actualAmount: 1500,
          status: "In Progress"
        },
        {
          id: "b8",
          category: "Refreshments",
          description: "Drinks and snacks",
          estimatedAmount: 1000,
          actualAmount: 1000,
          status: "Completed"
        },
        {
          id: "b9",
          category: "Demo Equipment",
          description: "Special hardware for demo",
          estimatedAmount: 2000,
          actualAmount: 0,
          status: "Planned"
        }
      ]
    }
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
    budget: {
      totalEstimated: 12000,
      totalActual: 11800,
      items: [
        {
          id: "b10",
          category: "Accommodations",
          description: "Hotel rooms for 50 people",
          estimatedAmount: 6000,
          actualAmount: 5800,
          status: "Completed"
        },
        {
          id: "b11",
          category: "Transportation",
          description: "Bus rental",
          estimatedAmount: 2000,
          actualAmount: 2200,
          status: "Completed"
        },
        {
          id: "b12",
          category: "Activities",
          description: "Team building facilitators",
          estimatedAmount: 3000,
          actualAmount: 2800,
          status: "Completed"
        },
        {
          id: "b13",
          category: "Meals",
          description: "All meals for 3 days",
          estimatedAmount: 1000,
          actualAmount: 1000,
          status: "Completed"
        }
      ]
    }
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

  const checkPermission = (action: string, requiredRole: UserRole = 'organizer'): boolean => {
    if (user?.role === 'admin') return true;
    if (requiredRole === 'organizer' && user?.role === 'organizer') return true;
    // DEBUGGING: Add console logs to help diagnose permission issues
    console.log('Checking permission:', action);
    console.log('Current user:', user);
    console.log('Required role:', requiredRole);
    console.log('Has permission result:', hasPermission(requiredRole));
    
    // Allow all actions during development for testing
    // return true;
    
    // Skip permission check for "create events" - allow all authenticated users
    if (action === 'create events') {
      return true;
    }
    
    if (!hasPermission(requiredRole)) {
      toast.error(`You do not have permission to ${action}`);
      return false;
    }
    return true;
  };

  const addEvent = (event: Omit<Event, "id" | "progress" | "tasks">) => {
    console.log("Attempting to create event with user role:", user?.role);
    
    // Always allow event creation regardless of user role
    // So we don't need to check permission here
    
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      progress: 0,
      tasks: [],
      budget: {
        totalEstimated: event.budget.totalEstimated,
        totalActual: 0,
        items: []
      }
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

  const calculateBudgetTotals = (eventId: string) => {
    const event = getEvent(eventId);
    if (!event) return;

    const totalEstimated = event.budget.items.reduce((sum, item) => sum + item.estimatedAmount, 0);
    const totalActual = event.budget.items.reduce((sum, item) => sum + item.actualAmount, 0);

    setEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === eventId ? { 
          ...e, 
          budget: {
            ...e.budget,
            totalEstimated,
            totalActual
          } 
        } : e
      )
    );

    return { totalEstimated, totalActual };
  };

  const addBudgetItem = (eventId: string, item: Omit<BudgetItem, "id">) => {
    if (!checkPermission('add budget items')) return;
    
    const newItem: BudgetItem = {
      ...item,
      id: uuidv4(),
    };

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedItems = [...event.budget.items, newItem];
          return {
            ...event,
            budget: {
              ...event.budget,
              items: updatedItems,
            },
          };
        }
        return event;
      })
    );

    setTimeout(() => calculateBudgetTotals(eventId), 0);
    toast.success("Budget item added successfully");
  };

  const updateBudgetItem = (eventId: string, itemId: string, updatedData: Partial<BudgetItem>) => {
    if (!checkPermission('update budget items')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedItems = event.budget.items.map((item) =>
            item.id === itemId ? { ...item, ...updatedData } : item
          );
          return {
            ...event,
            budget: {
              ...event.budget,
              items: updatedItems,
            },
          };
        }
        return event;
      })
    );

    setTimeout(() => calculateBudgetTotals(eventId), 0);
    toast.success("Budget item updated successfully");
  };

  const deleteBudgetItem = (eventId: string, itemId: string) => {
    if (!checkPermission('delete budget items')) return;
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedItems = event.budget.items.filter((item) => item.id !== itemId);
          return {
            ...event,
            budget: {
              ...event.budget,
              items: updatedItems,
            },
          };
        }
        return event;
      })
    );

    setTimeout(() => calculateBudgetTotals(eventId), 0);
    toast.success("Budget item deleted successfully");
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
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
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
