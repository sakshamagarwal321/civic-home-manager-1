
import { useState, useEffect } from 'react';

// Temporary authentication hook for testing purposes
// In production, this would be replaced with actual Supabase auth
export const useTestAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      // For testing, default to Rajesh Kumar's user ID
      setUser({
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Rajesh Kumar'
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const switchUser = (userId: string, name: string) => {
    setUser({ id: userId, name });
  };

  return {
    user,
    isLoading,
    switchUser
  };
};
