
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Smartphone, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  global: {
    systemNotifications: boolean;
    securityAlerts: boolean;
    financialNotifications: boolean;
    communityUpdates: boolean;
    emergencyAlerts: boolean;
  };
  email: {
    announcementDelivery: string;
    paymentReminders: string;
    facilityBookings: boolean;
    maintenanceUpdates: boolean;
    committeeComms: boolean;
  };
  sms: {
    emergencyOnly: boolean;
    paymentDue: boolean;
    facilityConfirmations: boolean;
    securityNotifications: boolean;
    dailyLimit: number;
  };
  inApp: {
    activityFeed: boolean;
    desktopNotifications: boolean;
    pushNotifications: boolean;
    notificationHistory: boolean;
  };
}

export const NotificationPreferencesSection: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    global: {
      systemNotifications: true,
      securityAlerts: true,
      financialNotifications: true,
      communityUpdates: true,
      emergencyAlerts: true,
    },
    email: {
      announcementDelivery: 'immediate',
      paymentReminders: '3-days',
      facilityBookings: true,
      maintenanceUpdates: true,
      committeeComms: true,
    },
    sms: {
      emergencyOnly: true,
      paymentDue: true,
      facilityConfirmations: false,
      securityNotifications: true,
      dailyLimit: 5,
    },
    inApp: {
      activityFeed: true,
      desktopNotifications: true,
      pushNotifications: true,
      notificationHistory: true,
    },
  });

  const handleGlobalSettingChange = (key: keyof NotificationSettings['global'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }));
  };

  const handleEmailSettingChange = (key: keyof NotificationSettings['email'], value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const handleSmsSettingChange = (key: keyof NotificationSettings['sms'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: value }
    }));
  };

  const handleInAppSettingChange = (key: keyof NotificationSettings['inApp'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      inApp: { ...prev.inApp, [key]: value }
    }));
  };

  const handleSaveSettings = () => {
    // Here you would save to Supabase
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Configure how and when you receive notifications for different activities.
        </p>
      </div>

      {/* Global Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">System Notifications</Label>
              <p className="text-sm text-muted-foreground">Maintenance windows, updates, backups</p>
            </div>
            <Switch
              checked={settings.global.systemNotifications}
              onCheckedChange={(value) => handleGlobalSettingChange('systemNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Failed logins, unusual access patterns</p>
            </div>
            <Switch
              checked={settings.global.securityAlerts}
              onCheckedChange={(value) => handleGlobalSettingChange('securityAlerts', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Financial Notifications</Label>
              <p className="text-sm text-muted-foreground">Payment due dates, expense approvals, budget alerts</p>
            </div>
            <Switch
              checked={settings.global.financialNotifications}
              onCheckedChange={(value) => handleGlobalSettingChange('financialNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Community Updates</Label>
              <p className="text-sm text-muted-foreground">Announcements, meeting schedules, voting deadlines</p>
            </div>
            <Switch
              checked={settings.global.communityUpdates}
              onCheckedChange={(value) => handleGlobalSettingChange('communityUpdates', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Emergency Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Critical society issues, safety concerns</p>
            </div>
            <Switch
              checked={settings.global.emergencyAlerts}
              onCheckedChange={(value) => handleGlobalSettingChange('emergencyAlerts', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Announcement Delivery</Label>
              <p className="text-sm text-muted-foreground">How often you receive announcement emails</p>
            </div>
            <Select value={settings.email.announcementDelivery} onValueChange={(value) => handleEmailSettingChange('announcementDelivery', value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">When to send payment due reminders</p>
            </div>
            <Select value={settings.email.paymentReminders} onValueChange={(value) => handleEmailSettingChange('paymentReminders', value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">7 days before</SelectItem>
                <SelectItem value="3-days">3 days before</SelectItem>
                <SelectItem value="due-date">On due date</SelectItem>
                <SelectItem value="after-due">After due date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Facility Bookings</Label>
              <p className="text-sm text-muted-foreground">Confirmations, reminders, cancellations</p>
            </div>
            <Switch
              checked={settings.email.facilityBookings}
              onCheckedChange={(value) => handleEmailSettingChange('facilityBookings', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Maintenance Updates</Label>
              <p className="text-sm text-muted-foreground">Request status changes, completion notifications</p>
            </div>
            <Switch
              checked={settings.email.maintenanceUpdates}
              onCheckedChange={(value) => handleEmailSettingChange('maintenanceUpdates', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Committee Communications</Label>
              <p className="text-sm text-muted-foreground">Meeting invitations, document updates</p>
            </div>
            <Switch
              checked={settings.email.committeeComms}
              onCheckedChange={(value) => handleEmailSettingChange('committeeComms', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Emergency Alerts Only</Label>
              <p className="text-sm text-muted-foreground">Critical society and safety issues</p>
            </div>
            <Switch
              checked={settings.sms.emergencyOnly}
              onCheckedChange={(value) => handleSmsSettingChange('emergencyOnly', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Payment Due Alerts</Label>
              <p className="text-sm text-muted-foreground">Overdue payment alerts with amount details</p>
            </div>
            <Switch
              checked={settings.sms.paymentDue}
              onCheckedChange={(value) => handleSmsSettingChange('paymentDue', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Facility Confirmations</Label>
              <p className="text-sm text-muted-foreground">Booking confirmations and reminders</p>
            </div>
            <Switch
              checked={settings.sms.facilityConfirmations}
              onCheckedChange={(value) => handleSmsSettingChange('facilityConfirmations', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Security Notifications</Label>
              <p className="text-sm text-muted-foreground">Visitor arrivals, unusual access attempts</p>
            </div>
            <Switch
              checked={settings.sms.securityNotifications}
              onCheckedChange={(value) => handleSmsSettingChange('securityNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Daily SMS Limit</Label>
              <p className="text-sm text-muted-foreground">Maximum SMS per day to prevent spam</p>
            </div>
            <Badge variant="secondary">{settings.sms.dailyLimit} SMS/day</Badge>
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Real-time Activity Feed</Label>
              <p className="text-sm text-muted-foreground">Live updates of all society activities</p>
            </div>
            <Switch
              checked={settings.inApp.activityFeed}
              onCheckedChange={(value) => handleInAppSettingChange('activityFeed', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for urgent items</p>
            </div>
            <Switch
              checked={settings.inApp.desktopNotifications}
              onCheckedChange={(value) => handleInAppSettingChange('desktopNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Mobile Push Notifications</Label>
              <p className="text-sm text-muted-foreground">App-based alerts with custom sounds</p>
            </div>
            <Switch
              checked={settings.inApp.pushNotifications}
              onCheckedChange={(value) => handleInAppSettingChange('pushNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Notification History</Label>
              <p className="text-sm text-muted-foreground">Archive of all received notifications</p>
            </div>
            <Switch
              checked={settings.inApp.notificationHistory}
              onCheckedChange={(value) => handleInAppSettingChange('notificationHistory', value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings}>Save Preferences</Button>
      </div>
    </div>
  );
};
