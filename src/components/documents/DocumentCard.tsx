
import React, { useState } from 'react';
import { FileText, Download, Eye, Share2, Edit, Move, Trash2, MoreHorizontal, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
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
    thumbnail?: string;
  };
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  onEdit: (id: string) => void;
  onMove: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onShare,
  onEdit,
  onMove,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-12 w-12 text-green-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-12 w-12 text-blue-500" />;
      default:
        return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

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

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    return (
      <Badge variant={status === 'Current' || status === 'Active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg",
        isHovered && "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.type)}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{document.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {document.type.toUpperCase()} • {document.size} • {document.uploadDate}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {document.isImportant && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(document.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(document.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(document.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(document.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(document.id)}>
                  <Move className="h-4 w-4 mr-2" />
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          {getAccessLevelBadge(document.accessLevel)}
          {getStatusBadge(document.status)}
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Uploaded by: {document.uploadedBy}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {document.downloadCount} downloads
          </span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(document.id)}
              className="h-8 px-2"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(document.id)}
              className="h-8 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
