
import React, { useState } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Building2, 
  Calendar,
  Shield,
  Home,
  Activity,
  CreditCard,
  Clock,
  Save,
  Undo2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  profilePhotoUrl?: string;
  role: string;
  societyName: string;
  membershipSince: string;
  committeePosition: string;
  committeeResponsibilities: string[];
  ownedFlats: { number: string; block: string; type: string; area: string }[];
  tenantFlats: { number: string; block: string; type: string; area: string }[];
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    emergencyContact: '+91 9876543211',
    role: 'Secretary',
    societyName: 'Greenfield Residency',
    membershipSince: 'March 2020',
    committeePosition: 'Secretary (2023-2025 term)',
    committeeResponsibilities: [
      'Managing society funds and financial oversight',
      'Coordinating with committee members',
      'Organizing society events and meetings',
      'Handling resident grievances and complaints'
    ],
    ownedFlats: [
      { number: 'A-101', block: 'A', type: '2BHK', area: '1200 sqft' }
    ],
    tenantFlats: []
  });

  const [originalData, setOriginalData] = useState(profileData);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    inApp: true
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOriginalData(profileData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePhotoUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const mockRecentPayments = [
    { date: '2025-01-01', amount: 3500, status: 'Paid', method: 'UPI' },
    { date: '2024-12-01', amount: 3500, status: 'Paid', method: 'Bank Transfer' },
    { date: '2024-11-01', amount: 3500, status: 'Paid', method: 'Cash' },
    { date: '2024-10-01', amount: 3500, status: 'Paid', method: 'UPI' },
    { date: '2024-09-01', amount: 3500, status: 'Paid', method: 'Cheque' }
  ];

  const mockCommitteeActions = [
    { action: 'Approved budget proposal for FY 2024-25', date: '2025-01-10' },
    { action: 'Organized New Year celebration event', date: '2024-12-28' },
    { action: 'Approved maintenance contractor renewal', date: '2024-12-15' }
  ];

  const mockLoginHistory = [
    { date: '2025-01-15 10:30 AM', device: 'Web Browser', location: 'Bangalore' },
    { date: '2025-01-14 08:15 AM', device: 'Mobile App', location: 'Bangalore' },
    { date: '2025-01-13 02:45 PM', device: 'Web Browser', location: 'Bangalore' }
  ];

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
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>
          <div className="flex space-x-2">
            {isEditing && (
              <Button variant="outline" onClick={handleCancel}>
                <Undo2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </>
              ) : (
                'Edit Profile'
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="society">Society Info</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Profile Photo Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    {profileData.profilePhotoUrl ? (
                      <img src={profileData.profilePhotoUrl} alt="Profile" className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <div>
                      <Label htmlFor="photo-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Camera className="mr-2 h-4 w-4" />
                            Change Photo
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.fullName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.phone}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profileData.emergencyContact}</p>
                    )}
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{profileData.role}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="society" className="space-y-6">
            {/* Society Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Society Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Society Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{profileData.societyName}</p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-sm text-muted-foreground mt-1">{profileData.membershipSince}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Committee Position</Label>
                    <p className="text-sm text-muted-foreground mt-1">{profileData.committeePosition}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Committee Responsibilities</Label>
                  <ul className="mt-2 space-y-1">
                    {profileData.committeeResponsibilities.map((responsibility, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Flat Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Flat Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Owned Flats</Label>
                  <div className="mt-2 space-y-2">
                    {profileData.ownedFlats.map((flat, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{flat.number}</p>
                            <p className="text-sm text-muted-foreground">
                              Block {flat.block} • {flat.type} • {flat.area}
                            </p>
                          </div>
                          <Badge variant="outline">Owner</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {profileData.tenantFlats.length > 0 && (
                  <div>
                    <Label>Tenant Flats</Label>
                    <div className="mt-2 space-y-2">
                      {profileData.tenantFlats.map((flat, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{flat.number}</p>
                              <p className="text-sm text-muted-foreground">
                                Block {flat.block} • {flat.type} • {flat.area}
                              </p>
                            </div>
                            <Badge variant="secondary">Tenant</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Change Password</Label>
                  <div className="mt-2">
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.sms}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                  </div>
                  <Switch
                    checked={notificationSettings.inApp}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, inApp: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentPayments.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{payment.date} • {payment.method}</p>
                      </div>
                      <Badge variant="outline">{payment.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Committee Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Committee Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCommitteeActions.map((action, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">{action.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Login History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLoginHistory.map((login, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{login.device}</p>
                        <p className="text-xs text-muted-foreground">{login.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{login.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EnhancedAppShell>
  );
};

export default Profile;
