
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Upload, Download, Star, Clock, FolderPlus } from 'lucide-react';
import { DocumentsSidebar } from '@/components/documents/DocumentsSidebar';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentStatsBar } from '@/components/documents/DocumentStatsBar';
import { DocumentQuickActions } from '@/components/documents/DocumentQuickActions';
import { DocumentSearchBar } from '@/components/documents/DocumentSearchBar';
import { AdvancedSearchSidebar } from '@/components/documents/AdvancedSearchSidebar';
import { SmartCollections } from '@/components/documents/SmartCollections';
import { DocumentAnalytics } from '@/components/documents/DocumentAnalytics';
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documents: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [recentlyAccessed, setRecentlyAccessed] = useState<string[]>([]);
  const [favoriteDocuments, setFavoriteDocuments] = useState<string[]>([]);

  // Advanced search filters
  const [searchFilters, setSearchFilters] = useState({
    dateRange: { start: null, end: null },
    fileTypes: [],
    categories: [],
    uploadedBy: [],
    accessLevel: [],
    fileSizeRange: [0, 100] as [number, number],
    downloadCountFilter: '',
  });

  // Search suggestions
  const searchSuggestions = [
    'AGM Minutes',
    'Budget Report',
    'Society Bylaws',
    'Maintenance Schedule',
    'Insurance Policy',
    'Audit Report',
    'Registration Certificate',
    'Meeting Minutes',
    'Financial Records',
    'Legal Documents',
  ];

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
    // Add to recently accessed
    setRecentlyAccessed(prev => [id, ...prev.filter(docId => docId !== id)].slice(0, 10));
  };

  const handleDownload = (id: string) => {
    console.log('Download document:', id);
    // Add to recently accessed
    setRecentlyAccessed(prev => [id, ...prev.filter(docId => docId !== id)].slice(0, 10));
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

  const handleToggleFavorite = (id: string) => {
    setFavoriteDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const handleUploadComplete = (files: any[]) => {
    console.log('Upload completed:', files);
    // Handle successful upload
  };

  const handleViewDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
      handleView(id);
    }
  };

  const handleSmartCollectionClick = (collection: any) => {
    console.log('Smart collection clicked:', collection);
    // Filter documents based on collection
    setActiveTab('documents');
  };

  const handleClearFilters = () => {
    setSearchFilters({
      dateRange: { start: null, end: null },
      fileTypes: [],
      categories: [],
      uploadedBy: [],
      accessLevel: [],
      fileSizeRange: [0, 100],
      downloadCountFilter: '',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) count++;
    if (searchFilters.fileTypes.length > 0) count++;
    if (searchFilters.categories.length > 0) count++;
    if (searchFilters.uploadedBy.length > 0) count++;
    if (searchFilters.accessLevel.length > 0) count++;
    if (searchFilters.fileSizeRange[0] > 0 || searchFilters.fileSizeRange[1] < 100) count++;
    if (searchFilters.downloadCountFilter) count++;
    return count;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply additional filters here based on searchFilters
    return matchesSearch;
  });

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
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          <DocumentStatsBar />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="collections">Smart Collections</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="flex-1 mt-6">
              <div className="flex space-x-6 h-full">
                <div className="flex-1">
                  <DocumentSearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onAdvancedSearchToggle={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                    onAnalyticsToggle={() => setActiveTab('analytics')}
                    isAdvancedSearchOpen={isAdvancedSearchOpen}
                    activeFiltersCount={getActiveFiltersCount()}
                    searchSuggestions={searchSuggestions}
                  />
                  
                  {/* Recently Accessed & Favorites */}
                  {(recentlyAccessed.length > 0 || favoriteDocuments.length > 0) && (
                    <div className="mb-6 space-y-4">
                      {recentlyAccessed.length > 0 && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">Recently Accessed</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentlyAccessed.slice(0, 5).map(docId => {
                              const doc = documents.find(d => d.id === docId);
                              return doc ? (
                                <Badge
                                  key={docId}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => handleViewDocument(docId)}
                                >
                                  {doc.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      {favoriteDocuments.length > 0 && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 mr-2 text-yellow-500" />
                            <span className="text-sm font-medium">Favorites</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {favoriteDocuments.slice(0, 5).map(docId => {
                              const doc = documents.find(d => d.id === docId);
                              return doc ? (
                                <Badge
                                  key={docId}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => handleViewDocument(docId)}
                                >
                                  <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                                  {doc.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
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
                
                {isAdvancedSearchOpen && (
                  <AdvancedSearchSidebar
                    isOpen={isAdvancedSearchOpen}
                    onClose={() => setIsAdvancedSearchOpen(false)}
                    filters={searchFilters}
                    onFiltersChange={setSearchFilters}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              <SmartCollections onCollectionClick={handleSmartCollectionClick} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <DocumentAnalytics />
            </TabsContent>
          </Tabs>
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
