
import React, { useState, useEffect } from 'react';
import { WorkflowEngine } from './WorkflowEngine';
import { NotificationCenter } from './NotificationCenter';
import { GlobalSearch } from './GlobalSearch';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings } from 'lucide-react';

export const IntegrationManager: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize integration services
    initializeIntegrations();
    
    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowSearch(true);
            break;
          case 'n':
            e.preventDefault();
            setShowNotifications(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initializeIntegrations = () => {
    // Set up cross-module event handlers
    setupPaymentIntegration();
    setupMaintenanceIntegration();
    setupFacilityIntegration();
    setupMemberIntegration();
    setupDocumentIntegration();
  };

  const setupPaymentIntegration = () => {
    // Payment event handlers
    window.addEventListener('payment:received', (e: any) => {
      triggerWorkflow('payment.received', e.detail);
    });

    window.addEventListener('payment:overdue', (e: any) => {
      triggerWorkflow('payment.overdue', e.detail);
    });

    window.addEventListener('payment:dispute', (e: any) => {
      triggerWorkflow('payment.dispute', e.detail);
    });
  };

  const setupMaintenanceIntegration = () => {
    // Maintenance event handlers
    window.addEventListener('maintenance:approved', (e: any) => {
      triggerWorkflow('maintenance.approved', e.detail);
    });

    window.addEventListener('maintenance:completed', (e: any) => {
      triggerWorkflow('maintenance.completed', e.detail);
    });

    window.addEventListener('maintenance:emergency', (e: any) => {
      triggerWorkflow('maintenance.emergency', e.detail);
    });
  };

  const setupFacilityIntegration = () => {
    // Facility event handlers
    window.addEventListener('booking:confirmed', (e: any) => {
      triggerWorkflow('booking.confirmed', e.detail);
    });

    window.addEventListener('booking:reminder', (e: any) => {
      triggerWorkflow('booking.reminder', e.detail);
    });

    window.addEventListener('booking:completed', (e: any) => {
      triggerWorkflow('booking.completed', e.detail);
    });
  };

  const setupMemberIntegration = () => {
    // Member event handlers
    window.addEventListener('member:registered', (e: any) => {
      triggerWorkflow('member.registered', e.detail);
    });

    window.addEventListener('ownership:transferred', (e: any) => {
      triggerWorkflow('ownership.transferred', e.detail);
    });
  };

  const setupDocumentIntegration = () => {
    // Document event handlers
    window.addEventListener('document:uploaded', (e: any) => {
      triggerWorkflow('document.uploaded', e.detail);
    });

    window.addEventListener('document:expiring', (e: any) => {
      triggerWorkflow('document.expiring', e.detail);
    });
  };

  const triggerWorkflow = (type: string, data: any) => {
    const event = new CustomEvent('workflow:event', {
      detail: {
        id: Math.random().toString(36).substr(2, 9),
        type,
        module: data.module || 'unknown',
        data,
        timestamp: new Date()
      }
    });
    window.dispatchEvent(event);
  };

  // Helper functions for modules to trigger events
  const triggerPaymentReceived = (paymentData: any) => {
    const event = new CustomEvent('payment:received', { detail: paymentData });
    window.dispatchEvent(event);
  };

  const triggerMaintenanceApproved = (maintenanceData: any) => {
    const event = new CustomEvent('maintenance:approved', { detail: maintenanceData });
    window.dispatchEvent(event);
  };

  const triggerBookingConfirmed = (bookingData: any) => {
    const event = new CustomEvent('booking:confirmed', { detail: bookingData });
    window.dispatchEvent(event);
  };

  const triggerMemberRegistered = (memberData: any) => {
    const event = new CustomEvent('member:registered', { detail: memberData });
    window.dispatchEvent(event);
  };

  const triggerDocumentUploaded = (documentData: any) => {
    const event = new CustomEvent('document:uploaded', { detail: documentData });
    window.dispatchEvent(event);
  };

  // Make helper functions available globally
  useEffect(() => {
    (window as any).integrationManager = {
      triggerPaymentReceived,
      triggerMaintenanceApproved,
      triggerBookingConfirmed,
      triggerMemberRegistered,
      triggerDocumentUploaded
    };
  }, []);

  return (
    <>
      {/* Workflow Engine (invisible service) */}
      <WorkflowEngine />

      {/* Global Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSearch(true)}
          className="bg-white shadow-lg"
          title="Global Search (Ctrl+K)"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowNotifications(true)}
          className="bg-white shadow-lg relative"
          title="Notifications (Ctrl+N)"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Global Search */}
      <GlobalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </>
  );
};
