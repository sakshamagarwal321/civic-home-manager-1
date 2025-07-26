
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string | null;
}

export const useDashboardState = () => {
  const [loading, setLoading] = useState<LoadingState>({});
  const [errors, setErrors] = useState<ErrorState>({});
  const { toast } = useToast();
  const timeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const setLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
    if (!isLoading) {
      // Clear any timeout for this key
      if (timeoutsRef.current[key]) {
        clearTimeout(timeoutsRef.current[key]);
        delete timeoutsRef.current[key];
      }
    }
  }, []);

  const setErrorState = useCallback((key: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [toast]);

  const executeAsyncAction = useCallback(async <T>(
    key: string,
    action: () => Promise<T>,
    options: {
      successMessage?: string;
      errorMessage?: string;
      optimisticUpdate?: () => void;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T | null> => {
    setLoadingState(key, true);
    setErrorState(key, null);

    // Apply optimistic update if provided
    if (options.optimisticUpdate) {
      options.optimisticUpdate();
    }

    try {
      const result = await action();
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "default",
        });
      }

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = options.errorMessage || 
        (error instanceof Error ? error.message : 'An unexpected error occurred');
      
      setErrorState(key, errorMessage);
      
      if (options.onError && error instanceof Error) {
        options.onError(error);
      }

      return null;
    } finally {
      // Add a small delay to show loading state
      timeoutsRef.current[key] = setTimeout(() => {
        setLoadingState(key, false);
      }, 300);
    }
  }, [setLoadingState, setErrorState, toast]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    loading,
    errors,
    setLoadingState,
    setErrorState,
    executeAsyncAction,
    isLoading: (key: string) => loading[key] || false,
    getError: (key: string) => errors[key] || null,
  };
};
