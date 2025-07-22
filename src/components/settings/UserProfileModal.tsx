
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Shield, 
  Activity, 
  History, 
  Settings, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  emergency_contact?: string;
  flat_number?: string;
  block?: string;
  role: string;
  account_status: string;
  profile_photo_url?: string;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  action: string;
  module?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

interface UserSession {
  id: string;
  session_token: string;
  ip_address?: string;
  device_info?: string;
  last_active: string;
  created_at: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Fetch user profile
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId
  });

  // Fetch user activity
  const { data: activities = [] } = useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as UserActivity[];
    },
    enabled: !!userId
  });

  // Fetch user sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['user-sessions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_active', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as UserSession[];
    },
    enabled: !!userId
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!userId || !formData) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', userId);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-red-600';
      case 'committee_member': return 'text-blue-600';
      case 'treasurer': return 'text-green-600';
      case 'resident_owner': return 'text-purple-600';
      case 'resident_tenant': return 'text-orange-600';
      case 'staff_member': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!userId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            User Profile Management
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading user profile...</div>
          </div>
        ) : user ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Personal Information</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.profile_photo_url} />
                      <AvatarFallback className="text-lg">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={formData.first_name || ''}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={formData.last_name || ''}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency_contact">Emergency Contact</Label>
                          <Input
                            id="emergency_contact"
                            value={formData.emergency_contact || ''}
                            onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="flat_number">Flat Number</Label>
                          <Input
                            id="flat_number"
                            value={formData.flat_number || ''}
                            onChange={(e) => handleInputChange('flat_number', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="block">Block</Label>
                          <Input
                            id="block"
                            value={formData.block || ''}
                            onChange={(e) => handleInputChange('block', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={formData.role}
                            onValueChange={(value) => handleInputChange('role', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                              <SelectItem value="committee_member">Committee Member</SelectItem>
                              <SelectItem value="treasurer">Treasurer</SelectItem>
                              <SelectItem value="resident_owner">Resident Owner</SelectItem>
                              <SelectItem value="resident_tenant">Resident Tenant</SelectItem>
                              <SelectItem value="staff_member">Staff Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account_status">Account Status</Label>
                          <Select
                            value={formData.account_status}
                            onValueChange={(value) => handleInputChange('account_status', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending_approval">Pending Approval</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_owner"
                          checked={formData.is_owner || false}
                          onCheckedChange={(checked) => handleInputChange('is_owner', checked)}
                          disabled={!isEditing}
                        />
                        <Label htmlFor="is_owner">Property Owner</Label>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-2">
                          <Button onClick={handleSave}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Shield className={`h-5 w-5 ${getRoleColor(user.role)}`} />
                      <div>
                        <div className="font-medium">{formatRole(user.role)}</div>
                        <div className="text-sm text-muted-foreground">User Role</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      {user.account_status === 'active' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <div className="font-medium">{formatStatus(user.account_status)}</div>
                        <div className="text-sm text-muted-foreground">Account Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Member Since</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Role-based Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Permissions are automatically assigned based on the user's role. 
                      Change the user's role to modify their access permissions.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium">Current Role: {formatRole(user.role)}</div>
                    <div className="text-sm text-muted-foreground">
                      This role grants the following permissions across different modules of the system.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity recorded yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Module</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.action}</TableCell>
                            <TableCell>{activity.module || 'System'}</TableCell>
                            <TableCell>
                              {new Date(activity.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>{activity.ip_address || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active sessions
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{session.device_info || 'Unknown Device'}</TableCell>
                            <TableCell>{session.ip_address || 'Unknown'}</TableCell>
                            <TableCell>
                              {new Date(session.last_active).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(session.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Terminate
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
