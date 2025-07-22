
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Key,
  UserX,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { UserProfileModal } from './UserProfileModal';

type UserRole = 'super_admin' | 'committee_member' | 'treasurer' | 'resident_owner' | 'resident_tenant' | 'staff_member';
type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending_approval';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  flat_number?: string;
  block?: string;
  role: UserRole;
  account_status: AccountStatus;
  profile_photo_url?: string;
  last_active?: string;
  created_at: string;
}

interface UserStats {
  total: number;
  owners: number;
  tenants: number;
  committee: number;
  staff: number;
  activeSessions: number;
  recentRegistrations: number;
  permissionIssues: number;
}

export const UserManagementSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch users
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*');

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,flat_number.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter as UserRole);
      }

      if (statusFilter !== 'all') {
        query = query.eq('account_status', statusFilter as AccountStatus);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    }
  });

  // Fetch user statistics
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, account_status, created_at');

      if (error) throw error;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: UserStats = {
        total: profiles.length,
        owners: profiles.filter(p => p.role === 'resident_owner').length,
        tenants: profiles.filter(p => p.role === 'resident_tenant').length,
        committee: profiles.filter(p => p.role === 'committee_member').length,
        staff: profiles.filter(p => p.role === 'staff_member').length,
        activeSessions: 23, // This would come from user_sessions table
        recentRegistrations: profiles.filter(p => new Date(p.created_at) > weekAgo).length,
        permissionIssues: profiles.filter(p => p.account_status === 'suspended').length
      };

      return stats;
    }
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'committee_member': return 'default';
      case 'treasurer': return 'secondary';
      case 'resident_owner': return 'outline';
      case 'resident_tenant': return 'outline';
      case 'staff_member': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: AccountStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending_approval': return 'secondary';
      case 'suspended': return 'destructive';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const formatRole = (role: UserRole) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatus = (status: AccountStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleBulkAction = async (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implementation for bulk actions would go here
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.owners || 0} Owners, {stats?.tenants || 0} Tenants, {stats?.committee || 0} Committee, {stats?.staff || 0} Staff
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Currently online</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              New Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentRegistrations || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">This week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.permissionIssues || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Permission problems</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              User Management
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Users
              </Button>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, flat number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={(value: UserRole | 'all') => setRoleFilter(value)}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="committee_member">Committee Member</SelectItem>
                <SelectItem value="treasurer">Treasurer</SelectItem>
                <SelectItem value="resident_owner">Resident Owner</SelectItem>
                <SelectItem value="resident_tenant">Resident Tenant</SelectItem>
                <SelectItem value="staff_member">Staff Member</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: AccountStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Alert className="mb-4">
              <AlertDescription className="flex items-center justify-between">
                <span>{selectedUsers.length} users selected</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                    Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('reset-password')}>
                    Reset Password
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={selectAllUsers}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Flat/Block</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profile_photo_url} />
                            <AvatarFallback>
                              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-muted-foreground">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.flat_number ? (
                          <div>
                            <div className="font-medium">{user.flat_number}</div>
                            {user.block && (
                              <div className="text-sm text-muted-foreground">Block {user.block}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {formatRole(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.account_status)}>
                          {formatStatus(user.account_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewProfile(user.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Role Permissions Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">Super Admin (Secretary)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Full system access</li>
                  <li>• Financial approval up to ₹50,000</li>
                  <li>• User management rights</li>
                  <li>• System backup access</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">Committee Member</h4>
                <ul className="text-sm space-y-1">
                  <li>• Department module access</li>
                  <li>• Expense approval up to ₹25,000</li>
                  <li>• Member communication</li>
                  <li>• Facility management</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Treasurer</h4>
                <ul className="text-sm space-y-1">
                  <li>• Complete financial access</li>
                  <li>• Payment processing</li>
                  <li>• Budget management</li>
                  <li>• Financial reporting</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Resident (Owner)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Personal profile access</li>
                  <li>• Facility booking</li>
                  <li>• Document viewing</li>
                  <li>• Community participation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-orange-600 mb-2">Resident (Tenant)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Limited profile access</li>
                  <li>• Facility booking (with approval)</li>
                  <li>• Public document access</li>
                  <li>• Restricted participation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-600 mb-2">Staff Member</h4>
                <ul className="text-sm space-y-1">
                  <li>• Task-specific access</li>
                  <li>• Maintenance updates</li>
                  <li>• Visitor log entry</li>
                  <li>• Equipment inventory</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};
