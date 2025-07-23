
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { PageTransition } from '@/components/ui/page-transition';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

interface EnhancedAppShellProps {
  children: ReactNode;
}

export const EnhancedAppShell: React.FC<EnhancedAppShellProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex">
        <OfflineIndicator />
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className={cn(
            "flex-1 p-4 md:p-6 transition-all duration-200",
            !isOnline && "opacity-75"
          )}>
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};
