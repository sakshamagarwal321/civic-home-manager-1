
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  Users, 
  IndianRupee, 
  CreditCard,
  Megaphone, 
  FileText, 
  Building, 
  Clock, 
  Settings 
} from "lucide-react";
import { useLocation, Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: false },
  { name: 'Members', href: '/members', icon: Users, current: false },
  { name: 'Finances', href: '/finances', icon: IndianRupee, current: false },
  { name: 'Maintenance Payments', href: '/maintenance-payments', icon: CreditCard, current: false },
  { name: 'Announcements', href: '/announcements', icon: Megaphone, current: false },
  { name: 'Documents', href: '/documents', icon: FileText, current: false },
  { name: 'Facilities', href: '/facilities', icon: Building, current: false },
  { name: 'Activity Log', href: '/activity-log', icon: Clock, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Eco Towers</h1>
            <p className="text-xs text-sidebar-foreground/70">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  to={item.href} 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
