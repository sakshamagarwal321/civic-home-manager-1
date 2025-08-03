
import { useState, useEffect } from 'react';
import { useTestAuth } from './useTestAuth';

export interface TestFlat {
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
  monthly_maintenance: number;
}

// Hardcoded test data that matches the test users
const TEST_FLAT_DATA: Record<string, TestFlat[]> = {
  '550e8400-e29b-41d4-a716-446655440001': [
    {
      flat_id: 'flat-001',
      flat_number: 'A-301',
      block: 'A',
      flat_type: '2BHK',
      carpet_area: 950,
      floor_number: 3,
      assignment_type: 'owner',
      start_date: '2024-01-15',
      is_active: true,
      monthly_maintenance: 2500
    }
  ],
  '550e8400-e29b-41d4-a716-446655440002': [
    {
      flat_id: 'flat-002',
      flat_number: 'B-202',
      block: 'B',
      flat_type: '3BHK',
      carpet_area: 1200,
      floor_number: 2,
      assignment_type: 'owner',
      start_date: '2024-03-01',
      is_active: true,
      monthly_maintenance: 3000
    }
  ],
  '550e8400-e29b-41d4-a716-446655440003': [
    {
      flat_id: 'flat-003',
      flat_number: 'C-103',
      block: 'C',
      flat_type: '1BHK',
      carpet_area: 650,
      floor_number: 1,
      assignment_type: 'tenant',
      start_date: '2024-05-10',
      is_active: true,
      monthly_maintenance: 2000
    }
  ]
};

export const useTestFlatData = () => {
  const { user: testUser } = useTestAuth();
  const [userFlats, setUserFlats] = useState<TestFlat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestFlats = () => {
      if (!testUser?.id) {
        setUserFlats([]);
        setError('No test user selected');
        return;
      }

      setIsLoading(true);
      setError(null);

      // Simulate API delay
      setTimeout(() => {
        const flats = TEST_FLAT_DATA[testUser.id] || [];
        
        if (flats.length === 0) {
          setError(`No flats assigned to ${testUser.name}`);
        } else {
          console.log(`✓ Loaded ${flats.length} flat(s) for ${testUser.name}:`, flats);
        }
        
        setUserFlats(flats);
        setIsLoading(false);
      }, 500);
    };

    loadTestFlats();
  }, [testUser?.id, testUser?.name]);

  return {
    userFlats,
    isLoading,
    error,
    refetch: () => {
      // Force reload when called
      if (testUser?.id) {
        setIsLoading(true);
        setTimeout(() => {
          const flats = TEST_FLAT_DATA[testUser.id] || [];
          setUserFlats(flats);
          setIsLoading(false);
        }, 300);
      }
    }
  };
};
