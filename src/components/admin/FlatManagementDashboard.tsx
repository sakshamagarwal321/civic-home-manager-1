
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { TableCell, TableRow } from '@/components/ui/table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FlatAssignmentModal } from './FlatAssignmentModal';
import { useFlatAssignments, FlatAssignment } from '@/hooks/useFlatAssignments';
import { 
  Building2, 
  Users, 
  Home, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter,
  UserMinus
} from 'lucide-react';

export const FlatManagementDashboard: React.FC = () => {
  const { 
    flatAssignments, 
    stats, 
    assignmentsLoading, 
    removeAssignment, 
    isRemovingAssignment 
  } = useFlatAssignments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [confirmRemoval, setConfirmRemoval] = useState<{
    open: boolean;
    flatId: string;
    flatNumber: string;
  }>({ open: false, flatId: '', flatNumber: '' });

  const filteredAssignments = flatAssignments.filter((assignment) => {
    const matchesSearch = assignment.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesBlock = blockFilter === 'all' || assignment.block === blockFilter;
    
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentTypeColor = (type: string | null) => {
    switch (type) {
      case 'owner': return 'bg-blue-100 text-blue-800';
      case 'tenant': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRemoveAssignment = async () => {
    if (confirmRemoval.flatId) {
      await removeAssignment(confirmRemoval.flatId);
      setConfirmRemoval({ open: false, flatId: '', flatNumber: '' });
    }
  };

  const renderTableRow = (assignment: FlatAssignment, index: number) => (
    <TableRow key={assignment.flat_id}>
      <TableCell className="font-medium">{assignment.flat_number}</TableCell>
      <TableCell>{assignment.block}</TableCell>
      <TableCell>{assignment.flat_type}</TableCell>
      <TableCell>{assignment.user_name || '-'}</TableCell>
      <TableCell>
        {assignment.assignment_type ? (
          <Badge className={getAssignmentTypeColor(assignment.assignment_type)}>
            {assignment.assignment_type}
          </Badge>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(assignment.status)}>
          {assignment.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {assignment.status === 'occupied' && assignment.user_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmRemoval({
                open: true,
                flatId: assignment.flat_id,
                flatNumber: assignment.flat_number
              })}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderCard = (assignment: FlatAssignment, index: number) => (
    <Card key={assignment.flat_id} className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{assignment.flat_number}</h3>
          <p className="text-sm text-muted-foreground">
            Block {assignment.block} • {assignment.flat_type}
          </p>
        </div>
        <Badge className={getStatusColor(assignment.status)}>
          {assignment.status}
        </Badge>
      </div>

      {assignment.user_name && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Resident:</span>
            <span className="font-medium">{assignment.user_name}</span>
          </div>
          {assignment.assignment_type && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <Badge className={getAssignmentTypeColor(assignment.assignment_type)} variant="secondary">
                {assignment.assignment_type}
              </Badge>
            </div>
          )}
          {assignment.user_phone && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span>{assignment.user_phone}</span>
            </div>
          )}
        </div>
      )}

      {assignment.status === 'occupied' && assignment.user_id && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmRemoval({
            open: true,
            flatId: assignment.flat_id,
            flatNumber: assignment.flat_number
          })}
          className="w-full mt-2"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Remove Assignment
        </Button>
      )}
    </Card>
  );

  if (assignmentsLoading) {
    return <div className="flex justify-center p-8">Loading flat assignments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across 3 blocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ownerOccupied} owners, {stats.tenantOccupied} tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.vacant}</div>
            <p className="text-xs text-muted-foreground">Available for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Flat Assignments</CardTitle>
            <Button onClick={() => setShowAssignmentModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Flat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by flat number or resident name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <ResponsiveTable
            headers={['Flat Number', 'Block', 'Type', 'Resident', 'Assignment', 'Status', 'Actions']}
            data={filteredAssignments}
            renderRow={renderTableRow}
            renderCard={renderCard}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <FlatAssignmentModal 
        open={showAssignmentModal} 
        onClose={() => setShowAssignmentModal(false)} 
      />

      <ConfirmationDialog
        open={confirmRemoval.open}
        onOpenChange={(open) => setConfirmRemoval(prev => ({ ...prev, open }))}
        title="Remove Flat Assignment"
        description={`Are you sure you want to remove the assignment for flat ${confirmRemoval.flatNumber}? This will mark the flat as vacant.`}
        confirmText="Remove Assignment"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleRemoveAssignment}
        loading={isRemovingAssignment}
      />
    </div>
  );
};
