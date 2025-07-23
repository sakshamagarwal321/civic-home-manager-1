
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { CalendarIcon, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface QuickAddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  amount: string;
  category: string;
  description: string;
  date: Date;
  receipt: File | null;
}

export const QuickAddExpenseModal: React.FC<QuickAddExpenseModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    receipt: null
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Expense data:', formData);
      
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date(),
        receipt: null
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        setFormData(prev => ({ ...prev, receipt: file }));
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a valid image or PDF file (max 5MB)",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Monthly Security Payment"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </span>
            )}
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
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className={cn("pl-8", errors.amount ? 'border-red-500' : '')}
              />
            </div>
            {errors.amount && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.category}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about the expense"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="receipt">Receipt Upload</Label>
            <div className="mt-2">
              <input
                id="receipt"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="receipt">
                <Button type="button" variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.receipt ? formData.receipt.name : 'Upload Receipt'}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
