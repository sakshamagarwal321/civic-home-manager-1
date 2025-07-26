
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  X, 
  IndianRupee, 
  FileText, 
  User, 
  Calendar, 
  AlertTriangle,
  Paperclip,
  MessageSquare
} from 'lucide-react';

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

interface DetailsModalProps {
  open: boolean;
  item: PendingApproval | null;
  onApprove: (item: PendingApproval) => void;
  onReject: (item: PendingApproval) => void;
  onClose: () => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  open,
  item,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!item) return null;

  const handleAttachmentClick = (attachment: string) => {
    // In a real app, this would open the file in a new tab or modal
    console.log(`Opening attachment: ${attachment}`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payment Request Details</span>
            <Badge
              variant={
                item.priority === 'high'
                  ? 'destructive'
                  : item.priority === 'medium'
                  ? 'default'
                  : 'secondary'
              }
              className="text-xs"
            >
              {item.priority} priority
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about this payment request
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Request Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                <p className="text-sm font-medium mt-1">{item.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                <div className="flex items-center text-sm font-mono font-semibold mt-1">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {item.amount.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{item.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <div className="flex items-center text-sm mt-1">
                  <FileText className="h-4 w-4 mr-2" />
                  {item.category}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                <div className="flex items-center text-sm mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(item.submittedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Requester Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Requester Information</h3>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.submittedBy}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Contact requester for additional information if needed
            </p>
          </div>

          <Separator />

          {/* Attachments */}
          {item.attachments && item.attachments.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachments ({item.attachments.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {item.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleAttachmentClick(attachment)}
                    >
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Action History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Action History</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3 text-sm">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Request submitted</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(item.submittedDate).toLocaleDateString()} by {item.submittedBy}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Pending approval</p>
                  <p className="text-muted-foreground text-xs">
                    Awaiting committee review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button variant="ghost" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Request More Info
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onReject(item)} 
            className="flex-1 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button onClick={() => onApprove(item)} className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for labels
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={className}>{children}</div>
);
