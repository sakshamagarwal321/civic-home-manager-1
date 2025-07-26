
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IntegrationManager } from "@/components/integrations/IntegrationManager";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Finances from "./pages/Finances";
import Facilities from "./pages/Facilities";
import Announcements from "./pages/Announcements";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import ActivityLog from "./pages/ActivityLog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/activity" element={<ActivityLog />} />
              <Route path="/dashboard/activity" element={<ActivityLog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <IntegrationManager />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
