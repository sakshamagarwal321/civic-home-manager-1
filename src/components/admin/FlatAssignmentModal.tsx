
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFlatAssignments } from '@/hooks/useFlatAssignments';

interface FlatAssignmentModalProps {
  open: boolean;
  onClose: () => void;
}

export const FlatAssignmentModal: React.FC<FlatAssignmentModalProps> = ({ open, onClose }) => {
  const { vacantFlats, users, createAssignment, isCreatingAssignment } = useFlatAssignments();
  const [selectedFlat, setSelectedFlat] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState<'owner' | 'tenant'>('owner');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlat || !selectedUser || !startDate) return;

    try {
      await createAssignment({
        flat_id: selectedFlat,
        user_id: selectedUser,
        assignment_type: assignmentType,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        notes: notes || undefined,
      });
      
      // Reset form
      setSelectedFlat('');
      setSelectedUser('');
      setAssignmentType('owner');
      setStartDate(undefined);
      setEndDate(undefined);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Assignment error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Flat to User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flat">Select Flat</Label>
            <Select value={selectedFlat} onValueChange={setSelectedFlat}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a flat" />
              </SelectTrigger>
              <SelectContent>
                {vacantFlats.map((flat) => (
                  <SelectItem key={flat.id} value={flat.id}>
                    {flat.flat_number} - {flat.flat_type} ({flat.block} Block)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} {user.phone && `(${user.phone})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assignment Type</Label>
            <RadioGroup value={assignmentType} onValueChange={(value) => setAssignmentType(value as 'owner' | 'tenant')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tenant" id="tenant" />
                <Label htmlFor="tenant">Tenant</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {assignmentType === 'tenant' && (
            <div className="space-y-2">
              <Label>End Date (Lease End)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFlat || !selectedUser || !startDate || isCreatingAssignment}
              className="flex-1"
            >
              {isCreatingAssignment ? 'Assigning...' : 'Assign Flat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
