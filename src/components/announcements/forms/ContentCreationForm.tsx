
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link, 
  Image,
  FileText,
  Clock
} from 'lucide-react';

interface ContentCreationFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ContentCreationForm: React.FC<ContentCreationFormProps> = ({
  formData,
  setFormData
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = {
    General: [
      { value: 'meeting', label: 'Meeting Notice', content: 'Dear Residents,\n\nWe are pleased to inform you about an upcoming meeting scheduled for [Date] at [Time] in the [Location].\n\nAgenda:\n• [Agenda Item 1]\n• [Agenda Item 2]\n• [Agenda Item 3]\n\nYour participation is highly appreciated.\n\nBest regards,\n[Your Name]' },
      { value: 'general', label: 'General Announcement', content: 'Dear Residents,\n\nWe would like to inform you about [Subject].\n\n[Details]\n\nFor any queries, please contact [Contact Information].\n\nThank you for your cooperation.\n\nBest regards,\n[Your Name]' }
    ],
    Maintenance: [
      { value: 'maintenance', label: 'Maintenance Alert', content: 'Dear Residents,\n\nScheduled maintenance work will be conducted on [Date] from [Start Time] to [End Time].\n\nAffected Services:\n• [Service 1]\n• [Service 2]\n\nWe apologize for any inconvenience caused.\n\nMaintenance Team' },
      { value: 'facility', label: 'Facility Booking Guidelines', content: 'Dear Residents,\n\nPlease note the updated facility booking guidelines:\n\n• Advance booking required: [Days] days\n• Booking hours: [Hours]\n• Cancellation policy: [Policy]\n• Contact for booking: [Contact]\n\nThank you for your cooperation.\n\nManagement Committee' }
    ],
    Financial: [
      { value: 'payment', label: 'Payment Due Reminder', content: 'Dear Residents,\n\nThis is a friendly reminder that your monthly maintenance charges of ₹[Amount] are due by [Date].\n\nPayment Methods:\n• Online: [Payment Portal]\n• Bank Transfer: [Account Details]\n• Cash: [Collection Details]\n\nLate payment charges may apply after the due date.\n\nAccounts Department' },
      { value: 'monthly', label: 'Monthly Maintenance Notice', content: 'Dear Residents,\n\nMonthly maintenance charges for [Month] [Year] are now due.\n\nAmount: ₹[Amount]\nDue Date: [Date]\n\nPlease ensure timely payment to avoid late fees.\n\nTreasurer' }
    ],
    Events: [
      { value: 'event', label: 'Event Invitation', content: 'Dear Residents,\n\nYou are cordially invited to [Event Name] on [Date] at [Time].\n\nVenue: [Location]\nDress Code: [Code]\nRefreshments: [Details]\n\nPlease RSVP by [Date] to [Contact].\n\nWe look forward to your participation!\n\nCultural Committee' },
      { value: 'festival', label: 'Festival Celebration Announcement', content: 'Dear Residents,\n\nJoin us in celebrating [Festival Name] on [Date] from [Start Time] to [End Time].\n\nActivities:\n• [Activity 1]\n• [Activity 2]\n• [Activity 3]\n\nPlease bring your family and friends!\n\nEvent Committee' }
    ],
    Emergency: [
      { value: 'security', label: 'Security Policy Update', content: 'URGENT: Security Policy Update\n\nDear Residents,\n\nEffective immediately, the following security measures are in place:\n\n• [Policy 1]\n• [Policy 2]\n• [Policy 3]\n\nPlease comply with these measures for everyone\'s safety.\n\nEmergency Contact: [Number]\n\nSecurity Committee' }
    ]
  };

  const applyTemplate = (template: string) => {
    const categoryTemplates = templates[formData.category as keyof typeof templates] || [];
    const selectedTemplateData = categoryTemplates.find(t => t.value === template);
    if (selectedTemplateData) {
      setFormData(prev => ({ ...prev, content: selectedTemplateData.content }));
    }
  };

  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-2">
        <Label>Content Templates</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template" />
          </SelectTrigger>
          <SelectContent>
            {(templates[formData.category as keyof typeof templates] || []).map((template) => (
              <SelectItem key={template.value} value={template.value}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedTemplate && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => applyTemplate(selectedTemplate)}
            className="w-full"
          >
            Apply Template
          </Button>
        )}
      </div>

      {/* Formatting Toolbar */}
      <div className="space-y-2">
        <Label>Content *</Label>
        <div className="flex items-center space-x-2 p-2 border rounded-t-md bg-muted/20">
          <Button type="button" variant="ghost" size="sm">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button type="button" variant="ghost" size="sm">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Link className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Image className="h-4 w-4" />
          </Button>
        </div>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Enter announcement content"
          rows={8}
          className="rounded-t-none"
          required
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{formData.content.length} characters</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{estimateReadingTime(formData.content)} min read</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>Readability: Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};
