
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: React.ReactNode;
}

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const enhancedToast = ({
    title,
    description,
    variant = 'default',
    duration = 5000,
    action,
  }: EnhancedToastProps) => {
    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'destructive':
          return <AlertCircle className="h-5 w-5 text-red-500" />;
        case 'warning':
          return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'info':
          return <Info className="h-5 w-5 text-blue-500" />;
        default:
          return null;
      }
    };

    return toast({
      title: (
        <div className="flex items-center gap-2">
          {getIcon()}
          {title}
        </div>
      ),
      description,
      duration,
      action,
      className: cn(
        'animate-slide-in-right',
        variant === 'success' && 'border-green-200 bg-green-50',
        variant === 'warning' && 'border-yellow-200 bg-yellow-50',
        variant === 'info' && 'border-blue-200 bg-blue-50'
      ),
    });
  };

  return { enhancedToast };
};
