import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { DocumentsSidebar } from '@/components/documents/DocumentsSidebar';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentStatsBar } from '@/components/documents/DocumentStatsBar';
import { DocumentQuickActions } from '@/components/documents/DocumentQuickActions';
import { DocumentSearchBar } from '@/components/documents/DocumentSearchBar';
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal';
import { DocumentViewer } from '@/components/documents/DocumentViewer';

const Documents: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Sample documents data
  const documents = [
    {
      id: '1',
      title: 'AGM Minutes - February 2024',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '3 months ago',
      accessLevel: 'All Members' as const,
      uploadedBy: 'Rajesh Kumar (Secretary)',
      downloadCount: 45,
      isImportant: false,
      status: undefined,
    },
    {
      id: '2',
      title: 'Society Registration Certificate',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2 years ago',
      accessLevel: 'Public' as const,
      uploadedBy: 'System Admin',
      downloadCount: 127,
      isImportant: true,
      status: undefined,
    },
    {
      id: '3',
      title: 'Monthly Budget - January 2025',
      type: 'XLSX',
      size: '856 KB',
      uploadDate: '2 weeks ago',
      accessLevel: 'Committee Only' as const,
      uploadedBy: 'Treasurer',
      downloadCount: 12,
      isImportant: false,
      status: 'Current' as const,
    },
    {
      id: '4',
      title: 'Insurance Policy Document',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '1 month ago',
      accessLevel: 'All Members' as const,
      uploadedBy: 'Secretary',
      downloadCount: 23,
      isImportant: true,
      status: 'Active' as const,
    },
    {
      id: '5',
      title: 'Maintenance Schedule Q1 2025',
      type: 'XLSX',
      size: '1.8 MB',
      uploadDate: '1 week ago',
      accessLevel: 'All Members' as const,
      uploadedBy: 'Maintenance Committee',
      downloadCount: 34,
      isImportant: false,
      status: 'Active' as const,
    },
    {
      id: '6',
      title: 'Audit Report 2024',
      type: 'PDF',
      size: '4.1 MB',
      uploadDate: '2 months ago',
      accessLevel: 'Committee Only' as const,
      uploadedBy: 'Auditor',
      downloadCount: 18,
      isImportant: true,
      status: undefined,
    },
  ];

  const handleView = (id: string) => {
    console.log('View document:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Download document:', id);
  };

  const handleShare = (id: string) => {
    console.log('Share document:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit document:', id);
  };

  const handleMove = (id: string) => {
    console.log('Move document:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete document:', id);
  };

  const handleUploadComplete = (files: any[]) => {
    console.log('Upload completed:', files);
    // Handle successful upload
  };

  const handleViewDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex h-full">
        <DocumentsSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Document Repository</h1>
              <p className="text-muted-foreground">
                Store and manage society documents, meeting minutes, and legal files
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          <DocumentStatsBar />

          <div className="flex-1 flex space-x-6">
            <div className="flex-1">
              <DocumentSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              
              <DocumentGrid
                documents={filteredDocuments}
                onView={handleViewDocument}
                onDownload={handleDownload}
                onShare={handleShare}
                onEdit={handleEdit}
                onMove={handleMove}
                onDelete={handleDelete}
              />
            </div>
            
            <DocumentQuickActions />
          </div>
        </div>
      </div>

      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />

      {selectedDocument && (
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}
    </AppShell>
  );
};

export default Documents;
