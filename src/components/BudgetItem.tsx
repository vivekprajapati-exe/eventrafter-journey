
import { useState } from "react";
import { BudgetItem as BudgetItemType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type BudgetItemProps = {
  item: BudgetItemType;
  onEdit: (item: BudgetItemType) => void;
  onDelete: (id: string) => void;
};

export default function BudgetItem({ item, onEdit, onDelete }: BudgetItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getVariance = () => {
    const variance = item.estimatedAmount - item.actualAmount;
    return {
      value: Math.abs(variance).toFixed(2),
      isPositive: variance >= 0,
    };
  };

  const variance = getVariance();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-200 text-green-700";
      case "In Progress":
        return "bg-blue-200 text-blue-700";
      case "Planned":
        return "bg-gray-200 text-gray-700";
      default:
        return "";
    }
  };

  return (
    <Card 
      className={cn(
        "relative border transition-all duration-200",
        isHovered ? "border-blue shadow-sm" : "border-border"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{item.category}</h4>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          </div>

          <div className={cn(
            "absolute right-2 top-2 transition-opacity duration-200 flex gap-1",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(item)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100" 
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">Estimated</p>
            <p className="font-mono font-medium">${item.estimatedAmount.toFixed(2)}</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">Actual</p>
            <p className="font-mono font-medium">${item.actualAmount.toFixed(2)}</p>
          </div>
          <div 
            className={cn(
              "text-center p-2 rounded-md",
              variance.isPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}
          >
            <p className="text-xs">Variance</p>
            <p className="font-mono font-medium">
              {variance.isPositive ? '+' : '-'}${variance.value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
