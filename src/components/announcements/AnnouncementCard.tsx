
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Edit, 
  Trash2, 
  Bell, 
  Paperclip,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Maintenance' | 'Financial' | 'Events' | 'Emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  authorRole: string;
  postedAt: string;
  views: number;
  acknowledgments: number;
  comments: number;
  rsvp?: {
    attending: number;
    notAttending: number;
    pending: number;
  };
  attachment?: {
    name: string;
    type: string;
  };
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSendReminder: (id: string) => void;
  onMarkCompleted?: (id: string) => void;
  onViewResponses?: (id: string) => void;
}

const priorityConfig = {
  low: { badge: 'bg-gray-100 text-gray-800', indicator: 'bg-gray-400' },
  medium: { badge: 'bg-blue-100 text-blue-800', indicator: 'bg-blue-500' },
  high: { badge: 'bg-orange-100 text-orange-800', indicator: 'bg-orange-500' },
  urgent: { badge: 'bg-red-100 text-red-800', indicator: 'bg-red-500' },
};

const categoryConfig = {
  General: { color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
  Maintenance: { color: 'bg-orange-500', textColor: 'text-orange-800', bgColor: 'bg-orange-100' },
  Financial: { color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' },
  Events: { color: 'bg-purple-500', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
  Emergency: { color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100' },
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  onSendReminder,
  onMarkCompleted,
  onViewResponses
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityStyle = priorityConfig[announcement.priority];
  const categoryStyle = categoryConfig[announcement.category];

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-1 h-12 rounded-full ${categoryStyle.color}`} />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`${categoryStyle.bgColor} ${categoryStyle.textColor} text-xs`}>
                  {announcement.category}
                </Badge>
                {announcement.priority === 'urgent' && (
                  <Badge className={priorityStyle.badge}>
                    <Bell className="h-3 w-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {announcement.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {announcement.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {announcement.postedAt} by {announcement.author}
                </span>
                <span className="text-xs">({announcement.authorRole})</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(announcement.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendReminder(announcement.id)}>
                <Bell className="h-4 w-4 mr-2" />
                Send Reminder
              </DropdownMenuItem>
              {announcement.category === 'Maintenance' && onMarkCompleted && (
                <DropdownMenuItem onClick={() => onMarkCompleted(announcement.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              {announcement.rsvp && onViewResponses && (
                <DropdownMenuItem onClick={() => onViewResponses(announcement.id)}>
                  <Users className="h-4 w-4 mr-2" />
                  View Responses
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(announcement.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-foreground">
            <p className={isExpanded ? '' : 'line-clamp-3'}>
              {announcement.content}
            </p>
            {announcement.content.length > 150 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-0 h-auto font-normal text-primary"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>

          {announcement.attachment && (
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{announcement.attachment.name}</span>
              <Badge variant="outline" className="ml-auto">
                {announcement.attachment.type}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{announcement.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>{announcement.acknowledgments} acknowledged</span>
              </div>
              {announcement.comments > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{announcement.comments} comments</span>
                </div>
              )}
            </div>

            {announcement.rsvp && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <UserCheck className="h-4 w-4" />
                  <span>{announcement.rsvp.attending}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600">
                  <UserX className="h-4 w-4" />
                  <span>{announcement.rsvp.notAttending}</span>
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>{announcement.rsvp.pending}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
