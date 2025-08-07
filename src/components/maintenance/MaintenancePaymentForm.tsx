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
import { toast } from 'sonner';
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
    console.log('=== VALIDATING FORM ===');
    console.log('Form data:', formData);
    
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

    console.log('Validation errors:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateReceiptNumber = (): string => {
    const currentYear = new Date().getFullYear();
    const sequence = String(Date.now()).slice(-3);
    return `ECO-${currentYear}-${sequence}`;
  };

  const downloadPDF = (pdfBlob: Blob, filename: string) => {
    try {
      console.log('Triggering PDF download with blob...');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the temporary URL
      URL.revokeObjectURL(url);
      console.log('PDF download triggered successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  const resetForm = () => {
    console.log('Resetting form for next payment...');
    const resetFormData = {
      flatNumber: userFlats.length === 1 ? userFlats[0].flat_number : '',
      paymentMonth: format(new Date(), 'yyyy-MM-01'),
      baseAmount: selectedFlat?.monthly_maintenance || 2500,
      penaltyAmount: 0,
      totalAmount: selectedFlat?.monthly_maintenance || 2500,
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'cash' as const,
      chequeNumber: undefined,
      chequeDate: undefined,
      bankName: undefined,
      transactionReference: undefined
    };
    
    console.log('Setting form data to:', resetFormData);
    setFormData(resetFormData);
    setValidationErrors({});
    console.log('Form reset completed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('=== PAYMENT FORM SUBMIT TRIGGERED ===');
    console.log('Event:', e);
    
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form data:', formData);
    console.log('Existing payment:', existingPayment);
    console.log('Is submitting:', isSubmitting);
    
    if (existingPayment) {
      console.log('Payment already exists, blocking submission');
      toast.error("Payment Already Exists", {
        description: "This flat already has a payment for the selected month."
      });
      return;
    }

    // Validate form
    console.log('Starting form validation...');
    if (!validateForm()) {
      console.log('Form validation failed');
      toast.error("Form Validation Error", {
        description: "Please fill in all required fields correctly."
      });
      return;
    }

    console.log('Form validation passed, proceeding with payment...');
    setIsSubmitting(true);

    try {
      console.log('Processing payment:', formData);
      
      // Generate receipt number
      const receiptNumber = generateReceiptNumber();
      console.log('Generated receipt number:', receiptNumber);
      
      // Simulate payment processing delay
      console.log('Simulating payment processing delay...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create payment record with correct property names for ReceiptData interface
      const paymentRecord = {
        receipt_number: receiptNumber,
        flat_number: formData.flatNumber,
        resident_name: testUser?.name || 'Unknown',
        payment_date: formData.paymentDate,
        payment_month: formData.paymentMonth,
        base_amount: formData.baseAmount,
        penalty_amount: formData.penaltyAmount,
        total_amount: formData.totalAmount,
        payment_method: formData.paymentMethod,
        society_name: 'ECO RESIDENTS WELFARE SOCIETY',
        society_address: 'Block A, Sector 15\nNoida, Uttar Pradesh - 201301\nPhone: +91-120-1234567'
      };

      console.log('Created payment record:', paymentRecord);

      // Generate and download PDF receipt
      try {
        console.log('Generating PDF receipt...');
        const pdfBlob = generatePDFReceipt(paymentRecord);
        console.log('PDF receipt generated successfully as blob');
        
        // Download the PDF
        const filename = `receipt-${receiptNumber}.pdf`;
        downloadPDF(pdfBlob, filename);
        
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        toast.error("PDF Generation Failed", {
          description: "Payment recorded but receipt couldn't be generated. Please contact administration."
        });
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

      console.log('Payment status:', paymentStatus);
      console.log('Status message:', statusMessage);

      toast.success("Payment Successful! 🎉", {
        description: `${statusMessage} Receipt ${receiptNumber} generated and downloaded.`
      });

      // Reset form for next payment
      resetForm();
      
      // Show additional success actions
      setTimeout(() => {
        toast.success("What's Next?", {
          description: "Receipt downloaded. Check your downloads folder for the PDF."
        });
      }, 3000);
      
    } catch (error) {
      console.error('Payment submission error:', error);
      
      toast.error("Payment Processing Failed", {
        description: `There was an error processing your payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact administration.`
      });
    } finally {
      console.log('Payment submission completed, resetting submitting state');
      setIsSubmitting(false);
    }
  };

  const renderTestUserSwitcher = () => (
    <TestUserSwitcher currentUser={testUser} onUserSwitch={handleUserSwitch} />
  );

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

  const renderNoFlatsState = () => <NoFlatsAssigned />;

  const renderPaymentForm = () => (
    <>
      <Alert className="mb-4 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>✓ Flat data loaded successfully!</strong>
          <br />
          Found {userFlats.length} flat(s) assigned to {testUser?.name}. You can now make maintenance payments.
        </AlertDescription>
      </Alert>

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
      
      {isRefreshing && renderRefreshingState()}
      
      {!isRefreshing && flatsLoading && renderLoadingState()}
      
      {!isRefreshing && !flatsLoading && flatsError && renderErrorState()}
      
      {!isRefreshing && !flatsLoading && !flatsError && userFlats.length === 0 && renderNoFlatsState()}
      
      {!isRefreshing && !flatsLoading && !flatsError && userFlats.length > 0 && renderPaymentForm()}
    </div>
  );
};
