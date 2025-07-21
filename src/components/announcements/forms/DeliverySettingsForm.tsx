
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Mail, 
  MessageCircle, 
  Smartphone,
  Eye,
  MessageSquare,
  CheckCircle,
  Paperclip
} from 'lucide-react';

interface DeliverySettingsFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const DeliverySettingsForm: React.FC<DeliverySettingsFormProps> = ({
  formData,
  setFormData
}) => {
  const publishingOptions = [
    { value: 'now', label: 'Publish Now', icon: Bell },
    { value: 'schedule', label: 'Schedule for Later', icon: Calendar },
    { value: 'draft', label: 'Save as Draft', icon: Clock },
  ];

  const notificationMethods = [
    { value: 'inapp', label: 'In-app Notification', icon: Bell },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageCircle },
    { value: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
  ];

  const interactiveFeatures = [
    { value: 'rsvp', label: 'RSVP Required', icon: CheckCircle, description: 'For event announcements' },
    { value: 'comments', label: 'Comments Allowed', icon: MessageSquare, description: 'Enable discussions' },
    { value: 'acknowledgment', label: 'Acknowledgment Required', icon: Eye, description: 'Track read receipts' },
    { value: 'attachments', label: 'Allow Attachments', icon: Paperclip, description: 'PDF, Images, Documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Publishing Options */}
      <div className="space-y-2">
        <Label>Publishing</Label>
        <RadioGroup
          value={formData.publishing}
          onValueChange={(value) => setFormData(prev => ({ ...prev, publishing: value }))}
          className="space-y-2"
        >
          {publishingOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex items-center cursor-pointer">
                <option.icon className="h-4 w-4 mr-2" />
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Schedule Date/Time */}
      {formData.publishing === 'schedule' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Schedule Date</Label>
            <Input
              type="date"
              value={formData.scheduleDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule Time</Label>
            <Input
              type="time"
              value={formData.scheduleTime}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Expiry Date */}
      <div className="space-y-2">
        <Label>Expiry Date (Optional)</Label>
        <Input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
          placeholder="Auto-suggested based on category"
        />
      </div>

      {/* Notification Methods */}
      <div className="space-y-2">
        <Label>Notification Methods</Label>
        <div className="grid grid-cols-2 gap-3">
          {notificationMethods.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <Checkbox
                id={method.value}
                checked={formData.notificationMethods.includes(method.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      notificationMethods: [...prev.notificationMethods, method.value]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      notificationMethods: prev.notificationMethods.filter(n => n !== method.value)
                    }));
                  }
                }}
              />
              <Label htmlFor={method.value} className="flex items-center cursor-pointer">
                <method.icon className="h-4 w-4 mr-2" />
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Features */}
      <div className="space-y-2">
        <Label>Interactive Features</Label>
        <div className="space-y-3">
          {interactiveFeatures.map((feature) => (
            <div key={feature.value} className="flex items-start space-x-2">
              <Checkbox
                id={feature.value}
                checked={formData.interactiveFeatures.includes(feature.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      interactiveFeatures: [...prev.interactiveFeatures, feature.value]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      interactiveFeatures: prev.interactiveFeatures.filter(f => f !== feature.value)
                    }));
                  }
                }}
              />
              <div className="flex-1">
                <Label htmlFor={feature.value} className="flex items-center cursor-pointer">
                  <feature.icon className="h-4 w-4 mr-2" />
                  {feature.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Override */}
      {formData.category === 'Emergency' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency-override"
              checked={formData.emergencyOverride}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, emergencyOverride: checked }))
              }
            />
            <Label htmlFor="emergency-override" className="font-medium text-red-800">
              Emergency Override
            </Label>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Bypass normal delivery schedules and send immediately to all residents
          </p>
        </div>
      )}
    </div>
  );
};
