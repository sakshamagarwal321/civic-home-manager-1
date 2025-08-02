import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages';
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import Finances from '@/pages/Finances';
import MaintenancePayments from '@/pages/MaintenancePayments';
import Facilities from '@/pages/Facilities';
import Announcements from '@/pages/Announcements';
import Documents from '@/pages/Documents';
import Settings from '@/pages/Settings';
import ActivityLog from '@/pages/ActivityLog';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import UserSettings from '@/pages/UserSettings';
import FlatManagement from '@/pages/FlatManagement';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/maintenance-payments" element={<MaintenancePayments />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/activity-log" element={<ActivityLog />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-settings" element={<UserSettings />} />
                <Route path="/flat-management" element={<FlatManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
