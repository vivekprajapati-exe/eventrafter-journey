
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface EventDetailsSectionProps {
  title: string;
  description: string;
  location: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationChange?: (location: string, placeId?: string) => void;
}

export default function EventDetailsSection({
  title,
  description,
  location,
  onChange,
  onLocationChange,
}: EventDetailsSectionProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Enter event title"
          required
          className="transition-all duration-300 focus:border-blue focus:ring-1 focus:ring-blue/30 hover:border-muted-foreground/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Enter event description"
          rows={3}
          className="transition-all duration-300 focus:border-blue focus:ring-1 focus:ring-blue/30 hover:border-muted-foreground/50 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
        {onLocationChange ? (
          <LocationAutocomplete
            value={location}
            onChange={onLocationChange}
            placeholder="Enter event location"
            className="transition-all duration-300 focus:border-blue focus:ring-1 focus:ring-blue/30 hover:border-muted-foreground/50"
          />
        ) : (
          <Input
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="Enter event location"
            className="transition-all duration-300 focus:border-blue focus:ring-1 focus:ring-blue/30 hover:border-muted-foreground/50"
          />
        )}
      </div>
    </div>
  );
}
