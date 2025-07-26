
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
}

const DashboardErrorFallback = ({ error, retry }: { error?: Error; retry: () => void }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Dashboard Error</h3>
      <p className="text-muted-foreground mb-4">
        Unable to load dashboard data. Please try refreshing or contact support if this persists.
      </p>
      <Button onClick={retry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

export const DashboardErrorBoundary: React.FC<DashboardErrorBoundaryProps> = ({ children }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary fallback={<DashboardErrorFallback retry={handleRetry} />}>
      {children}
    </ErrorBoundary>
  );
};
