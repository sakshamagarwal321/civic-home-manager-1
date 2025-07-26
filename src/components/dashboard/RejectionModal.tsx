
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface PendingApproval {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  attachments?: string[];
}

interface RejectionModalProps {
  open: boolean;
  item: PendingApproval | null;
  onConfirm: (item: PendingApproval, reason: string, comment: string) => void;
  onCancel: () => void;
}

const rejectionReasons = [
  "Insufficient documentation",
  "Budget exceeded",
  "Duplicate request",
  "Policy violation",
  "Unauthorized expense",
  "Requires committee approval",
  "Other"
];

export const RejectionModal: React.FC<RejectionModalProps> = ({
  open,
  item,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!item || !reason) return;
    
    setIsSubmitting(true);
    await onConfirm(item, reason, comment);
    setIsSubmitting(false);
    
    // Reset form
    setReason('');
    setComment('');
  };

  const handleCancel = () => {
    setReason('');
    setComment('');
    onCancel();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reject Payment Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this payment request. The requester will be notified with your feedback.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Request Details */}
          <div className="bg-muted p-3 rounded-lg space-y-1">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-sm">
              <strong>Amount:</strong> ₹{item.amount.toLocaleString()} | 
              <strong> Requested by:</strong> {item.submittedBy}
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for rejection *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment">Additional notes (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Provide additional context or suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Rejecting...
              </>
            ) : (
              'Reject Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
