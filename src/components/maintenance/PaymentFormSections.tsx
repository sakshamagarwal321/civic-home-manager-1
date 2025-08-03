
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Download, Calendar, CreditCard, Banknote, Smartphone, Home, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { TestFlat } from '@/hooks/useTestFlatData';

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

interface PaymentFormSectionsProps {
  formData: PaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  userFlats: TestFlat[];
  selectedFlat: TestFlat | null;
  existingPayment: any;
  checkingPayment: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const PaymentFormSections: React.FC<PaymentFormSectionsProps> = ({
  formData,
  setFormData,
  userFlats,
  selectedFlat,
  existingPayment,
  checkingPayment,
  isSubmitting,
  onSubmit
}) => {
  const getDaysLate = () => {
    if (formData.paymentDate && formData.paymentMonth) {
      const paymentDate = new Date(formData.paymentDate);
      const monthObj = new Date(formData.paymentMonth);
      const dueDate = new Date(monthObj.getFullYear(), monthObj.getMonth(), 10);
      
      if (paymentDate > dueDate) {
        return Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    return 0;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Section 1: Flat & Month Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Flat & Month Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flatNumber">Select Your Flat</Label>
              <Select 
                value={formData.flatNumber} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, flatNumber: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={userFlats.length === 1 ? "Auto-selected" : "Select your flat"} />
                </SelectTrigger>
                <SelectContent>
                  {userFlats.map((flat) => (
                    <SelectItem key={flat.flat_id} value={flat.flat_number}>
                      {flat.flat_number} ({flat.flat_type} - {flat.assignment_type === 'owner' ? 'Owner' : 'Tenant'})
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
            <Card className="bg-primary/5">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span className="font-medium">Flat Details</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      <p>Flat Number: <span className="font-medium">{selectedFlat.flat_number}</span></p>
                      <p>Block: {selectedFlat.block}, Floor: {selectedFlat.floor_number}</p>
                      <p>Type: {selectedFlat.flat_type}</p>
                      <p>Area: {selectedFlat.carpet_area} sq ft</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Ownership</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedFlat.assignment_type === 'owner' ? 'default' : 'secondary'}>
                          {selectedFlat.assignment_type === 'owner' ? 'Owner' : 'Tenant'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">Since: {new Date(selectedFlat.start_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Monthly Maintenance: ₹{selectedFlat.monthly_maintenance.toLocaleString()}
                      </p>
                    </div>
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
          {/* Payment Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Amount</Label>
                  <Input value={`₹${formData.baseAmount.toLocaleString()}`} disabled />
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
                      <p className="font-medium text-orange-600">
                        Late Payment Penalty: ₹{formData.penaltyAmount} will be added
                      </p>
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
                        <span>₹{formData.baseAmount.toLocaleString()}</span>
                      </div>
                      {formData.penaltyAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Late Fee:</span>
                          <span className="text-orange-600">₹{formData.penaltyAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Amount:</span>
                        <span>₹{formData.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Payment Method Section */}
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
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
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
  );
};
