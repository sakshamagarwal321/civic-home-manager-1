
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Cloud,
  FileText,
  Image,
  FileSpreadsheet
} from 'lucide-react';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileSelectionStepProps {
  files: UploadFile[];
  onFilesChange: (files: UploadFile[]) => void;
}

export const FileSelectionStep: React.FC<FileSelectionStepProps> = ({
  files,
  onFilesChange,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported';
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => {
      const error = validateFile(file);
      return {
        file,
        id: Math.random().toString(36).substring(7),
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
      };
    });

    onFilesChange([...files, ...newFiles]);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
  });

  const removeFile = (id: string) => {
    onFilesChange(files.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Support for PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum file size: 10MB per file
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(uploadFile.file)}
                    <div>
                      <p className="font-medium">{uploadFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadFile.status === 'error' ? (
                      <Badge variant="destructive" className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    ) : uploadFile.status === 'completed' ? (
                      <Badge variant="default" className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {files.some(file => file.error) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-destructive">
              Upload Errors
            </h3>
            <div className="space-y-2">
              {files
                .filter(file => file.error)
                .map((file) => (
                  <div key={file.id} className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">
                      <strong>{file.file.name}:</strong> {file.error}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
