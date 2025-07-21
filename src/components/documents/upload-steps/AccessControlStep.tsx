
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Globe, Users, Building, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: {
    accessLevel: 'Public' | 'Members Only' | 'Committee' | 'Admin';
    permissions: string[];
    expiryDate?: Date;
    passwordProtected: boolean;
    downloadTracking: boolean;
  };
}

interface AccessControlStepProps {
  files: UploadFile[];
  selectedFileIndex: number;
  onFileMetadataUpdate: (index: number, metadata: Partial<UploadFile['metadata']>) => void;
  onSelectedFileChange: (index: number) => void;
}

export const AccessControlStep: React.FC<AccessControlStepProps> = ({
  files,
  selectedFileIndex,
  onFileMetadataUpdate,
  onSelectedFileChange,
}) => {
  const currentFile = files[selectedFileIndex];
  const currentMetadata = currentFile?.metadata || {
    accessLevel: 'Members Only' as const,
    permissions: ['View', 'Download'],
    expiryDate: undefined,
    passwordProtected: false,
    downloadTracking: true,
  };

  const updateMetadata = (field: string, value: any) => {
    onFileMetadataUpdate(selectedFileIndex, { [field]: value });
  };

  const accessLevels = [
    {
      id: 'Public',
      name: 'Public',
      description: 'All residents can view and download',
      icon: Globe,
      color: 'text-blue-500',
    },
    {
      id: 'Members Only',
      name: 'Members Only',
      description: 'Registered residents only',
      icon: Users,
      color: 'text-green-500',
    },
    {
      id: 'Committee',
      name: 'Committee',
      description: 'Committee members only',
      icon: Building,
      color: 'text-orange-500',
    },
    {
      id: 'Admin',
      name: 'Admin',
      description: 'Super admin access only',
      icon: Lock,
      color: 'text-red-500',
    },
  ];

  const permissions = [
    { id: 'View', name: 'View', description: 'Can view document content' },
    { id: 'Download', name: 'Download', description: 'Can download document files' },
    { id: 'Comment', name: 'Comment', description: 'Can add comments and annotations' },
    { id: 'Share', name: 'Share', description: 'Can share document with others' },
  ];

  const togglePermission = (permission: string) => {
    const current = currentMetadata.permissions || [];
    const updated = current.includes(permission)
      ? current.filter(p => p !== permission)
      : [...current, permission];
    updateMetadata('permissions', updated);
  };

  const getFileIcon = (file: File) => {
    return <div className="w-4 h-4 bg-gray-300 rounded" />;
  };

  return (
    <div className="space-y-6">
      {/* File Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control & Permissions</CardTitle>
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

      {/* Access Level */}
      <Card>
        <CardHeader>
          <CardTitle>Access Level</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentMetadata.accessLevel}
            onValueChange={(value) => updateMetadata('accessLevel', value)}
            className="space-y-4"
          >
            {accessLevels.map((level) => (
              <div key={level.id} className="flex items-start space-x-3">
                <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={level.id} className="flex items-center space-x-2 cursor-pointer">
                    <level.icon className={`h-4 w-4 ${level.color}`} />
                    <span className="font-medium">{level.name}</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {level.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Specific Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Specific Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-3">
                <Checkbox
                  id={permission.id}
                  checked={currentMetadata.permissions?.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                    {permission.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Expiry Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentMetadata.expiryDate ? (
                    format(currentMetadata.expiryDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentMetadata.expiryDate}
                  onSelect={(date) => updateMetadata('expiryDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Document will be automatically removed after this date
            </p>
          </div>

          {/* Password Protection */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Password Protection</Label>
              <p className="text-sm text-muted-foreground">
                Require password to access document
              </p>
            </div>
            <Switch
              checked={currentMetadata.passwordProtected}
              onCheckedChange={(checked) => updateMetadata('passwordProtected', checked)}
            />
          </div>

          {/* Download Tracking */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Download Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Log who downloads this document
              </p>
            </div>
            <Switch
              checked={currentMetadata.downloadTracking}
              onCheckedChange={(checked) => updateMetadata('downloadTracking', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
