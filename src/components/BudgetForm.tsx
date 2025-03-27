
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BudgetItem } from "@/types";

type BudgetFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: BudgetItem;
  onSubmit: (data: Omit<BudgetItem, "id">) => void;
};

const categories = [
  "Venue",
  "Catering",
  "Marketing",
  "Equipment",
  "Transportation",
  "Accommodation",
  "Speakers",
  "Entertainment",
  "Staff",
  "Miscellaneous"
];

const statusOptions = ["Planned", "In Progress", "Completed"];

export default function BudgetForm({ open, onOpenChange, item, onSubmit }: BudgetFormProps) {
  const [category, setCategory] = useState<string>(item?.category || "");
  const [description, setDescription] = useState<string>(item?.description || "");
  const [estimatedAmount, setEstimatedAmount] = useState<number>(item?.estimatedAmount || 0);
  const [actualAmount, setActualAmount] = useState<number>(item?.actualAmount || 0);
  const [status, setStatus] = useState<string>(item?.status || "Planned");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setDescription(item.description);
      setEstimatedAmount(item.estimatedAmount);
      setActualAmount(item.actualAmount);
      setStatus(item.status);
      
      setIsCustomCategory(!categories.includes(item.category));
      if (!categories.includes(item.category)) {
        setCustomCategory(item.category);
      }
    } else {
      setCategory("");
      setDescription("");
      setEstimatedAmount(0);
      setActualAmount(0);
      setStatus("Planned");
      setCustomCategory("");
      setIsCustomCategory(false);
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategory : category;
    
    onSubmit({
      category: finalCategory,
      description,
      estimatedAmount,
      actualAmount,
      status: status as "Planned" | "In Progress" | "Completed",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Budget Item" : "Add Budget Item"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {!isCustomCategory ? (
              <>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    <SelectItem value="custom">+ Custom Category</SelectItem>
                  </SelectContent>
                </Select>
                {category === "custom" && (
                  <div className="mt-2">
                    <Input
                      id="customCategory"
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setIsCustomCategory(true);
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex space-x-2">
                <Input
                  id="customCategory"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCustomCategory(false)}
                  className="shrink-0"
                >
                  Select Existing
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedAmount">Estimated Amount</Label>
              <Input
                id="estimatedAmount"
                type="number"
                min="0"
                step="0.01"
                value={estimatedAmount}
                onChange={(e) => setEstimatedAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualAmount">Actual Amount</Label>
              <Input
                id="actualAmount"
                type="number"
                min="0"
                step="0.01"
                value={actualAmount}
                onChange={(e) => setActualAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit">{item ? "Update" : "Add"} Budget Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
