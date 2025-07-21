
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Hash, TrendingUp, Edit, Clock } from 'lucide-react';

interface QuickActionsPanelProps {
  onViewDrafts: () => void;
  onViewScheduled: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onViewDrafts,
  onViewScheduled
}) => {
  const popularTags = [
    { tag: '#maintenance', count: 15 },
    { tag: '#meeting', count: 12 },
    { tag: '#water', count: 8 },
    { tag: '#parking', count: 6 },
    { tag: '#electricity', count: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onViewDrafts}
          >
            <FileText className="h-4 w-4 mr-2" />
            Draft Messages
            <Badge variant="secondary" className="ml-auto">3</Badge>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onViewScheduled}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Posts
            <Badge variant="secondary" className="ml-auto">2</Badge>
          </Button>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((item) => (
              <Badge 
                key={item.tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
              >
                {item.tag} ({item.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            This Month Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Read Rate</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Announcements</span>
            <span className="font-medium">51</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Most Engaged</span>
            <span className="font-medium">Emergency</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="font-medium">2.4 hours</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
