
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EventStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";

interface StatusSectionProps {
  status: EventStatus;
  attendees: string;
  onStatusChange: (name: string, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StatusSection({
  status,
  attendees,
  onStatusChange,
  onChange,
}: StatusSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Expected Attendees</Label>
        <Input
          id="attendees"
          name="attendees"
          type="number"
          min="0"
          value={attendees}
          onChange={onChange}
          placeholder="Number of attendees"
        />
      </div>
    </div>
  );
}
