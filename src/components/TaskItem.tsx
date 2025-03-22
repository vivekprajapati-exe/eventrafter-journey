import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onComplete, onDelete, onEdit }: TaskItemProps) {
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission('organizer');
  
  const priorityColors = {
    Low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    High: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  const handleCheckboxChange = (checked: boolean) => {
    // Only organizers and admins can mark tasks as complete/incomplete
    if (hasPermission('organizer')) {
      onComplete(task.id, checked);
    } else {
      // For attendees, we show a message that they don't have permission
      toast.error('You do not have permission to complete tasks');
    }
  };

  return (
    <div className={`task-item flex items-center justify-between p-3 rounded-md ${task.completed ? 'bg-muted/30' : ''}`}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={handleCheckboxChange}
          className={`${task.completed ? "text-green-500" : ""} cursor-pointer`}
          disabled={!hasPermission('organizer')}
        />
        
        <div className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          <p className="font-medium">{task.title}</p>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`${priorityColors[task.priority as keyof typeof priorityColors]}`}
        >
          {task.priority}
        </Badge>
        
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(task.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
