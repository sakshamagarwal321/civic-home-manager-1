
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  Upload, 
  X, 
  FileText, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  amount: string;
  date: Date;
  category: string;
  subcategory: string;
  priority: 'normal' | 'high' | 'urgent';
  vendor: string;
  invoiceNumber: string;
  gstNumber: string;
  paymentTerms: string;
  requiresApproval: boolean;
  approver: string;
  budgetCode: string;
  attachments: File[];
}

const categories = {
  'security': ['Guards Salary', 'CCTV Maintenance', 'Access Control', 'Security Equipment'],
  'utilities': ['Electricity', 'Water', 'Internet', 'Gas'],
  'maintenance': ['Elevator', 'Plumbing', 'Painting', 'Electrical Work'],
  'landscaping': ['Gardening', 'Plants', 'Equipment', 'Fertilizer'],
  'administration': ['Office Supplies', 'Legal', 'Banking', 'Insurance'],
};

const vendors = [
  { id: '1', name: 'SecureGuard Services', gst: '27ABCDE1234F1Z5' },
  { id: '2', name: 'State Electricity Board', gst: '27FGHIJ5678K2M6' },
  { id: '3', name: 'Otis Elevator Co.', gst: '27LMNOP9012N3P7' },
  { id: '4', name: 'Green Thumb Nursery', gst: '27QRSTU3456Q4R8' },
];

const approvers = [
  { id: '1', name: 'Rajesh Kumar (President)' },
  { id: '2', name: 'Priya Sharma (Treasurer)' },
  { id: '3', name: 'Amit Patel (Secretary)' },
];

export const ExpenseEntryModal: React.FC<ExpenseEntryModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    amount: '',
    date: new Date(),
    category: '',
    subcategory: '',
    priority: 'normal',
    vendor: '',
    invoiceNumber: '',
    gstNumber: '',
    paymentTerms: '',
    requiresApproval: true,
    approver: '',
    budgetCode: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        if (formData.title || formData.description || formData.amount) {
          setIsDraft(true);
          // In a real app, this would save to localStorage or backend
          console.log('Draft saved:', formData);
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [formData, open]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, subcategory: '' }));
      // Auto-suggest budget code based on category
      const budgetCodes = {
        'security': 'SEC-001',
        'utilities': 'UTL-001',
        'maintenance': 'MNT-001',
        'landscaping': 'LND-001',
        'administration': 'ADM-001'
      };
      setFormData(prev => ({ 
        ...prev, 
        budgetCode: budgetCodes[formData.category as keyof typeof budgetCodes] || '' 
      }));
    }
  }, [formData.category]);

  // Update GST number when vendor changes
  useEffect(() => {
    if (formData.vendor) {
      const vendor = vendors.find(v => v.name === formData.vendor);
      setFormData(prev => ({ 
        ...prev, 
        gstNumber: vendor?.gst || '' 
      }));
    }
  }, [formData.vendor]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.vendor) {
      newErrors.vendor = 'Vendor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission
      onOpenChange(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        date: new Date(),
        category: '',
        subcategory: '',
        priority: 'normal',
        vendor: '',
        invoiceNumber: '',
        gstNumber: '',
        paymentTerms: '',
        requiresApproval: true,
        approver: '',
        budgetCode: '',
        attachments: []
      });
    }
  };

  const handleDraft = () => {
    setIsDraft(true);
    console.log('Draft saved:', formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...files] 
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const subcategoryOptions = formData.category ? 
    categories[formData.category as keyof typeof categories] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Expense Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Monthly Security Payment"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="amount">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className={cn("pl-8", errors.amount ? 'border-red-500' : '')}
                  />
                </div>
                {errors.amount && (
                  <span className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.amount}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the expense"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security Services</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="maintenance">Maintenance & Repairs</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <span className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoryOptions.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <RadioGroup 
                  value={formData.priority} 
                  onValueChange={(value: 'normal' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Urgent</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vendor Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">
                  Vendor <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.vendor} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, vendor: value }))
                }>
                  <SelectTrigger className={errors.vendor ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Vendor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vendor && (
                  <span className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.vendor}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="INV-2025-001"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  placeholder="Auto-filled from vendor"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, paymentTerms: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="15-days">15 Days</SelectItem>
                    <SelectItem value="30-days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attachments</h3>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, JPG, PNG (Max 5MB each)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" className="mt-2">
                  Select Files
                </Button>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approval Workflow */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Approval Workflow</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, requiresApproval: checked }))
                  }
                />
                <Label htmlFor="requiresApproval">Requires Approval</Label>
              </div>

              {formData.requiresApproval && (
                <div>
                  <Label htmlFor="approver">Approver</Label>
                  <Select value={formData.approver} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, approver: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers.map((approver) => (
                        <SelectItem key={approver.id} value={approver.name}>
                          {approver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="budgetCode">Budget Code</Label>
                <Input
                  id="budgetCode"
                  placeholder="Auto-suggested"
                  value={formData.budgetCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetCode: e.target.value }))}
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex items-center space-x-2">
              {isDraft && (
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Draft saved
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={handleDraft}>
                Save Draft
              </Button>
              <Button type="submit">
                Submit Expense
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
