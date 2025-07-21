
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Printer, 
  MessageSquare,
  Eye,
  X,
  FileText,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    title: string;
    type: string;
    size: string;
    uploadDate: string;
    accessLevel: 'All Members' | 'Committee Only' | 'Public';
    uploadedBy: string;
    downloadCount: number;
    isImportant?: boolean;
    status?: 'Current' | 'Active' | 'Archive';
    description?: string;
    tags?: string[];
    version?: string;
  };
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onShare,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'All Members':
        return <Badge variant="default" className="bg-green-100 text-green-700">All Members</Badge>;
      case 'Committee Only':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Committee Only</Badge>;
      case 'Public':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Public</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{document.title}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Document Info Sidebar */}
          <div className="w-80 border-r p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold mb-2">Document Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{document.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{document.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span>{document.uploadDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Access:</span>
                    {getAccessLevelBadge(document.accessLevel)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span>{document.downloadCount}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Uploaded By */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Uploaded By
                </h3>
                <p className="text-sm">{document.uploadedBy}</p>
              </div>

              {/* Description */}
              {document.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                  </div>
                </>
              )}

              {/* Tags */}
              {document.tags && document.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Version */}
              {document.version && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Version</h3>
                    <p className="text-sm">{document.version}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <Separator />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(document.id)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(document.id)}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </Button>
              </div>
            </div>
          </div>

          {/* Document Viewer */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-mono">{zoom}%</span>
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Print className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-auto bg-gray-50 p-4">
              <div 
                className="bg-white shadow-lg mx-auto"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center top',
                  minHeight: '800px',
                  width: '595px', // A4 width
                }}
              >
                {/* Document Preview Placeholder */}
                <div className="p-8 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {document.type.toUpperCase()} Document Preview
                  </p>
                  <div className="text-left space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          {showComments && (
            <div className="w-80 border-l p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold">Comments & Annotations</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">John Doe</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm">This document needs to be updated with the latest regulations.</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Jane Smith</span>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm">Approved for distribution to all members.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
