
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IndianRupee } from 'lucide-react';

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

interface ApprovalConfirmationDialogProps {
  open: boolean;
  item: PendingApproval | null;
  onConfirm: (item: PendingApproval) => void;
  onCancel: () => void;
}

export const ApprovalConfirmationDialog: React.FC<ApprovalConfirmationDialogProps> = ({
  open,
  item,
  onConfirm,
  onCancel,
}) => {
  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Payment Request</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div className="text-base text-foreground">
              Approve payment of{' '}
              <span className="font-mono font-semibold flex items-center inline-flex">
                <IndianRupee className="h-4 w-4" />
                {item.amount.toLocaleString()}
              </span>{' '}
              for <strong>{item.description}</strong>?
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Requested by:</strong> {item.submittedBy}</p>
              <p><strong>Date:</strong> {item.submittedDate}</p>
              <p><strong>Priority:</strong> {item.priority}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(item)}
            className="bg-green-600 hover:bg-green-700"
          >
            Yes, Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
