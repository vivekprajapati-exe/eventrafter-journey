
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface BudgetSectionProps {
  estimatedBudget: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BudgetSection({
  estimatedBudget,
  onChange,
}: BudgetSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="estimatedBudget">Estimated Budget</Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          id="estimatedBudget"
          name="estimatedBudget"
          type="number"
          min="0"
          step="0.01"
          value={estimatedBudget}
          onChange={onChange}
          placeholder="Enter estimated budget"
          className="pl-10"
        />
      </div>
    </div>
  );
}
