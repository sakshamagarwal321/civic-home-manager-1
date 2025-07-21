
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInformationForm } from './forms/BasicInformationForm';
import { ContentCreationForm } from './forms/ContentCreationForm';
import { DeliverySettingsForm } from './forms/DeliverySettingsForm';
import { PreviewPanel } from './forms/PreviewPanel';
import { 
  FileText, 
  Settings, 
  Eye, 
  Send,
  AlertTriangle
} from 'lucide-react';

interface CreateAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (announcement: any) => void;
  isAlert?: boolean;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isAlert = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: isAlert ? 'Emergency' : 'General',
    priority: isAlert ? 'urgent' : 'normal',
    targetAudience: ['all'],
    publishing: 'now',
    scheduleDate: '',
    scheduleTime: '',
    expiryDate: '',
    notificationMethods: ['inapp'],
    interactiveFeatures: [],
    emergencyOverride: isAlert,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'normal',
      targetAudience: ['all'],
      publishing: 'now',
      scheduleDate: '',
      scheduleTime: '',
      expiryDate: '',
      notificationMethods: ['inapp'],
      interactiveFeatures: [],
      emergencyOverride: false,
    });
  };

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.content.trim() !== '';
  };

  const getActionButtonText = () => {
    if (isAlert) return 'Send Alert';
    if (formData.publishing === 'schedule') return 'Schedule Announcement';
    if (formData.publishing === 'draft') return 'Save Draft';
    return 'Publish Announcement';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {isAlert ? (
              <>
                <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
                Send Emergency Alert
              </>
            ) : (
              <>
                <FileText className="h-6 w-6 mr-2" />
                Create New Announcement
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Form Section */}
          <div className="lg:col-span-2 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="delivery" className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Delivery
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="basic" className="space-y-6">
                  <BasicInformationForm formData={formData} setFormData={setFormData} />
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <ContentCreationForm formData={formData} setFormData={setFormData} />
                </TabsContent>

                <TabsContent value="delivery" className="space-y-6">
                  <DeliverySettingsForm formData={formData} setFormData={setFormData} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1 border-l pl-6 overflow-y-auto">
            <PreviewPanel formData={formData} />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab('basic')}
              disabled={activeTab === 'basic'}
            >
              Previous
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                if (activeTab === 'basic') setActiveTab('content');
                else if (activeTab === 'content') setActiveTab('delivery');
              }}
              disabled={activeTab === 'delivery'}
            >
              Next
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={isAlert ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {getActionButtonText()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
