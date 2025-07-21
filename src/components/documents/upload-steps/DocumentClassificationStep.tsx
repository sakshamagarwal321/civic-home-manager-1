
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus, FileText, Calendar, IndianRupee, Scale, Bell, Wrench } from 'lucide-react';

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
  };
}

interface DocumentClassificationStepProps {
  files: UploadFile[];
  selectedFileIndex: number;
  onFileMetadataUpdate: (index: number, metadata: Partial<UploadFile['metadata']>) => void;
  onSelectedFileChange: (index: number) => void;
}

export const DocumentClassificationStep: React.FC<DocumentClassificationStepProps> = ({
  files,
  selectedFileIndex,
  onFileMetadataUpdate,
  onSelectedFileChange,
}) => {
  const categories = [
    { id: 'bylaws', name: 'Society Bylaws', icon: FileText },
    { id: 'minutes', name: 'Meeting Minutes', icon: Calendar },
    { id: 'financial', name: 'Financial Records', icon: IndianRupee },
    { id: 'legal', name: 'Legal Documents', icon: Scale },
    { id: 'notices', name: 'Notices & Circulars', icon: Bell },
    { id: 'maintenance', name: 'Maintenance Records', icon: Wrench },
  ];

  const subcategories = {
    bylaws: ['Original Bylaws', 'Amendment 1', 'Amendment 2'],
    minutes: ['AGM Minutes', 'Committee Meetings'],
    financial: ['Annual Budgets', 'Audit Reports', 'Tax Documents', 'Bank Statements'],
    legal: ['Registration Certificate', 'NOC Documents', 'Insurance Policies', 'Contracts'],
    notices: ['Government Notices', 'Society Notices'],
    maintenance: ['Equipment Warranties', 'Service Agreements'],
  };

  const commonTags = [
    'Important', 'Confidential', 'Public', 'Annual', 'Monthly', 'Legal', 'Financial',
    'Maintenance', 'Emergency', 'AGM', 'Committee', 'Audit', 'Budget', 'Insurance',
    'Registration', 'NOC', 'Warranty', 'Contract', 'Notice', 'Circular'
  ];

  const currentFile = files[selectedFileIndex];
  const currentMetadata = currentFile?.metadata || {
    title: currentFile?.file.name.replace(/\.[^/.]+$/, '') || '',
    category: '',
    subcategory: '',
    description: '',
    tags: [],
    documentType: 'Original' as const,
  };

  const updateMetadata = (field: string, value: any) => {
    onFileMetadataUpdate(selectedFileIndex, { [field]: value });
  };

  const addTag = (tag: string) => {
    if (!currentMetadata.tags.includes(tag)) {
      updateMetadata('tags', [...currentMetadata.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateMetadata('tags', currentMetadata.tags.filter(t => t !== tag));
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* File Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Document Classification</CardTitle>
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
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classification Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            Classify: {currentFile?.file.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={currentMetadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              placeholder="Enter document title"
            />
            <p className="text-xs text-muted-foreground">
              {currentMetadata.title.length}/100 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={currentMetadata.category}
              onValueChange={(value) => {
                updateMetadata('category', value);
                updateMetadata('subcategory', '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          {currentMetadata.category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={currentMetadata.subcategory}
                onValueChange={(value) => updateMetadata('subcategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories[currentMetadata.category as keyof typeof subcategories]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentMetadata.description}
              onChange={(e) => updateMetadata('description', e.target.value)}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentMetadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {commonTags
                .filter(tag => !currentMetadata.tags.includes(tag))
                .map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
            </div>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <RadioGroup
              value={currentMetadata.documentType}
              onValueChange={(value) => updateMetadata('documentType', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Original" id="original" />
                <Label htmlFor="original">Original</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Copy" id="copy" />
                <Label htmlFor="copy">Copy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Amendment" id="amendment" />
                <Label htmlFor="amendment">Amendment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Translation" id="translation" />
                <Label htmlFor="translation">Translation</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
