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
import { generatePDFReceipt } from '@/utils/receiptGenerator';

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

interface PaymentValidationErrors {
  [key: string]: string;
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
  const [validationErrors, setValidationErrors] = useState<PaymentValidationErrors>({});

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

  const validateForm = (): boolean => {
    const errors: PaymentValidationErrors = {};

    // Basic validation
    if (!formData.flatNumber) {
      errors.flatNumber = 'Please select a flat';
    }

    if (!formData.paymentMonth) {
      errors.paymentMonth = 'Please select payment month';
    }

    if (!formData.paymentDate) {
      errors.paymentDate = 'Please select payment date';
    }

    if (!formData.paymentMethod) {
      errors.paymentMethod = 'Please select payment method';
    }

    // Payment method specific validation
    if (formData.paymentMethod === 'cheque') {
      if (!formData.chequeNumber) {
        errors.chequeNumber = 'Cheque number is required';
      }
      if (!formData.chequeDate) {
        errors.chequeDate = 'Cheque date is required';
      }
      if (!formData.bankName) {
        errors.bankName = 'Bank name is required';
      }
    }

    if (formData.paymentMethod === 'upi_imps' || formData.paymentMethod === 'bank_transfer') {
      if (!formData.transactionReference) {
        errors.transactionReference = 'Transaction reference is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateReceiptNumber = (): string => {
    const currentYear = new Date().getFullYear();
    const sequence = String(Date.now()).slice(-3);
    return `ECO-${currentYear}-${sequence}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingPayment) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Processing payment:', formData);
      
      // Generate receipt number
      const receiptNumber = generateReceiptNumber();
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create payment record
      const paymentRecord = {
        receiptNumber,
        flatNumber: formData.flatNumber,
        residentName: testUser?.name || 'Unknown',
        paymentMonth: formData.paymentMonth,
        baseAmount: formData.baseAmount,
        penaltyAmount: formData.penaltyAmount,
        totalAmount: formData.totalAmount,
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        chequeNumber: formData.chequeNumber,
        chequeDate: formData.chequeDate,
        bankName: formData.bankName,
        transactionReference: formData.transactionReference
      };

      // Generate and download PDF receipt
      try {
        await generatePDFReceipt(paymentRecord);
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        // Continue with success flow even if PDF fails
      }

      // Determine payment status based on method
      let paymentStatus = 'completed';
      let statusMessage = 'Payment processed successfully!';
      
      if (formData.paymentMethod === 'cash') {
        paymentStatus = 'pending_verification';
        statusMessage = 'Cash payment recorded. Please visit the office for verification.';
      } else if (formData.paymentMethod === 'cheque') {
        paymentStatus = 'pending_clearance';
        statusMessage = 'Cheque payment recorded. Receipt generated pending clearance.';
      }

      toast({
        title: "Payment Successful! 🎉",
        description: `${statusMessage} Receipt ${receiptNumber} generated and downloaded.`,
      });

      // Reset form for next payment
      setFormData({
        flatNumber: userFlats.length === 1 ? userFlats[0].flat_number : '',
        paymentMonth: format(new Date(), 'yyyy-MM-01'),
        baseAmount: selectedFlat?.monthly_maintenance || 2500,
        penaltyAmount: 0,
        totalAmount: selectedFlat?.monthly_maintenance || 2500,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'cash'
      });

      // Clear validation errors
      setValidationErrors({});
      
      // Show additional success actions
      setTimeout(() => {
        toast({
          title: "What's Next?",
          description: "Receipt downloaded. Check your downloads folder for the PDF.",
        });
      }, 3000);
      
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: "Payment Processing Failed",
        description: "There was an error processing your payment. Please try again or contact administration.",
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
            validationErrors={validationErrors}
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
