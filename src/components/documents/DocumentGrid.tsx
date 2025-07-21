
import React from 'react';
import { DocumentCard } from './DocumentCard';

interface Document {
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
}

interface DocumentGridProps {
  documents: Document[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  onEdit: (id: string) => void;
  onMove: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onView,
  onDownload,
  onShare,
  onEdit,
  onMove,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onView={onView}
          onDownload={onDownload}
          onShare={onShare}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
