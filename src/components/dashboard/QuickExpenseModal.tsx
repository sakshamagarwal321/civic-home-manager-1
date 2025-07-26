
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuickExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: (expense: any) => void;
}

const categories = [
  'Security Services',
  'Utilities',
  'Maintenance & Repairs',
  'Landscaping',
  'Administration',
  'Insurance',
  'Legal',
  'Others'
];

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({
  open,
  onOpenChange,
  onExpenseAdded
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date());
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        status: 'approved'
      };

      // Show success animation
      setShowSuccess(true);
      
      // Notify parent component
      onExpenseAdded(newExpense);

      toast({
        title: "Expense Added Successfully",
        description: `₹${parseFloat(amount).toLocaleString()} added to ${category}`,
      });

      // Close modal after brief success display
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      toast({
        title: "Failed to Add Expense",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-scale-in" />
            <p className="text-lg font-semibold">Expense Added!</p>
            <p className="text-muted-foreground text-center">
              ₹{parseFloat(amount).toLocaleString()} has been added to your expenses.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                placeholder="e.g., Monthly electricity bill"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="amount">
                Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                Add Expense
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
