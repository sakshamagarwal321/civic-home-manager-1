
import React, { useState } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Palette, 
  Globe, 
  Layout, 
  Shield, 
  Eye,
  Save,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const UserSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      maintenance: true,
      announcements: true,
      events: false,
      reminders: true
    },
    language: 'en',
    dashboard: {
      showMetrics: true,
      showActivity: true,
      showPayments: true,
      compactView: false
    },
    privacy: {
      profileVisible: true,
      contactVisible: false,
      shareData: false
    },
    security: {
      sessionTimeout: '30',
      loginNotifications: true
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const handleDashboardChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      dashboard: { ...prev.dashboard, [key]: value }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Settings</h1>
            <p className="text-muted-foreground">Customize your experience and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Maintenance Updates</Label>
                    <Switch
                      checked={settings.notifications.maintenance}
                      onCheckedChange={(checked) => handleNotificationChange('maintenance', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Society Announcements</Label>
                    <Switch
                      checked={settings.notifications.announcements}
                      onCheckedChange={(checked) => handleNotificationChange('announcements', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Event Invitations</Label>
                    <Switch
                      checked={settings.notifications.events}
                      onCheckedChange={(checked) => handleNotificationChange('events', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Payment Reminders</Label>
                    <Switch
                      checked={settings.notifications.reminders}
                      onCheckedChange={(checked) => handleNotificationChange('reminders', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme and Language */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Theme Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Choose your preferred theme</Label>
                  <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Language Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="language">Select Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                Dashboard Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Widget Preferences</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Metrics Widget</Label>
                    <Switch
                      checked={settings.dashboard.showMetrics}
                      onCheckedChange={(checked) => handleDashboardChange('showMetrics', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Activity Feed</Label>
                    <Switch
                      checked={settings.dashboard.showActivity}
                      onCheckedChange={(checked) => handleDashboardChange('showActivity', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Payment Status</Label>
                    <Switch
                      checked={settings.dashboard.showPayments}
                      onCheckedChange={(checked) => handleDashboardChange('showPayments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Compact View</Label>
                    <Switch
                      checked={settings.dashboard.compactView}
                      onCheckedChange={(checked) => handleDashboardChange('compactView', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other residents</p>
                  </div>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Contact Information Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                  </div>
                  <Switch
                    checked={settings.privacy.contactVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('contactVisible', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share anonymous usage data for improvements</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareData}
                    onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <p className="text-sm text-muted-foreground mb-2">Automatically log out after inactivity</p>
                <Select value={settings.security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                </div>
                <Switch
                  checked={settings.security.loginNotifications}
                  onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline">Change Password</Button>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EnhancedAppShell>
  );
};

export default UserSettings;
