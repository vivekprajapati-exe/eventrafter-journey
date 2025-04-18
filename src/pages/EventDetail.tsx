import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEvents } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import BudgetForm from "@/components/BudgetForm";
import BudgetItem from "@/components/BudgetItem";
import BudgetChart from "@/components/BudgetChart";
import GoogleCalendarButton from "@/components/GoogleCalendarButton";
import { Task, BudgetItem as BudgetItemType } from "@/types";
import { CalendarDays, ChevronLeft, Clock, Edit, MapPin, Plus, Users, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const {
    getEvent,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem
  } = useEvents();
  
  const [event, setEvent] = useState<null | undefined | any>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItemType | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteBudgetDialog, setShowDeleteBudgetDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [budgetItemToDelete, setBudgetItemToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  
  useEffect(() => {
    const loadEvent = () => {
      setLoading(true);
      if (!eventId) {
        setEvent(null);
        setLoading(false);
        return;
      }
      try {
        const foundEvent = getEvent(eventId);
        console.log("Loading event:", foundEvent);
        setEvent(foundEvent);
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
    return () => {};
  }, [eventId, getEvent]);

  if (loading) {
    return <div className="container py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>;
  }

  if (!event) {
    return <div className="container py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
        <p className="mb-8 text-muted-foreground">The event you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/events">Back to Events</Link>
        </Button>
      </div>;
  }

  const openGoogleMaps = () => {
    if (event.placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${event.placeId}`, '_blank');
    } else if (event.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank');
    }
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "completed">) => {
    addTask(event.id, taskData);
    setIsTaskFormOpen(false);
    setEvent(getEvent(event.id));
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "completed">) => {
    if (currentTask) {
      updateTask(event.id, currentTask.id, taskData);
      setCurrentTask(undefined);
      setIsTaskFormOpen(false);
      setEvent(getEvent(event.id));
    }
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(event.id, taskToDelete);
      setTaskToDelete(null);
      setShowDeleteDialog(false);
      setEvent(getEvent(event.id));
    }
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    toggleTaskComplete(event.id, taskId, completed);
    setEvent(getEvent(event.id));
  };

  const handleAddBudgetItem = (itemData: Omit<BudgetItemType, "id">) => {
    addBudgetItem(event.id, itemData);
    setIsBudgetFormOpen(false);
    setEvent(getEvent(event.id));
  };

  const handleEditBudgetItem = (item: BudgetItemType) => {
    setCurrentBudgetItem(item);
    setIsBudgetFormOpen(true);
  };

  const handleUpdateBudgetItem = (itemData: Omit<BudgetItemType, "id">) => {
    if (currentBudgetItem) {
      updateBudgetItem(event.id, currentBudgetItem.id, itemData);
      setCurrentBudgetItem(undefined);
      setIsBudgetFormOpen(false);
      setEvent(getEvent(event.id));
    }
  };

  const handleDeleteBudgetClick = (itemId: string) => {
    setBudgetItemToDelete(itemId);
    setShowDeleteBudgetDialog(true);
  };

  const confirmDeleteBudgetItem = () => {
    if (budgetItemToDelete) {
      deleteBudgetItem(event.id, budgetItemToDelete);
      setBudgetItemToDelete(null);
      setShowDeleteBudgetDialog(false);
      setEvent(getEvent(event.id));
    }
  };
  
  const pendingTasks = event.tasks.filter(task => !task.completed);
  const completedTasks = event.tasks.filter(task => task.completed);

  return <div className="container py-8">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link to="/events">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <Badge variant="outline" className="">
                {event.status}
              </Badge>
            </div>
            {event.description && <p className="text-muted-foreground mt-2">{event.description}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/events/${event.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Event
              </Link>
            </Button>
            <GoogleCalendarButton event={event} />
            {activeTab === "tasks" ? (
              <Button onClick={() => setIsTaskFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            ) : (
              <Button onClick={() => setIsBudgetFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Budget Item
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{event.tasks.filter(t => t.completed).length} of {event.tasks.length} tasks completed</span>
                  <span className="font-medium">{event.progress}%</span>
                </div>
                <Progress value={event.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{format(new Date(event.startDate), 'MMM d, yyyy')} - {format(new Date(event.endDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                {event.location && (
                  <div 
                    className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary"
                    onClick={openGoogleMaps}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="underline">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Tasks</span>
                <span>{event.tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-green-600">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-amber-600">{pendingTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">High Priority</span>
                <span className="text-red-600">{event.tasks.filter(t => t.priority === "High").length}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Budget</span>
                  <span className="font-mono">${event.budget.totalEstimated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Actual Spent</span>
                  <span className="font-mono">${event.budget.totalActual.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="tasks" className="flex gap-2">
            Tasks <Badge variant="outline">{event.tasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex gap-2">
            Budget <Badge variant="outline">{event.budget.items.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-4">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending" className="flex gap-2">
                Pending <Badge variant="outline">{pendingTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex gap-2">
                Completed <Badge variant="outline">{completedTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  {pendingTasks.length > 0 ? <div className="space-y-2">
                      {pendingTasks.map(task => <TaskItem key={task.id} task={task} onComplete={(id, completed) => handleTaskComplete(id, completed)} onDelete={id => handleDeleteClick(id)} onEdit={handleEditTask} />)}
                    </div> : <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No pending tasks</p>
                      <Button size="sm" onClick={() => setIsTaskFormOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                      </Button>
                    </div>}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  {completedTasks.length > 0 ? <div className="space-y-2">
                      {completedTasks.map(task => <TaskItem key={task.id} task={task} onComplete={(id, completed) => handleTaskComplete(id, completed)} onDelete={id => handleDeleteClick(id)} onEdit={handleEditTask} />)}
                    </div> : <div className="text-center py-8">
                      <p className="text-muted-foreground">No completed tasks yet</p>
                    </div>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-4 space-y-6">
          <Card>
            <CardContent className="p-6">
              <BudgetChart 
                items={event.budget.items} 
                totalEstimated={event.budget.totalEstimated} 
                totalActual={event.budget.totalActual} 
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Budget Items</h3>
            <Button onClick={() => setIsBudgetFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Budget Item
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.budget.items.length > 0 ? (
              event.budget.items.map(item => (
                <BudgetItem 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEditBudgetItem} 
                  onDelete={handleDeleteBudgetClick} 
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No budget items added yet</p>
                  <Button onClick={() => setIsBudgetFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Budget Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <TaskForm 
        open={isTaskFormOpen} 
        onOpenChange={setIsTaskFormOpen} 
        task={currentTask} 
        onSubmit={currentTask ? handleUpdateTask : handleAddTask} 
      />
      
      <BudgetForm 
        open={isBudgetFormOpen} 
        onOpenChange={setIsBudgetFormOpen} 
        item={currentBudgetItem} 
        onSubmit={currentBudgetItem ? handleUpdateBudgetItem : handleAddBudgetItem} 
      />
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showDeleteBudgetDialog} onOpenChange={setShowDeleteBudgetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this budget item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBudgetItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}
