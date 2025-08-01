
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Download, Calendar, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useMaintenancePayments } from '@/hooks/useMaintenancePayments';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

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
  const { 
    flats, 
    settings, 
    checkExistingPayment, 
    calculatePenalty, 
    createPayment, 
    isCreatingPayment 
  } = useMaintenancePayments();

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

  // Check for existing payment when flat or month changes
  useEffect(() => {
    const checkPayment = async () => {
      if (formData.flatNumber && formData.paymentMonth) {
        setCheckingPayment(true);
        try {
          const existing = await checkExistingPayment(formData.flatNumber, formData.paymentMonth);
          setExistingPayment(existing);
        } catch (error) {
          console.error('Error checking existing payment:', error);
        }
        setCheckingPayment(false);
      }
    };
    
    checkPayment();
  }, [formData.flatNumber, formData.paymentMonth, checkExistingPayment]);

  // Calculate penalty when payment date or month changes
  useEffect(() => {
    if (settings && formData.paymentDate && formData.paymentMonth) {
      const { penalty } = calculatePenalty(
        formData.paymentDate, 
        formData.paymentMonth,
        settings.penalty_due_date,
        settings.late_payment_penalty
      );
      
      setFormData(prev => ({
        ...prev,
        penaltyAmount: penalty,
        totalAmount: prev.baseAmount + penalty
      }));
    }
  }, [formData.paymentDate, formData.paymentMonth, settings, calculatePenalty]);

  // Set selected flat details
  useEffect(() => {
    if (formData.flatNumber) {
      const flat = flats.find(f => f.flat_number === formData.flatNumber);
      setSelectedFlat(flat);
    }
  }, [formData.flatNumber, flats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingPayment) {
      return;
    }

    try {
      const paymentData = {
        flat_number: formData.flatNumber,
        payment_month: formData.paymentMonth,
        base_amount: formData.baseAmount,
        penalty_amount: formData.penaltyAmount,
        total_amount: formData.totalAmount,
        payment_date: formData.paymentDate,
        payment_method: formData.paymentMethod,
        status: 'paid' as const,
        ...(formData.paymentMethod === 'cheque' && {
          cheque_number: formData.chequeNumber,
          cheque_date: formData.chequeDate,
          bank_name: formData.bankName
        }),
        ...((['upi_imps', 'bank_transfer'].includes(formData.paymentMethod)) && {
          transaction_reference: formData.transactionReference
        })
      };

      await createPayment(paymentData);
      
      // Reset form
      setFormData({
        flatNumber: '',
        paymentMonth: format(new Date(), 'yyyy-MM-01'),
        baseAmount: 2500,
        penaltyAmount: 0,
        totalAmount: 2500,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'cash'
      });
      
    } catch (error) {
      console.error('Payment submission error:', error);
    }
  };

  const getDaysLate = () => {
    if (settings && formData.paymentDate && formData.paymentMonth) {
      const { daysLate } = calculatePenalty(
        formData.paymentDate, 
        formData.paymentMonth,
        settings.penalty_due_date,
        settings.late_payment_penalty
      );
      return daysLate;
    }
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Flat & Month Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flat & Month Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flatNumber">Flat Number</Label>
                    <Select 
                      value={formData.flatNumber} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, flatNumber: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select flat number" />
                      </SelectTrigger>
                      <SelectContent>
                        {flats.map((flat) => (
                          <SelectItem key={flat.id} value={flat.flat_number}>
                            {flat.flat_number} - {flat.flat_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentMonth">Payment Month</Label>
                    <Input
                      type="month"
                      value={formData.paymentMonth.substring(0, 7)}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        paymentMonth: e.target.value + '-01' 
                      }))}
                    />
                  </div>
                </div>

                {selectedFlat && (
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Resident Name:</span>
                          <p>{selectedFlat.resident_name || 'Not assigned'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Flat Type:</span>
                          <p>{selectedFlat.flat_type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Check for existing payment */}
            {checkingPayment && (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Checking existing payment...</span>
              </div>
            )}

            {existingPayment && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Payment Already Completed ✅</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Amount Paid: ₹{existingPayment.total_amount}</div>
                      <div>Payment Date: {format(new Date(existingPayment.payment_date), 'MMM dd, yyyy')}</div>
                      <div>Receipt: {existingPayment.receipt_number}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!existingPayment && formData.flatNumber && (
              <>
                {/* Section 2: Payment Details & Penalty Calculation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base Amount</Label>
                        <Input value={`₹${formData.baseAmount}`} disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            paymentDate: e.target.value 
                          }))}
                        />
                      </div>
                    </div>

                    {formData.penaltyAmount > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium text-orange-600">Late Payment Penalty: ₹{formData.penaltyAmount} will be added</p>
                            <p className="text-sm">Payment is {getDaysLate()} days late</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Card className="bg-primary/5">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Payment Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Base Amount:</span>
                              <span>₹{formData.baseAmount}</span>
                            </div>
                            {formData.penaltyAmount > 0 && (
                              <div className="flex justify-between">
                                <span>Late Fee:</span>
                                <span className="text-orange-600">₹{formData.penaltyAmount}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total Amount:</span>
                              <span>₹{formData.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                {/* Section 3: Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value: any) => setFormData(prev => ({ 
                        ...prev, 
                        paymentMethod: value 
                      }))}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          Cash
                          <Badge variant="secondary" className="text-xs">Requires office verification</Badge>
                        </Label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cheque" id="cheque" />
                          <Label htmlFor="cheque" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Cheque
                          </Label>
                        </div>
                        
                        {formData.paymentMethod === 'cheque' && (
                          <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              placeholder="Cheque Number"
                              value={formData.chequeNumber || ''}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                chequeNumber: e.target.value 
                              }))}
                            />
                            <Input
                              type="date"
                              placeholder="Cheque Date"
                              value={formData.chequeDate || ''}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                chequeDate: e.target.value 
                              }))}
                            />
                            <Input
                              placeholder="Bank Name"
                              value={formData.bankName || ''}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                bankName: e.target.value 
                              }))}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upi_imps" id="upi" />
                          <Label htmlFor="upi" className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            UPI/IMPS
                          </Label>
                        </div>
                        
                        {formData.paymentMethod === 'upi_imps' && (
                          <div className="ml-6">
                            <Input
                              placeholder="Transaction Reference (Required)"
                              value={formData.transactionReference || ''}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                transactionReference: e.target.value 
                              }))}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank_transfer" id="bank" />
                          <Label htmlFor="bank" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Bank Transfer
                          </Label>
                        </div>
                        
                        {formData.paymentMethod === 'bank_transfer' && (
                          <div className="ml-6">
                            <Input
                              placeholder="Transaction Reference (Required)"
                              value={formData.transactionReference || ''}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                transactionReference: e.target.value 
                              }))}
                              required
                            />
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isCreatingPayment}
                    className="min-w-32"
                  >
                    {isCreatingPayment ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Submit Payment'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
