import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, IndianRupee, Eye, FileText, User, Calendar, AlertTriangle } from 'lucide-react';
import { useEnhancedToast } from '@/components/ui/enhanced-toast';
import { ApprovalConfirmationDialog } from './ApprovalConfirmationDialog';
import { RejectionModal } from './RejectionModal';
import { DetailsModal } from './DetailsModal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDashboardState } from '@/hooks/useDashboardState';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PendingApproval {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'approved' | 'rejected' | 'pending';
  attachments?: string[];
}

const initialPendingApprovals: PendingApproval[] = [
  {
    id: 1,
    title: 'Plumber Payment',
    description: 'Emergency repair - Flat A-301',
    amount: 3200,
    category: 'Maintenance',
    submittedBy: 'Maintenance Staff',
    submittedDate: '2025-01-20',
    priority: 'high' as const,
    attachments: ['receipt1.pdf', 'before_repair.jpg'],
  },
  {
    id: 2,
    title: 'Garden Maintenance',
    description: 'Monthly landscaping service',
    amount: 8500,
    category: 'Landscaping',
    submittedBy: 'Green Thumb Ltd',
    submittedDate: '2025-01-19',
    priority: 'medium' as const,
    attachments: ['invoice.pdf'],
  },
  {
    id: 3,
    title: 'Security Equipment',
    description: 'CCTV camera replacement',
    amount: 15600,
    category: 'Security',
    submittedBy: 'SecureTech Solutions',
    submittedDate: '2025-01-18',
    priority: 'medium' as const,
    attachments: ['quote.pdf', 'specs.pdf'],
  },
  {
    id: 4,
    title: 'Parking Slot Allocation',
    description: 'New resident request - Flat C-105',
    amount: 0,
    category: 'Administration',
    submittedBy: 'Priya Sharma',
    submittedDate: '2025-01-17',
    priority: 'low' as const,
  },
  {
    id: 5,
    title: 'Elevator Maintenance',
    description: 'Quarterly service contract',
    amount: 12000,
    category: 'Maintenance',
    submittedBy: 'Lift Tech Services',
    submittedDate: '2025-01-16',
    priority: 'high' as const,
    attachments: ['contract.pdf'],
  },
];

export const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState(initialPendingApprovals);
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  const [confirmationDialog, setConfirmationDialog] = useState<{ open: boolean; item: PendingApproval | null }>({
    open: false,
    item: null
  });
  const [rejectionModal, setRejectionModal] = useState<{ open: boolean; item: PendingApproval | null }>({
    open: false,
    item: null
  });
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; item: PendingApproval | null }>({
    open: false,
    item: null
  });

  const { enhancedToast } = useEnhancedToast();
  const { executeAsyncAction, isLoading } = useDashboardState();

  const totalAmount = approvals
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const handleApprove = (item: PendingApproval) => {
    setConfirmationDialog({ open: true, item });
  };

  const handleReject = (item: PendingApproval) => {
    setRejectionModal({ open: true, item });
  };

  const handleViewDetails = (item: PendingApproval) => {
    setDetailsModal({ open: true, item });
  };

  const confirmApproval = async (item: PendingApproval) => {
    await executeAsyncAction(
      `approve-${item.id}`,
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start fade-out animation
        setRemovingIds(prev => [...prev, item.id]);
        
        // Remove after animation
        setTimeout(() => {
          setApprovals(prev => prev.filter(approval => approval.id !== item.id));
          setRemovingIds(prev => prev.filter(id => id !== item.id));
        }, 300);
        
        return { success: true };
      },
      {
        successMessage: `${item.title} approved successfully`,
        errorMessage: "Failed to approve payment request. Please try again.",
        onSuccess: () => {
          setConfirmationDialog({ open: false, item: null });
          // Add to recent activity (this would typically trigger a context update)
          console.log(`Adding to Recent Activity: Payment approved - ₹${item.amount.toLocaleString()}`);
        }
      }
    );
  };

  const confirmRejection = async (item: PendingApproval, reason: string, comment: string) => {
    await executeAsyncAction(
      `reject-${item.id}`,
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start fade-out animation
        setRemovingIds(prev => [...prev, item.id]);
        
        // Remove after animation
        setTimeout(() => {
          setApprovals(prev => prev.filter(approval => approval.id !== item.id));
          setRemovingIds(prev => prev.filter(id => id !== item.id));
        }, 300);
        
        return { success: true };
      },
      {
        successMessage: "Payment request rejected successfully",
        errorMessage: "Failed to reject payment request. Please try again.",
        onSuccess: () => {
          setRejectionModal({ open: false, item: null });
          // Send notification to requester (this would be an API call)
          console.log(`Notification sent to ${item.submittedBy}: Request rejected - ${reason}. Comment: ${comment}`);
        }
      }
    );
  };

  return (
    <>
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Pending Approvals ({approvals.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total Amount: <span className="font-mono font-semibold">₹{totalAmount.toLocaleString()}</span>
            </p>
          </div>
          <Clock className="h-5 w-5 text-warning" />
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending approvals at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {approvals.map((approval) => (
                <div 
                  key={approval.id} 
                  className={`border rounded-lg p-4 space-y-3 transition-all duration-300 hover:shadow-md ${
                    removingIds.includes(approval.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{approval.title}</h4>
                        <Badge
                          variant={
                            approval.priority === 'high'
                              ? 'destructive'
                              : approval.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs animate-pulse"
                        >
                          {approval.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {approval.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center" aria-label={`Category: ${approval.category}`}>
                          <FileText className="h-3 w-3 mr-1" />
                          {approval.category}
                        </span>
                        <span className="flex items-center" aria-label={`Submitted by: ${approval.submittedBy}`}>
                          <User className="h-3 w-3 mr-1" />
                          {approval.submittedBy}
                        </span>
                        <span className="flex items-center" aria-label={`Submitted on: ${approval.submittedDate}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {approval.submittedDate}
                        </span>
                        {approval.attachments && approval.attachments.length > 0 && (
                          <span className="flex items-center" aria-label={`${approval.attachments.length} attachment${approval.attachments.length > 1 ? 's' : ''}`}>
                            <FileText className="h-3 w-3 mr-1" />
                            {approval.attachments.length} attachment{approval.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    {approval.amount > 0 && (
                      <div className="text-right">
                        <div className="flex items-center text-primary font-mono font-semibold">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {approval.amount.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="flex-1 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      onClick={() => handleApprove(approval)}
                      disabled={isLoading(`approve-${approval.id}`) || isLoading(`reject-${approval.id}`)}
                      aria-label={`Approve ${approval.title}`}
                    >
                      {isLoading(`approve-${approval.id}`) ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-1" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      onClick={() => handleReject(approval)}
                      disabled={isLoading(`approve-${approval.id}`) || isLoading(`reject-${approval.id}`)}
                      aria-label={`Reject ${approval.title}`}
                    >
                      {isLoading(`reject-${approval.id}`) ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-1" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      onClick={() => handleViewDetails(approval)}
                      aria-label={`View details for ${approval.title}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => !open && setConfirmationDialog({ open: false, item: null })}
        title="Approve Payment Request"
        description={confirmationDialog.item ? 
          `Are you sure you want to approve payment of ₹${confirmationDialog.item.amount.toLocaleString()} for ${confirmationDialog.item.description}?` : 
          ''
        }
        confirmText="Yes, Approve"
        variant="default"
        onConfirm={() => confirmationDialog.item && confirmApproval(confirmationDialog.item)}
        loading={confirmationDialog.item ? isLoading(`approve-${confirmationDialog.item.id}`) : false}
      />

      {/* Rejection Modal */}
      <RejectionModal
        open={rejectionModal.open}
        item={rejectionModal.item}
        onConfirm={confirmRejection}
        onCancel={() => setRejectionModal({ open: false, item: null })}
      />

      {/* Details Modal */}
      <DetailsModal
        open={detailsModal.open}
        item={detailsModal.item}
        onApprove={(item) => {
          setDetailsModal({ open: false, item: null });
          handleApprove(item);
        }}
        onReject={(item) => {
          setDetailsModal({ open: false, item: null });
          handleReject(item);
        }}
        onClose={() => setDetailsModal({ open: false, item: null })}
      />
    </>
  );
};
