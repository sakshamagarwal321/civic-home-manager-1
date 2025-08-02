
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTestAuth } from './useTestAuth';

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

  // Get current user's assigned flats using the existing flats table
  const { data: userFlats = [], isLoading: flatsLoading, error } = useQuery({
    queryKey: ['user-flats', testUser?.id],
    queryFn: async () => {
      // Try to get authenticated user first, fall back to test user
      let userId: string | null = null;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (authError) {
        console.log('Auth error, using test user:', authError);
      }

      // Use test user if no authenticated user
      if (!userId && testUser) {
        userId = testUser.id;
      }

      if (!userId) {
        throw new Error('No user authenticated - please login or use test mode');
      }

      const { data, error } = await supabase
        .from('flats')
        .select('*')
        .eq('resident_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No flats assigned to your account');
      }

      // Transform the data to match the UserFlat interface
      return (data || []).map((flat: any) => ({
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
    },
    retry: 1,
    enabled: !!testUser, // Only run query when we have a user
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
