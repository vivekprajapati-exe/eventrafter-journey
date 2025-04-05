
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  status: "Planned" | "In Progress" | "Completed";
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  placeId?: string;
  startDate: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  status: "Not Started" | "In Progress" | "Completed" | "Cancelled";
  attendees: number;
  progress: number;
  tasks: Task[];
  budget: {
    totalEstimated: number;
    totalActual: number;
    items: BudgetItem[];
  };
}

export interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "progress" | "tasks">) => string;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
  addTask: (eventId: string, task: Omit<Task, "id" | "completed">) => void;
  updateTask: (eventId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (eventId: string, taskId: string) => void;
  toggleTaskComplete: (eventId: string, taskId: string, completed: boolean) => void;
  addBudgetItem: (eventId: string, item: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (eventId: string, itemId: string, item: Partial<BudgetItem>) => void;
  deleteBudgetItem: (eventId: string, itemId: string) => void;
}

export type UserRole = 'admin' | 'organizer' | 'attendee';

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url?: string | null;
  role: UserRole;
}
