
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Share2, User, AlertCircle } from 'lucide-react';

export const DocumentQuickActions: React.FC = () => {
  const recentDocuments = [
    { name: 'Budget Proposal 2025', time: '2 hours ago', type: 'PDF' },
    { name: 'Maintenance Schedule', time: '1 day ago', type: 'XLSX' },
    { name: 'Security Guidelines', time: '2 days ago', type: 'PDF' },
    { name: 'Water Bill Analysis', time: '3 days ago', type: 'XLSX' },
    { name: 'Committee Meeting Minutes', time: '5 days ago', type: 'PDF' },
  ];

  const popularDocuments = [
    { name: 'AGM Minutes Feb 2024', downloads: 45 },
    { name: 'Society Registration', downloads: 127 },
    { name: 'Bylaws Amendment 2023', downloads: 38 },
    { name: 'Annual Budget 2024', downloads: 32 },
    { name: 'Maintenance Contract', downloads: 28 },
  ];

  const sharedDocuments = [
    { name: 'Audit Report Draft', sharedBy: 'Treasurer', time: '1 hour ago' },
    { name: 'Insurance Policy Review', sharedBy: 'Secretary', time: '3 hours ago' },
    { name: 'Vendor Proposals', sharedBy: 'Maintenance Head', time: '1 day ago' },
  ];

  const myUploads = [
    { name: 'Monthly Expense Report', date: 'Jan 15, 2025', status: 'Approved' },
    { name: 'Facility Booking Rules', date: 'Jan 12, 2025', status: 'Published' },
    { name: 'Safety Protocol Update', date: 'Jan 10, 2025', status: 'Draft' },
  ];

  const pendingApproval = [
    { name: 'New Parking Rules', submittedBy: 'Parking Committee', time: '2 days ago' },
    { name: 'Elevator Maintenance Plan', submittedBy: 'Maintenance Team', time: '1 week ago' },
    { name: 'Security Camera Policy', submittedBy: 'Security Committee', time: '3 days ago' },
  ];

  return (
    <div className="w-80 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recently Uploaded
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.time}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {doc.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Frequently Accessed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {doc.downloads}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Shared with Me
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sharedDocuments.map((doc, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{doc.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                by {doc.sharedBy} • {doc.time}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <User className="h-4 w-4 mr-2" />
            My Uploads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myUploads.map((doc, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <Badge
                  variant={doc.status === 'Approved' ? 'default' : doc.status === 'Published' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {doc.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{doc.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Pending Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingApproval.map((doc, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <Button variant="outline" size="sm" className="text-xs h-6">
                  Review
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                by {doc.submittedBy} • {doc.time}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
