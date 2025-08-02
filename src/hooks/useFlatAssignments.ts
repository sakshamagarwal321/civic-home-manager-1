
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FlatAssignment {
  flat_id: string;
  flat_number: string;
  block: string;
  flat_type: string;
  carpet_area: number;
  floor_number: number;
  status: 'occupied' | 'vacant' | 'pending';
  assignment_type: 'owner' | 'tenant' | null;
  user_id: string | null;
  user_name: string | null;
  user_phone: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean | null;
}

export interface CreateAssignmentData {
  flat_id: string;
  user_id: string;
  assignment_type: 'owner' | 'tenant';
  start_date: string;
  end_date?: string;
  notes?: string;
}

export const useFlatAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all flat assignments
  const { data: flatAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['flat_assignments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_flat_assignments');
      if (error) throw error;
      return data as FlatAssignment[];
    }
  });

  // Get all users for assignment dropdown
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users_for_assignment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone')
        .order('first_name');
      
      if (error) throw error;
      return data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone
      }));
    }
  });

  // Get vacant flats for assignment
  const { data: vacantFlats = [] } = useQuery({
    queryKey: ['vacant_flats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flats')
        .select('id, flat_number, block, flat_type, carpet_area, floor_number')
        .eq('status', 'vacant')
        .order('flat_number');
      
      if (error) throw error;
      return data;
    }
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: CreateAssignmentData) => {
      // First, create the assignment record
      const { data: assignment, error: assignmentError } = await supabase
        .from('flat_assignments')
        .insert({
          flat_id: assignmentData.flat_id,
          user_id: assignmentData.user_id,
          assignment_type: assignmentData.assignment_type,
          start_date: assignmentData.start_date,
          end_date: assignmentData.end_date,
          notes: assignmentData.notes,
          is_active: true
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      // Update the flat status
      const { error: flatError } = await supabase
        .from('flats')
        .update({
          resident_id: assignmentData.user_id,
          status: 'occupied',
          ownership_type: assignmentData.assignment_type,
          possession_date: assignmentData.start_date,
          lease_start_date: assignmentData.assignment_type === 'tenant' ? assignmentData.start_date : null,
          lease_end_date: assignmentData.end_date || null
        })
        .eq('id', assignmentData.flat_id);

      if (flatError) throw flatError;

      return assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flat_assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vacant_flats'] });
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      toast({
        title: "Assignment Created",
        description: "Flat has been successfully assigned",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to create assignment",
        variant: "destructive"
      });
    }
  });

  // Remove assignment mutation
  const removeAssignmentMutation = useMutation({
    mutationFn: async (flatId: string) => {
      // Mark assignment as inactive
      const { error: assignmentError } = await supabase
        .from('flat_assignments')
        .update({ is_active: false })
        .eq('flat_id', flatId)
        .eq('is_active', true);

      if (assignmentError) throw assignmentError;

      // Update flat status to vacant
      const { error: flatError } = await supabase
        .from('flats')
        .update({
          resident_id: null,
          resident_name: null,
          status: 'vacant',
          ownership_type: null,
          possession_date: null,
          lease_start_date: null,
          lease_end_date: null
        })
        .eq('id', flatId);

      if (flatError) throw flatError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flat_assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vacant_flats'] });
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      toast({
        title: "Assignment Removed",
        description: "Flat assignment has been removed",
      });
    }
  });

  const stats = {
    total: flatAssignments.length,
    occupied: flatAssignments.filter(f => f.status === 'occupied').length,
    vacant: flatAssignments.filter(f => f.status === 'vacant').length,
    pending: flatAssignments.filter(f => f.status === 'pending').length,
    ownerOccupied: flatAssignments.filter(f => f.assignment_type === 'owner').length,
    tenantOccupied: flatAssignments.filter(f => f.assignment_type === 'tenant').length,
  };

  return {
    flatAssignments,
    users,
    vacantFlats,
    stats,
    assignmentsLoading,
    usersLoading,
    createAssignment: createAssignmentMutation.mutateAsync,
    removeAssignment: removeAssignmentMutation.mutateAsync,
    isCreatingAssignment: createAssignmentMutation.isPending,
    isRemovingAssignment: removeAssignmentMutation.isPending,
  };
};
