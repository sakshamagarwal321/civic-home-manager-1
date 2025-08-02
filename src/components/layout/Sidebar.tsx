
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  Megaphone, 
  FileText, 
  Settings, 
  Home,
  Building2,
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Member Management',
    icon: Users,
    href: '/members',
  },
  {
    title: 'Flat Management',
    icon: Building2,
    href: '/flat-management',
  },
  {
    title: 'Finances',
    icon: CreditCard,
    href: '/finances',
  },
  {
    title: 'Maintenance Payments',
    icon: CreditCard,
    href: '/maintenance-payments',
  },
  {
    title: 'Facilities',
    icon: Calendar,
    href: '/facilities',
  },
  {
    title: 'Announcements',
    icon: Megaphone,
    href: '/announcements',
  },
  {
    title: 'Documents',
    icon: FileText,
    href: '/documents',
  },
  {
    title: 'Activity Log',
    icon: Activity,
    href: '/activity-log',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Home className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Greenfield</h1>
            <p className="text-sm text-muted-foreground">Residency Society</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-secondary"
                )}
                onClick={() => navigate(item.href)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
