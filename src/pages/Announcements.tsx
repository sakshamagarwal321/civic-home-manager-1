
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { QuickActionsPanel } from '@/components/announcements/QuickActionsPanel';
import { CreateAnnouncementModal } from '@/components/announcements/CreateAnnouncementModal';
import { Plus, Send, Bell, Search, Filter } from 'lucide-react';

const Announcements: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Sample announcements data
  const announcements = [
    {
      id: '1',
      title: 'Water Supply Interruption - July 24th',
      content: 'Dear Residents, Due to pipeline maintenance work, water supply will be interrupted on July 24th from 9:00 AM to 2:00 PM. Please store water in advance. Emergency contact: 9876543210',
      category: 'Emergency' as const,
      priority: 'urgent' as const,
      author: 'Rajesh Kumar',
      authorRole: 'Secretary',
      postedAt: '2 hours ago',
      views: 45,
      acknowledgments: 12,
      comments: 0,
      attachment: {
        name: 'Maintenance Notice.pdf',
        type: 'PDF'
      }
    },
    {
      id: '2',
      title: 'Annual General Meeting - February 15th',
      content: 'All flat owners are cordially invited to attend the Annual General Meeting scheduled for February 15th, 2025 at 6:00 PM in the Community Hall. Agenda includes financial review, budget approval, and committee elections.',
      category: 'General' as const,
      priority: 'medium' as const,
      author: 'Committee',
      authorRole: 'Management Committee',
      postedAt: '1 day ago',
      views: 78,
      acknowledgments: 32,
      comments: 8,
      rsvp: {
        attending: 24,
        notAttending: 8,
        pending: 16
      }
    },
    {
      id: '3',
      title: 'Elevator Maintenance Schedule',
      content: 'Elevator in Block B will undergo routine maintenance on July 25th-26th. Please use stairs or Block A elevator during this period. Inconvenience regretted.',
      category: 'Maintenance' as const,
      priority: 'high' as const,
      author: 'Maintenance Committee',
      authorRole: 'Maintenance Head',
      postedAt: '3 days ago',
      views: 52,
      acknowledgments: 28,
      comments: 0
    }
  ];

  // Category counts
  const categoryCounts = {
    all: announcements.length,
    General: announcements.filter(a => a.category === 'General').length,
    Maintenance: announcements.filter(a => a.category === 'Maintenance').length,
    Financial: announcements.filter(a => a.category === 'Financial').length,
    Events: announcements.filter(a => a.category === 'Events').length,
    Emergency: announcements.filter(a => a.category === 'Emergency').length,
  };

  const handleCreateAnnouncement = (data: any) => {
    console.log('Creating announcement:', data);
    // Handle announcement creation logic here
  };

  const handleEdit = (id: string) => {
    console.log('Edit announcement:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete announcement:', id);
  };

  const handleSendReminder = (id: string) => {
    console.log('Send reminder for:', id);
  };

  const handleMarkCompleted = (id: string) => {
    console.log('Mark as completed:', id);
  };

  const handleViewResponses = (id: string) => {
    console.log('View responses for:', id);
  };

  const handleViewDrafts = () => {
    console.log('View drafts');
  };

  const handleViewScheduled = () => {
    console.log('View scheduled posts');
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || announcement.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">
              Communicate with residents and manage society notifications
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAlert(true);
                setCreateModalOpen(true);
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
            <Button 
              onClick={() => {
                setIsAlert(false);
                setCreateModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">
                  All ({categoryCounts.all})
                </TabsTrigger>
                <TabsTrigger value="General">
                  General ({categoryCounts.General})
                </TabsTrigger>
                <TabsTrigger value="Maintenance">
                  Maintenance ({categoryCounts.Maintenance})
                </TabsTrigger>
                <TabsTrigger value="Financial">
                  Financial ({categoryCounts.Financial})
                </TabsTrigger>
                <TabsTrigger value="Events">
                  Events ({categoryCounts.Events})
                </TabsTrigger>
                <TabsTrigger value="Emergency">
                  Emergency ({categoryCounts.Emergency})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredAnnouncements.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No announcements found.</p>
                    </div>
                  ) : (
                    filteredAnnouncements.map((announcement) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSendReminder={handleSendReminder}
                        onMarkCompleted={handleMarkCompleted}
                        onViewResponses={handleViewResponses}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuickActionsPanel
              onViewDrafts={handleViewDrafts}
              onViewScheduled={handleViewScheduled}
            />
          </div>
        </div>
      </div>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateAnnouncement}
        isAlert={isAlert}
      />
    </AppShell>
  );
};

export default Announcements;
