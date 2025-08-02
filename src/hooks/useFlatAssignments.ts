
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FlatAssignment {
  flat_id: string;
  flat_number: string;
  block: string;
  flat_type: string;
  carpet_area: number | null;
  floor_number: number | null;
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

  // Get all flat assignments using a simpler approach
  const { data: flatAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['flat_assignments'],
    queryFn: async () => {
      // Get all flats first
      const { data: flats, error: flatsError } = await supabase
        .from('flats')
        .select('*')
        .order('flat_number');
      
      if (flatsError) throw flatsError;

      // Transform to FlatAssignment format
      return (flats || []).map(flat => ({
        flat_id: flat.id,
        flat_number: flat.flat_number,
        block: flat.block || 'A',
        flat_type: flat.flat_type,
        carpet_area: null,
        floor_number: null,
        status: (flat.resident_id ? 'occupied' : 'vacant') as 'occupied' | 'vacant' | 'pending',
        assignment_type: null,
        user_id: flat.resident_id,
        user_name: flat.resident_name,
        user_phone: null,
        start_date: null,
        end_date: null,
        is_active: true,
      })) as FlatAssignment[];
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
      return (data || []).map(user => ({
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
        .select('id, flat_number, block, flat_type')
        .is('resident_id', null)
        .order('flat_number');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: CreateAssignmentData) => {
      // Get user name first
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', assignmentData.user_id)
        .single();

      if (userError) throw userError;

      const userName = `${userData.first_name} ${userData.last_name}`;

      // Update the flat with resident information
      const { error: flatError } = await supabase
        .from('flats')
        .update({
          resident_id: assignmentData.user_id,
          resident_name: userName
        })
        .eq('id', assignmentData.flat_id);

      if (flatError) throw flatError;

      return { success: true };
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
      // Update flat to remove resident
      const { error } = await supabase
        .from('flats')
        .update({
          resident_id: null,
          resident_name: null
        })
        .eq('id', flatId);

      if (error) throw error;
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
