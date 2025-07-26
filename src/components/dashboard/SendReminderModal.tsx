
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

interface SendReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const overdueResidents = [
  { id: 1, name: "Rajesh Kumar", flat: "A-301", amount: 7000, days: 45 },
  { id: 2, name: "Priya Sharma", flat: "B-205", amount: 3500, days: 15 },
  { id: 3, name: "Amit Patel", flat: "C-102", amount: 3500, days: 75 },
  { id: 4, name: "Sunita Verma", flat: "A-404", amount: 7000, days: 30 },
  { id: 5, name: "Vikram Singh", flat: "B-301", amount: 3500, days: 20 },
  { id: 6, name: "Meera Joshi", flat: "C-205", amount: 3500, days: 25 },
  { id: 7, name: "Ravi Gupta", flat: "A-102", amount: 3500, days: 10 },
  { id: 8, name: "Kavita Nair", flat: "B-404", amount: 7000, days: 35 }
];

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const [reminderType, setReminderType] = useState('email');
  const [message, setMessage] = useState(`Dear {resident_name},

This is a friendly reminder that your maintenance payment of ₹{amount} for Flat {flat_number} is overdue by {days_overdue} days.

Please make the payment at your earliest convenience to avoid any inconvenience.

Thank you for your cooperation.

Best regards,
Society Management`);
  const [isLoading, setIsLoading] = useState(false);

  const handleResidentToggle = (residentId: number) => {
    setSelectedResidents(prev => 
      prev.includes(residentId)
        ? prev.filter(id => id !== residentId)
        : [...prev, residentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedResidents.length === overdueResidents.length) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(overdueResidents.map(r => r.id));
    }
  };

  const handleSendReminders = async () => {
    if (selectedResidents.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one resident to send reminders.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Reminders Sent Successfully",
        description: `Reminders sent to ${selectedResidents.length} residents via ${reminderType}`,
      });
      
      // Reset form
      setSelectedResidents([]);
      setReminderType('email');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to Send Reminders",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Payment Reminders</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Select Recipients</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
              >
                {selectedResidents.length === overdueResidents.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {overdueResidents.map((resident) => (
                <div key={resident.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted">
                  <Checkbox
                    id={`resident-${resident.id}`}
                    checked={selectedResidents.includes(resident.id)}
                    onCheckedChange={() => handleResidentToggle(resident.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`resident-${resident.id}`} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{resident.name}</p>
                          <p className="text-sm text-muted-foreground">Flat {resident.flat}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{resident.amount.toLocaleString()}</p>
                          <p className="text-sm text-red-600">{resident.days} days overdue</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Type */}
          <div>
            <Label className="text-base font-medium mb-3 block">Reminder Type</Label>
            <RadioGroup value={reminderType} onValueChange={setReminderType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both Email & SMS</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Message Template */}
          <div>
            <Label htmlFor="message" className="text-base font-medium">Message Template</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Use placeholders: {'{resident_name}'}, {'{amount}'}, {'{flat_number}'}, {'{days_overdue}'}
            </p>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendReminders}
              disabled={isLoading || selectedResidents.length === 0}
            >
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Send Reminders ({selectedResidents.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
