
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Upload, User, Home, Phone, CheckCircle, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | undefined;
  occupation: string;
  profilePhoto: File | null;
  
  // Flat Information
  flatNumber: string;
  block: string;
  floor: string;
  ownershipType: 'owner' | 'tenant';
  moveInDate: Date | undefined;
  familySize: number;
  
  // Emergency Contact
  emergencyContactName: string;
  relationship: string;
  emergencyPhone: string;
  alternateAddress: string;
  medicalInformation: string;
  
  // Review
  agreeToTerms: boolean;
  autoGenerateCredentials: boolean;
  emailCredentials: boolean;
}

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Flat', icon: Home },
  { id: 3, title: 'Emergency', icon: Phone },
  { id: 4, title: 'Review', icon: CheckCircle },
];

const flatOptions = [
  'A-101', 'A-102', 'A-103', 'A-201', 'A-202', 'A-203',
  'B-101', 'B-102', 'B-103', 'B-201', 'B-202', 'B-203', 'B-204',
  'C-101', 'C-102', 'C-201', 'C-202', 'C-301', 'C-302', 'C-305'
];

const relationshipOptions = [
  'Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Colleague', 'Other'
];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: undefined,
    occupation: '',
    profilePhoto: null,
    flatNumber: '',
    block: '',
    floor: '',
    ownershipType: 'owner',
    moveInDate: undefined,
    familySize: 1,
    emergencyContactName: '',
    relationship: '',
    emergencyPhone: '',
    alternateAddress: '',
    medicalInformation: '',
    agreeToTerms: false,
    autoGenerateCredentials: true,
    emailCredentials: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getBlockAndFloor = (flatNumber: string) => {
    const block = flatNumber.charAt(0);
    const floor = flatNumber.charAt(2);
    return { block, floor };
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.flatNumber) newErrors.flatNumber = 'Flat number is required';
        if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
        break;
      case 3:
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
        break;
      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleFlatChange = (flatNumber: string) => {
    const { block, floor } = getBlockAndFloor(flatNumber);
    updateFormData('flatNumber', flatNumber);
    updateFormData('block', block);
    updateFormData('floor', floor);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('profilePhoto', file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  {formData.profilePhoto ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePhoto)} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-sm">
                    +91
                  </span>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className={cn('rounded-l-none', errors.phone ? 'border-destructive' : '')}
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => updateFormData('dateOfBirth', date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => updateFormData('occupation', e.target.value)}
                placeholder="Enter occupation"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flatNumber">Flat Number *</Label>
                <Select value={formData.flatNumber} onValueChange={handleFlatChange}>
                  <SelectTrigger className={errors.flatNumber ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select flat number" />
                  </SelectTrigger>
                  <SelectContent>
                    {flatOptions.map(flat => (
                      <SelectItem key={flat} value={flat}>{flat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.flatNumber && <p className="text-sm text-destructive mt-1">{errors.flatNumber}</p>}
              </div>

              <div>
                <Label htmlFor="block">Block</Label>
                <Input
                  id="block"
                  value={formData.block}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  value={formData.floor}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div>
                <Label>Ownership Type</Label>
                <RadioGroup
                  value={formData.ownershipType}
                  onValueChange={(value) => updateFormData('ownershipType', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner">Owner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tenant" id="tenant" />
                    <Label htmlFor="tenant">Tenant</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moveInDate">Move-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        errors.moveInDate ? 'border-destructive' : ''
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.moveInDate ? format(formData.moveInDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.moveInDate}
                      onSelect={(date) => updateFormData('moveInDate', date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.moveInDate && <p className="text-sm text-destructive mt-1">{errors.moveInDate}</p>}
              </div>

              <div>
                <Label htmlFor="familySize">Family Size</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateFormData('familySize', Math.max(1, formData.familySize - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="familySize"
                    type="number"
                    value={formData.familySize}
                    onChange={(e) => updateFormData('familySize', parseInt(e.target.value) || 1)}
                    className="text-center w-20"
                    min="1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateFormData('familySize', formData.familySize + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                  placeholder="Enter contact name"
                  className={errors.emergencyContactName ? 'border-destructive' : ''}
                />
                {errors.emergencyContactName && <p className="text-sm text-destructive mt-1">{errors.emergencyContactName}</p>}
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select value={formData.relationship} onValueChange={(value) => updateFormData('relationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map(relation => (
                      <SelectItem key={relation} value={relation.toLowerCase()}>{relation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-sm">
                  +91
                </span>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                  placeholder="Enter emergency phone"
                  className={cn('rounded-l-none', errors.emergencyPhone ? 'border-destructive' : '')}
                />
              </div>
              {errors.emergencyPhone && <p className="text-sm text-destructive mt-1">{errors.emergencyPhone}</p>}
            </div>

            <div>
              <Label htmlFor="alternateAddress">Alternate Address</Label>
              <Textarea
                id="alternateAddress"
                value={formData.alternateAddress}
                onChange={(e) => updateFormData('alternateAddress', e.target.value)}
                placeholder="Enter alternate address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medicalInformation">Medical Information</Label>
              <Textarea
                id="medicalInformation"
                value={formData.medicalInformation}
                onChange={(e) => updateFormData('medicalInformation', e.target.value)}
                placeholder="Any medical conditions, allergies, or important health information"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {formData.fullName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> +91 {formData.phone}</div>
                <div><strong>Flat:</strong> {formData.flatNumber} (Block {formData.block}, Floor {formData.floor})</div>
                <div><strong>Ownership:</strong> {formData.ownershipType}</div>
                <div><strong>Move-in Date:</strong> {formData.moveInDate ? format(formData.moveInDate, 'PPP') : 'Not specified'}</div>
                <div><strong>Family Size:</strong> {formData.familySize}</div>
                <div><strong>Emergency Contact:</strong> {formData.emergencyContactName} ({formData.emergencyPhone})</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the terms and conditions *
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoGenerateCredentials"
                  checked={formData.autoGenerateCredentials}
                  onCheckedChange={(checked) => updateFormData('autoGenerateCredentials', checked)}
                />
                <Label htmlFor="autoGenerateCredentials" className="text-sm">
                  Auto-generate login credentials
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailCredentials"
                  checked={formData.emailCredentials}
                  onCheckedChange={(checked) => updateFormData('emailCredentials', checked)}
                />
                <Label htmlFor="emailCredentials" className="text-sm">
                  Email credentials to resident
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resident</DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-muted-foreground text-muted-foreground'
              )}>
                <step.icon className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-12 h-0.5 mx-4 transition-colors',
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Add Resident
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
