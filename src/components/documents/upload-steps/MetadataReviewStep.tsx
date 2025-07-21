
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, User, Clock, Link2, Scale, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: {
    title?: string;
    category?: string;
    subcategory?: string;
    description?: string;
    tags?: string[];
    documentType?: 'Original' | 'Copy' | 'Amendment' | 'Translation';
    accessLevel?: 'Public' | 'Members Only' | 'Committee' | 'Admin';
    permissions?: string[];
    expiryDate?: Date;
    passwordProtected?: boolean;
    downloadTracking?: boolean;
    author: string;
    creationDate: Date;
    relatedDocuments: string[];
    legalStatus: 'Active' | 'Superseded' | 'Draft' | 'Archived';
    reviewRequired: boolean;
    notificationSettings: string[];
  };
}

interface MetadataReviewStepProps {
  files: UploadFile[];
  selectedFileIndex: number;
  onFileMetadataUpdate: (index: number, metadata: Partial<UploadFile['metadata']>) => void;
  onSelectedFileChange: (index: number) => void;
}

export const MetadataReviewStep: React.FC<MetadataReviewStepProps> = ({
  files,
  selectedFileIndex,
  onFileMetadataUpdate,
  onSelectedFileChange,
}) => {
  const currentFile = files[selectedFileIndex];
  const currentMetadata = currentFile?.metadata || {
    title: '',
    category: '',
    subcategory: '',
    description: '',
    tags: [],
    documentType: 'Original' as const,
    accessLevel: 'Public' as const,
    permissions: [],
    expiryDate: undefined,
    passwordProtected: false,
    downloadTracking: false,
    author: '',
    creationDate: new Date(),
    relatedDocuments: [],
    legalStatus: 'Active' as const,
    reviewRequired: false,
    notificationSettings: ['Committee Members'],
  };

  const updateMetadata = (field: string, value: any) => {
    onFileMetadataUpdate(selectedFileIndex, { [field]: value });
  };

  const notificationOptions = [
    'All Residents',
    'Committee Members',
    'Administrators',
    'Document Reviewers',
    'Category Subscribers',
  ];

  const toggleNotification = (option: string) => {
    const current = currentMetadata.notificationSettings || [];
    const updated = current.includes(option)
      ? current.filter(n => n !== option)
      : [...current, option];
    updateMetadata('notificationSettings', updated);
  };

  const getFileIcon = (file: File) => {
    return <div className="w-4 h-4 bg-gray-300 rounded" />;
  };

  const getSummary = () => {
    const totalFiles = files.length;
    const readyFiles = files.filter(f => f.metadata?.author).length;
    const requiresReview = files.filter(f => f.metadata?.reviewRequired).length;
    
    return { totalFiles, readyFiles, requiresReview };
  };

  const { totalFiles, readyFiles, requiresReview } = getSummary();

  return (
    <div className="space-y-6">
      {/* Upload Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalFiles}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{readyFiles}</div>
              <div className="text-sm text-muted-foreground">Ready to Upload</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{requiresReview}</div>
              <div className="text-sm text-muted-foreground">Requires Review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata & Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {files.map((file, index) => (
              <Button
                key={file.id}
                variant={index === selectedFileIndex ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectedFileChange(index)}
                className="flex items-center space-x-2"
              >
                {getFileIcon(file.file)}
                <span className="truncate max-w-[150px]">
                  {file.file.name}
                </span>
                {file.metadata?.reviewRequired && (
                  <AlertCircle className="h-3 w-3 text-orange-500" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            Document Metadata: {currentFile?.file.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Author/Source */}
          <div className="space-y-2">
            <Label htmlFor="author">Author/Source *</Label>
            <Input
              id="author"
              value={currentMetadata.author}
              onChange={(e) => updateMetadata('author', e.target.value)}
              placeholder="Enter document author or source"
            />
          </div>

          {/* Creation Date */}
          <div className="space-y-2">
            <Label>Creation Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentMetadata.creationDate ? (
                    format(currentMetadata.creationDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentMetadata.creationDate}
                  onSelect={(date) => updateMetadata('creationDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Legal Status */}
          <div className="space-y-2">
            <Label>Legal Status</Label>
            <Select
              value={currentMetadata.legalStatus}
              onValueChange={(value) => updateMetadata('legalStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select legal status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Superseded">Superseded</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Required */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Review Required</Label>
              <p className="text-sm text-muted-foreground">
                Document needs committee approval before publishing
              </p>
            </div>
            <Switch
              checked={currentMetadata.reviewRequired}
              onCheckedChange={(checked) => updateMetadata('reviewRequired', checked)}
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-2">
            <Label>Notification Settings</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Who should be notified about this upload?
            </p>
            <div className="space-y-2">
              {notificationOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={currentMetadata.notificationSettings?.includes(option)}
                    onCheckedChange={() => toggleNotification(option)}
                  />
                  <Label htmlFor={option} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Review */}
      <Card>
        <CardHeader>
          <CardTitle>Final Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.file)}
                    <div>
                      <h4 className="font-medium">{file.metadata?.title || file.file.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {file.metadata?.category || 'Uncategorized'} • {file.metadata?.accessLevel || 'Public'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={file.metadata?.reviewRequired ? 'secondary' : 'default'}>
                      {file.metadata?.reviewRequired ? 'Needs Review' : 'Ready'}
                    </Badge>
                    <Badge variant="outline">{file.metadata?.legalStatus}</Badge>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Author: {file.metadata?.author}</p>
                  <p>Type: {file.metadata?.documentType || 'Original'}</p>
                  {file.metadata?.tags && file.metadata.tags.length > 0 && (
                    <p>Tags: {file.metadata.tags.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
