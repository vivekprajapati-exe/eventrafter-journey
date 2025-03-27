
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import EventDetailsSection from "./EventDetailsSection";
import DateTimeSection from "./DateTimeSection";
import BudgetSection from "./BudgetSection";
import StatusSection from "./StatusSection";

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, "id" | "progress" | "tasks">) => void;
  isLoading?: boolean;
}

type EventStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";

interface FormData {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  status: EventStatus;
  attendees: string;
  estimatedBudget: string;
}

export default function EventForm({ event, onSubmit, isLoading = false }: EventFormProps) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    status: "Not Started",
    attendees: "0",
    estimatedBudget: "0",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        startTime: event.startTime,
        endTime: event.endTime,
        status: event.status,
        attendees: event.attendees.toString(),
        estimatedBudget: event.budget.totalEstimated.toString(),
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Event title is required");
      return;
    }

    if (formData.startDate > formData.endDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    // Create an initial budget object for new events
    const initialBudget = {
      totalEstimated: parseFloat(formData.estimatedBudget) || 0,
      totalActual: 0,
      items: []
    };

    onSubmit({
      ...formData,
      attendees: parseInt(formData.attendees) || 0,
      status: formData.status as EventStatus,
      budget: initialBudget
    });
  };

  return (
    <Card className="w-full max-w-3xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{event ? "Edit Event" : "Create New Event"}</CardTitle>
          <CardDescription>
            {event
              ? "Update your event details below"
              : "Fill in the details for your new event"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EventDetailsSection 
            title={formData.title}
            description={formData.description}
            location={formData.location}
            onChange={handleChange}
          />

          <DateTimeSection 
            startDate={formData.startDate}
            endDate={formData.endDate}
            startTime={formData.startTime}
            endTime={formData.endTime}
            onDateChange={handleDateChange}
            onChange={handleChange}
          />
          
          <Separator className="my-2" />
          
          <BudgetSection 
            estimatedBudget={formData.estimatedBudget}
            onChange={handleChange}
          />

          <StatusSection 
            status={formData.status}
            attendees={formData.attendees}
            onStatusChange={handleSelectChange}
            onChange={handleChange}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
