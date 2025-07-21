
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { FileSelectionStep } from './upload-steps/FileSelectionStep';
import { DocumentClassificationStep } from './upload-steps/DocumentClassificationStep';
import { AccessControlStep } from './upload-steps/AccessControlStep';
import { MetadataReviewStep } from './upload-steps/MetadataReviewStep';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: {
    title: string;
    category: string;
    subcategory?: string;
    description: string;
    tags: string[];
    documentType: 'Original' | 'Copy' | 'Amendment' | 'Translation';
    accessLevel: 'Public' | 'Members Only' | 'Committee' | 'Admin';
    permissions: string[];
    expiryDate?: Date;
    passwordProtected: boolean;
    downloadTracking: boolean;
    author: string;
    creationDate: Date;
    relatedDocuments: string[];
    legalStatus: 'Active' | 'Superseded' | 'Draft' | 'Archived';
    reviewRequired: boolean;
    notificationSettings: string[];
  };
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: UploadFile[]) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const steps = [
    { title: 'File Selection', component: FileSelectionStep },
    { title: 'Document Classification', component: DocumentClassificationStep },
    { title: 'Access Control', component: AccessControlStep },
    { title: 'Metadata & Review', component: MetadataReviewStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFilesSelected = (files: UploadFile[]) => {
    setUploadFiles(files);
  };

  const handleFileMetadataUpdate = (index: number, metadata: Partial<UploadFile['metadata']>) => {
    setUploadFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, metadata: { ...file.metadata, ...metadata } as UploadFile['metadata'] } : file
    ));
  };

  const handleUpload = async () => {
    // Simulate upload process
    for (let i = 0; i < uploadFiles.length; i++) {
      setUploadFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'uploading' } : file
      ));
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, progress } : file
        ));
      }
      
      setUploadFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'completed' } : file
      ));
    }
    
    onUploadComplete(uploadFiles);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setUploadFiles([]);
    setSelectedFileIndex(0);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return uploadFiles.length > 0;
      case 2:
        return uploadFiles.every(file => file.metadata?.title && file.metadata?.category);
      case 3:
        return uploadFiles.every(file => file.metadata?.accessLevel);
      case 4:
        return uploadFiles.every(file => file.metadata?.author);
      default:
        return false;
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload New Document
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex items-center ${
                    index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                      index + 1 <= currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium">{step.title}</span>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 bg-muted-foreground/20 ml-4" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto">
            <CurrentStepComponent
              files={uploadFiles}
              selectedFileIndex={selectedFileIndex}
              onFilesChange={handleFilesSelected}
              onFileMetadataUpdate={handleFileMetadataUpdate}
              onSelectedFileChange={setSelectedFileIndex}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleUpload}
                  disabled={!canProceed()}
                >
                  Upload Documents
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
