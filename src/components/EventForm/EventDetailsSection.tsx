
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
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        {onLocationChange ? (
          <LocationAutocomplete
            value={location}
            onChange={onLocationChange}
            placeholder="Enter event location"
          />
        ) : (
          <Input
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="Enter event location"
          />
        )}
      </div>
    </>
  );
}
