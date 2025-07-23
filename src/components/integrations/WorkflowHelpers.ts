
// Helper functions for triggering workflow events from various modules

export const WorkflowHelpers = {
  // Payment workflows
  triggerPaymentReceived: (data: {
    paymentId: string;
    amount: number;
    residentId: string;
    residentEmail: string;
    residentName: string;
    flat: string;
    receiptNumber: string;
  }) => {
    const event = new CustomEvent('payment:received', {
      detail: {
        module: 'finances',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerPaymentOverdue: (data: {
    paymentId: string;
    amount: number;
    residentId: string;
    residentEmail: string;
    residentName: string;
    flat: string;
    overdueDays: number;
    dueDate: string;
  }) => {
    const event = new CustomEvent('payment:overdue', {
      detail: {
        module: 'finances',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  // Maintenance workflows
  triggerMaintenanceApproved: (data: {
    requestId: string;
    description: string;
    estimatedCost: number;
    vendor: string;
    scheduledDate: string;
    requestedBy: string;
  }) => {
    const event = new CustomEvent('maintenance:approved', {
      detail: {
        module: 'maintenance',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerMaintenanceCompleted: (data: {
    requestId: string;
    actualCost: number;
    completionDate: string;
    photos: string[];
    receipts: string[];
    notes: string;
  }) => {
    const event = new CustomEvent('maintenance:completed', {
      detail: {
        module: 'maintenance',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerMaintenanceEmergency: (data: {
    requestId: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    reportedBy: string;
    contactNumber: string;
  }) => {
    const event = new CustomEvent('maintenance:emergency', {
      detail: {
        module: 'maintenance',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  // Facility workflows
  triggerBookingConfirmed: (data: {
    bookingId: string;
    facilityName: string;
    date: string;
    startTime: string;
    endTime: string;
    residentName: string;
    residentEmail: string;
    purpose: string;
    instructions: string;
  }) => {
    const event = new CustomEvent('booking:confirmed', {
      detail: {
        module: 'facilities',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerBookingReminder: (data: {
    bookingId: string;
    facilityName: string;
    date: string;
    startTime: string;
    residentEmail: string;
    residentName: string;
    setupGuidelines: string;
  }) => {
    const event = new CustomEvent('booking:reminder', {
      detail: {
        module: 'facilities',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerBookingCompleted: (data: {
    bookingId: string;
    facilityName: string;
    residentEmail: string;
    residentName: string;
    completionTime: string;
    feedbackFormUrl: string;
  }) => {
    const event = new CustomEvent('booking:completed', {
      detail: {
        module: 'facilities',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  // Member workflows
  triggerMemberRegistered: (data: {
    memberId: string;
    name: string;
    email: string;
    flat: string;
    role: string;
    welcomePackageItems: string[];
  }) => {
    const event = new CustomEvent('member:registered', {
      detail: {
        module: 'members',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerOwnershipTransferred: (data: {
    fromMemberId: string;
    toMemberId: string;
    flat: string;
    transferDate: string;
    newOwnerName: string;
    newOwnerEmail: string;
  }) => {
    const event = new CustomEvent('ownership:transferred', {
      detail: {
        module: 'members',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  // Document workflows
  triggerDocumentUploaded: (data: {
    documentId: string;
    title: string;
    category: string;
    important: boolean;
    targetGroups: string[];
    uploadedBy: string;
    uploadDate: string;
  }) => {
    const event = new CustomEvent('document:uploaded', {
      detail: {
        module: 'documents',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  triggerDocumentExpiring: (data: {
    documentId: string;
    title: string;
    expiryDate: string;
    days: number;
    actionRequired: string;
    responsibleParty: string;
  }) => {
    const event = new CustomEvent('document:expiring', {
      detail: {
        module: 'documents',
        ...data
      }
    });
    window.dispatchEvent(event);
  },

  // Notification helpers
  triggerNotification: (data: {
    type: 'email' | 'sms' | 'push' | 'inapp';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    message: string;
    recipients: string[];
    actionUrl?: string;
    actionRequired?: boolean;
    data?: any;
  }) => {
    const event = new CustomEvent('notification:send', {
      detail: {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        module: 'notifications',
        ...data
      }
    });
    window.dispatchEvent(event);
  }
};

// Make helpers available globally
(window as any).WorkflowHelpers = WorkflowHelpers;
