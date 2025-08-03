
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTestAuth } from './useTestAuth';
import { useEffect } from 'react';

export interface UserFlat {
  flat_id: string;
  flat_number: string;
  block: string;
  flat_type: string;
  carpet_area: number;
  floor_number: number;
  assignment_type: 'owner' | 'tenant';
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export const useFlatAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: testUser } = useTestAuth();

  // Invalidate queries when test user changes
  useEffect(() => {
    if (testUser?.id) {
      queryClient.invalidateQueries({ queryKey: ['user-flats'] });
    }
  }, [testUser?.id, queryClient]);

  // Get current user's assigned flats using the existing flats table
  const { data: userFlats = [], isLoading: flatsLoading, error } = useQuery({
    queryKey: ['user-flats', testUser?.id],
    queryFn: async () => {
      console.log('Fetching flats for user:', testUser);
      
      if (!testUser?.id) {
        throw new Error('No user authenticated - please select a test user');
      }

      const { data, error } = await supabase
        .from('flats')
        .select('*')
        .eq('resident_id', testUser.id)
        .eq('is_active', true);

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('No flats found for user:', testUser.id);
        throw new Error('No flats assigned to your account');
      }

      // Transform the data to match the UserFlat interface
      const transformedFlats = data.map((flat: any) => ({
        flat_id: flat.id,
        flat_number: flat.flat_number,
        block: flat.block || '',
        flat_type: flat.flat_type,
        carpet_area: flat.carpet_area || 0,
        floor_number: flat.floor_number || 0,
        assignment_type: (flat.ownership_type || 'owner') as 'owner' | 'tenant',
        start_date: flat.possession_date || flat.created_at,
        end_date: undefined,
        is_active: flat.is_active
      })) as UserFlat[];

      console.log('Transformed flats:', transformedFlats);
      return transformedFlats;
    },
    retry: 1,
    enabled: !!testUser?.id, // Only run query when we have a user
  });

  // Get all available flats (for admin use)
  const { data: allFlats = [], isLoading: allFlatsLoading } = useQuery({
    queryKey: ['all-flats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flats')
        .select('*')
        .eq('is_active', true)
        .order('flat_number');
      
      if (error) throw error;
      return data;
    }
  });

  return {
    userFlats,
    flatsLoading,
    error,
    allFlats,
    allFlatsLoading,
  };
};
