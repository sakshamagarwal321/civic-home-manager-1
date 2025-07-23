
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
}

export const QuickAnnouncementModal: React.FC<QuickAnnouncementModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    message: '',
    category: '',
    priority: 'medium',
    targetAudience: []
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General Information',
    'Maintenance Notice',
    'Emergency Alert',
    'Event Notification',
    'Payment Reminder',
    'Policy Update',
    'Others'
  ];

  const audienceOptions = [
    'All Residents',
    'Owners Only',
    'Tenants Only',
    'Committee Members',
    'Security Staff',
    'Maintenance Team'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.targetAudience.length === 0) {
      newErrors.targetAudience = 'Select at least one target audience';
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
      
      console.log('Announcement data:', formData);
      
      toast({
        title: "Success",
        description: "Announcement sent successfully",
      });
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        category: '',
        priority: 'medium',
        targetAudience: []
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAudienceChange = (audience: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: checked 
        ? [...prev.targetAudience, audience]
        : prev.targetAudience.filter(a => a !== audience)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Monthly Maintenance Notice"
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
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Write your announcement message here..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className={errors.message ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.message && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.message}
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
            <Label>Priority</Label>
            <RadioGroup 
              value={formData.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>
              Target Audience <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {audienceOptions.map((audience) => (
                <div key={audience} className="flex items-center space-x-2">
                  <Checkbox
                    id={audience}
                    checked={formData.targetAudience.includes(audience)}
                    onCheckedChange={(checked) => 
                      handleAudienceChange(audience, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={audience}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {audience}
                  </Label>
                </div>
              ))}
            </div>
            {errors.targetAudience && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.targetAudience}
              </span>
            )}
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
              {isSubmitting ? 'Sending...' : 'Send Announcement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
