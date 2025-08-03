
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
      console.log('Test user changed, invalidating queries for:', testUser);
      queryClient.invalidateQueries({ queryKey: ['user-flats'] });
    }
  }, [testUser?.id, queryClient]);

  // Get current user's assigned flats using the existing flats table
  const { data: userFlats = [], isLoading: flatsLoading, error } = useQuery({
    queryKey: ['user-flats', testUser?.id],
    queryFn: async () => {
      console.log('=== FETCHING FLATS FOR USER ===');
      console.log('Test user:', testUser);
      
      if (!testUser?.id) {
        console.log('No test user ID available');
        throw new Error('No user authenticated - please select a test user');
      }

      console.log('Querying flats for user ID:', testUser.id);
      
      const { data, error } = await supabase
        .from('flats')
        .select('*')
        .eq('resident_id', testUser.id)
        .eq('is_active', true);

      console.log('=== SUPABASE QUERY RESULT ===');
      console.log('Data:', data);
      console.log('Error:', error);
      console.log('Query executed for resident_id:', testUser.id);

      if (error) {
        console.error('Supabase database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('=== NO FLATS FOUND ===');
        console.log('User ID searched:', testUser.id);
        console.log('User name:', testUser.name);
        
        // Let's also check what's in the flats table
        const { data: allFlats } = await supabase
          .from('flats')
          .select('*')
          .limit(10);
        
        console.log('Sample flats in database:', allFlats);
        
        throw new Error(`No flats assigned to ${testUser.name}. Please ensure flat assignments are set up correctly.`);
      }

      // Transform the data to match the UserFlat interface
      const transformedFlats = data.map((flat: any) => {
        console.log('Transforming flat:', flat);
        
        return {
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
        };
      }) as UserFlat[];

      console.log('=== TRANSFORMED FLATS ===');
      console.log('Final transformed flats:', transformedFlats);
      
      // Show success message
      toast({
        title: "Flats Loaded Successfully",
        description: `Found ${transformedFlats.length} flat(s) assigned to ${testUser.name}`,
      });
      
      return transformedFlats;
    },
    retry: (failureCount, error) => {
      console.log('Query retry attempt:', failureCount, 'Error:', error);
      return failureCount < 2; // Only retry twice
    },
    enabled: !!testUser?.id, // Only run query when we have a user
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 0, // Don't cache results
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
