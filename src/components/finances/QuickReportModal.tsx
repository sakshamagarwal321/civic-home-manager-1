
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface QuickReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  reportType: string;
  startDate: Date;
  endDate: Date;
  format: 'pdf' | 'excel';
}

export const QuickReportModal: React.FC<QuickReportModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [formData, setFormData] = useState<FormData>({
    reportType: '',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    format: 'pdf'
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'financial-summary', label: 'Financial Summary' },
    { value: 'member-activity', label: 'Member Activity' },
    { value: 'expense-details', label: 'Expense Details' },
    { value: 'payment-status', label: 'Payment Status' },
    { value: 'maintenance-report', label: 'Maintenance Report' },
    { value: 'facility-usage', label: 'Facility Usage' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.reportType) {
      newErrors.reportType = 'Report type is required';
    }

    if (formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Report data:', formData);
      
      // Simulate file download
      const fileName = `${formData.reportType}_${format(formData.startDate, 'yyyy-MM-dd')}_to_${format(formData.endDate, 'yyyy-MM-dd')}.${formData.format}`;
      
      toast({
        title: "Success",
        description: `Report generated successfully. Download: ${fileName}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Monthly Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <Label htmlFor="reportType">
              Report Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.reportType} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, reportType: value }))
            }>
              <SelectTrigger className={errors.reportType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reportType && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reportType}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "MMM dd") : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "MMM dd") : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <span className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.endDate}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label>Format</Label>
            <RadioGroup 
              value={formData.format} 
              onValueChange={(value: 'pdf' | 'excel') => 
                setFormData(prev => ({ ...prev, format: value }))
              }
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
