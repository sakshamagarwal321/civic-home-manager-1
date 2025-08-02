
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Get current user's assigned flats using direct table joins
  const { data: userFlats = [], isLoading: flatsLoading, error } = useQuery({
    queryKey: ['user-flats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('flat_assignments')
        .select(`
          id,
          assignment_type,
          start_date,
          end_date,
          is_active,
          flats (
            id,
            flat_number,
            block,
            flat_type,
            carpet_area,
            floor_number
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      // Transform the data to match the UserFlat interface
      return (data || []).map((assignment: any) => ({
        flat_id: assignment.flats.id,
        flat_number: assignment.flats.flat_number,
        block: assignment.flats.block || '',
        flat_type: assignment.flats.flat_type,
        carpet_area: assignment.flats.carpet_area || 0,
        floor_number: assignment.flats.floor_number || 0,
        assignment_type: assignment.assignment_type,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
        is_active: assignment.is_active
      })) as UserFlat[];
    },
    retry: 1,
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
