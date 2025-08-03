
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTestAuth } from '@/hooks/useTestAuth';
import { useTestFlatData } from '@/hooks/useTestFlatData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { NoFlatsAssigned } from './NoFlatsAssigned';
import { TestUserSwitcher } from './TestUserSwitcher';
import { PaymentFormSections } from './PaymentFormSections';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormData {
  flatNumber: string;
  paymentMonth: string;
  baseAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'cheque' | 'upi_imps' | 'bank_transfer';
  chequeNumber?: string;
  chequeDate?: string;
  bankName?: string;
  transactionReference?: string;
}

export const MaintenancePaymentForm: React.FC = () => {
  const { user: testUser, switchUser } = useTestAuth();
  const { userFlats, isLoading: flatsLoading, error: flatsError, refetch } = useTestFlatData();
  const { toast } = useToast();

  const [formData, setFormData] = useState<PaymentFormData>({
    flatNumber: '',
    paymentMonth: format(new Date(), 'yyyy-MM-01'),
    baseAmount: 2500,
    penaltyAmount: 0,
    totalAmount: 2500,
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'cash'
  });

  const [existingPayment, setExistingPayment] = useState<any>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle user switching with immediate feedback
  const handleUserSwitch = async (userId: string, name: string) => {
    console.log('=== HANDLING USER SWITCH ===');
    console.log('User switch requested:', { userId, name });
    
    setIsRefreshing(true);
    
    // Reset form data
    setFormData(prev => ({
      ...prev,
      flatNumber: '',
      baseAmount: 2500,
      totalAmount: 2500
    }));
    setExistingPayment(null);
    setSelectedFlat(null);
    
    // Switch user context
    switchUser(userId, name);
    
    // Refresh data
    setTimeout(() => {
      refetch();
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-select flat if user has only one and update base amount
  useEffect(() => {
    if (userFlats.length === 1 && !formData.flatNumber) {
      const flat = userFlats[0];
      console.log('Auto-selecting single flat:', flat);
      setFormData(prev => ({ 
        ...prev, 
        flatNumber: flat.flat_number,
        baseAmount: flat.monthly_maintenance,
        totalAmount: flat.monthly_maintenance
      }));
    }
  }, [userFlats, formData.flatNumber]);

  // Set selected flat details
  useEffect(() => {
    if (formData.flatNumber) {
      const flat = userFlats.find(f => f.flat_number === formData.flatNumber);
      console.log('Selected flat details:', flat);
      setSelectedFlat(flat);
      
      if (flat) {
        setFormData(prev => ({ 
          ...prev, 
          baseAmount: flat.monthly_maintenance,
          totalAmount: flat.monthly_maintenance + prev.penaltyAmount
        }));
      }
    }
  }, [formData.flatNumber, userFlats]);

  // Calculate penalty when payment date or month changes
  useEffect(() => {
    if (formData.paymentDate && formData.paymentMonth) {
      const paymentDate = new Date(formData.paymentDate);
      const monthObj = new Date(formData.paymentMonth);
      const dueDate = new Date(monthObj.getFullYear(), monthObj.getMonth(), 10);
      
      let penalty = 0;
      if (paymentDate > dueDate) {
        penalty = 200; // Fixed penalty amount
      }
      
      setFormData(prev => ({
        ...prev,
        penaltyAmount: penalty,
        totalAmount: prev.baseAmount + penalty
      }));
    }
  }, [formData.paymentDate, formData.paymentMonth, formData.baseAmount]);

  // Simulate checking for existing payment
  useEffect(() => {
    const checkPayment = async () => {
      if (formData.flatNumber && formData.paymentMonth) {
        setCheckingPayment(true);
        
        // Simulate API call delay
        setTimeout(() => {
          // For testing, assume no existing payment
          setExistingPayment(null);
          setCheckingPayment(false);
        }, 1000);
      }
    };
    
    checkPayment();
  }, [formData.flatNumber, formData.paymentMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingPayment) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing
      console.log('Processing payment:', formData);
      
      // Generate receipt number
      const receiptNumber = `ECO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Processed Successfully! 🎉",
        description: `Receipt ${receiptNumber} generated. Payment of ₹${formData.totalAmount} recorded.`,
      });

      // Reset form
      setFormData({
        flatNumber: userFlats.length === 1 ? userFlats[0].flat_number : '',
        paymentMonth: format(new Date(), 'yyyy-MM-01'),
        baseAmount: selectedFlat?.monthly_maintenance || 2500,
        penaltyAmount: 0,
        totalAmount: selectedFlat?.monthly_maintenance || 2500,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'cash'
      });
      
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show test user switcher at the top
  const renderTestUserSwitcher = () => (
    <TestUserSwitcher currentUser={testUser} onUserSwitch={handleUserSwitch} />
  );

  // Show loading state
  const renderLoadingState = () => (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading your assigned flats...</span>
        </div>
      </CardContent>
    </Card>
  );

  // Show refreshing state
  const renderRefreshingState = () => (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Switching user and loading flat data...</span>
        </div>
      </CardContent>
    </Card>
  );

  // Show error state
  const renderErrorState = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Unable to Load Flat Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {flatsError || 'Failed to load flat data'}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  // Show no flats state
  const renderNoFlatsState = () => <NoFlatsAssigned />;

  // Show successful flat loading with payment form
  const renderPaymentForm = () => (
    <>
      {/* Success indicator */}
      <Alert className="mb-4 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>✓ Flat data loaded successfully!</strong>
          <br />
          Found {userFlats.length} flat(s) assigned to {testUser?.name}. You can now make maintenance payments.
        </AlertDescription>
      </Alert>

      {/* Payment form */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentFormSections
            formData={formData}
            setFormData={setFormData}
            userFlats={userFlats}
            selectedFlat={selectedFlat}
            existingPayment={existingPayment}
            checkingPayment={checkingPayment}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {renderTestUserSwitcher()}
      
      {/* Show different states based on loading and data */}
      {isRefreshing && renderRefreshingState()}
      
      {!isRefreshing && flatsLoading && renderLoadingState()}
      
      {!isRefreshing && !flatsLoading && flatsError && renderErrorState()}
      
      {!isRefreshing && !flatsLoading && !flatsError && userFlats.length === 0 && renderNoFlatsState()}
      
      {!isRefreshing && !flatsLoading && !flatsError && userFlats.length > 0 && renderPaymentForm()}
    </div>
  );
};
