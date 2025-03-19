
import { CalendarDays, Clock, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Event } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    "Not Started": "bg-gray-200",
    "In Progress": "bg-blue-200 text-blue-800",
    "Completed": "bg-green-200 text-green-800",
    "Cancelled": "bg-red-200 text-red-800",
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-card bg-card rounded-lg border shadow-sm p-5" 
         onClick={handleViewDetails} 
         role="button" 
         tabIndex={0}
         onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(e as unknown as React.MouseEvent)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg truncate mb-1">
            {event.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`${statusColors[event.status as keyof typeof statusColors]}`}
          >
            {event.status}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dropdown
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={(e) => {
              e.preventDefault();
              navigate(`/events/${event.id}`);
            }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.preventDefault();
              navigate(`/events/${event.id}/edit`);
            }}>
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                onDelete(event.id);
              }}
            >
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{format(new Date(event.startDate), 'MMM d, yyyy')} - {format(new Date(event.endDate), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{event.startTime} - {event.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{event.attendees} attendees</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{event.progress}%</span>
        </div>
        <Progress value={event.progress} className="h-2" />
      </div>
    </div>
  );
}
