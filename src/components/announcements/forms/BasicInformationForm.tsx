
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Wrench, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  Users,
  Building,
  UserCheck,
  Crown
} from 'lucide-react';

interface BasicInformationFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  formData,
  setFormData
}) => {
  const categories = [
    { value: 'General', label: 'General', icon: FileText },
    { value: 'Maintenance', label: 'Maintenance', icon: Wrench },
    { value: 'Financial', label: 'Financial', icon: DollarSign },
    { value: 'Events', label: 'Events', icon: Calendar },
    { value: 'Emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  const targetAudiences = [
    { value: 'all', label: 'All Residents', icon: Users },
    { value: 'owners', label: 'Owners Only', icon: Crown },
    { value: 'tenants', label: 'Tenants Only', icon: UserCheck },
    { value: 'committee', label: 'Committee Members', icon: Building },
    { value: 'specific', label: 'Specific Blocks', icon: Building },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter announcement title"
          maxLength={100}
          required
        />
        <div className="text-sm text-muted-foreground text-right">
          {formData.title.length}/100 characters
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
          className="flex flex-wrap gap-4"
        >
          {priorities.map((priority) => (
            <div key={priority.value} className="flex items-center space-x-2">
              <RadioGroupItem value={priority.value} id={priority.value} />
              <Label htmlFor={priority.value} className={`cursor-pointer ${priority.color}`}>
                {priority.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <div className="grid grid-cols-2 gap-3">
          {targetAudiences.map((audience) => (
            <div key={audience.value} className="flex items-center space-x-2">
              <Checkbox
                id={audience.value}
                checked={formData.targetAudience.includes(audience.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: [...prev.targetAudience, audience.value]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: prev.targetAudience.filter(t => t !== audience.value)
                    }));
                  }
                }}
              />
              <Label htmlFor={audience.value} className="flex items-center cursor-pointer">
                <audience.icon className="h-4 w-4 mr-2" />
                {audience.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
