
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Finances from "./pages/Finances";
import Members from "./pages/Members";
import Announcements from "./pages/Announcements";
import Documents from "./pages/Documents";
import Facilities from "./pages/Facilities";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import UserSettings from "./pages/UserSettings";
import ActivityLog from "./pages/ActivityLog";
import MaintenancePayments from "./pages/MaintenancePayments";
import NotFound from "./pages/NotFound";

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
                <Route path="/finances" element={<Finances />} />
                <Route path="/members" element={<Members />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/maintenance-payments" element={<MaintenancePayments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-settings" element={<UserSettings />} />
                <Route path="/activity-log" element={<ActivityLog />} />
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
