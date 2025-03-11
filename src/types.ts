
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  status: "Not Started" | "In Progress" | "Completed" | "Cancelled";
  attendees: number;
  progress: number;
  tasks: Task[];
}

export interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "progress" | "tasks">) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
  addTask: (eventId: string, task: Omit<Task, "id" | "completed">) => void;
  updateTask: (eventId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (eventId: string, taskId: string) => void;
  toggleTaskComplete: (eventId: string, taskId: string, completed: boolean) => void;
}
