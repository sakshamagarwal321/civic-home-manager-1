
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

  // Get current user's assigned flats
  const { data: userFlats = [], isLoading: flatsLoading, error } = useQuery({
    queryKey: ['user-flats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_flats', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data as UserFlat[];
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
