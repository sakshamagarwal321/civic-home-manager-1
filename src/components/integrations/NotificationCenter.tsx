
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Check, 
  X, 
  Mail, 
  MessageCircle, 
  Smartphone,
  Search,
  Archive,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push' | 'inapp';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  module: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
  data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadNotifications();
    setupNotificationListeners();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchTerm, activeTab]);

  const loadNotifications = () => {
    // Mock notifications - in real implementation, load from database
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'email',
        priority: 'high',
        title: 'Payment Overdue',
        message: 'Your maintenance payment is overdue by 5 days. Please make payment immediately.',
        module: 'finances',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: false,
        actionRequired: true,
        actionUrl: '/finances'
      },
      {
        id: '2',
        type: 'push',
        priority: 'medium',
        title: 'Maintenance Scheduled',
        message: 'Elevator maintenance scheduled for tomorrow 10 AM - 2 PM',
        module: 'maintenance',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
      },
      {
        id: '3',
        type: 'inapp',
        priority: 'low',
        title: 'New Announcement',
        message: 'Monthly newsletter is now available in the documents section',
        module: 'announcements',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '4',
        type: 'sms',
        priority: 'urgent',
        title: 'Emergency Alert',
        message: 'Water supply will be interrupted from 2 PM to 4 PM today',
        module: 'announcements',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionRequired: true
      },
      {
        id: '5',
        type: 'email',
        priority: 'medium',
        title: 'Booking Confirmation',
        message: 'Your community hall booking for Dec 25 has been confirmed',
        module: 'facilities',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      }
    ];

    setNotifications(mockNotifications);
  };

  const setupNotificationListeners = () => {
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      setNotifications(prev => [event.detail, ...prev]);
    };

    window.addEventListener('notification:new', handleNewNotification as EventListener);

    return () => {
      window.removeEventListener('notification:new', handleNewNotification as EventListener);
    };
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'unread':
          filtered = filtered.filter(n => !n.read);
          break;
        case 'urgent':
          filtered = filtered.filter(n => n.priority === 'urgent' || n.priority === 'high');
          break;
        case 'action':
          filtered = filtered.filter(n => n.actionRequired);
          break;
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.module.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageCircle className="h-4 w-4" />;
      case 'push':
        return <Smartphone className="h-4 w-4" />;
      case 'inapp':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Center
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="urgent">Urgent</TabsTrigger>
                <TabsTrigger value="action">Action Required</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications found
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border rounded-lg ${
                          !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getPriorityIcon(notification.priority)}
                              {getTypeIcon(notification.type)}
                              <span className="font-medium text-sm">
                                {notification.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.module}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            {notification.actionRequired && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (notification.actionUrl) {
                                    window.location.href = notification.actionUrl;
                                  }
                                }}
                              >
                                Take Action
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => archiveNotification(notification.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
