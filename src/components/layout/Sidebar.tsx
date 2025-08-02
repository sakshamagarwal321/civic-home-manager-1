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

interface SidebarProps {
  className?: string;
}

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
    icon: Calendar,
    href: '/maintenance-payments',
  },
  {
    title: 'Facilities',
    icon: Home,
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
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
  {
    title: 'Activity Log',
    icon: Activity,
    href: '/activity-log',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const toggleExpand = (title: string) => {
    setExpanded(expanded === title ? null : title);
  };

  return (
    <div className={cn("flex flex-col h-full bg-secondary border-r", className)}>
      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            item.children ? (
              <div key={item.title} className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={() => toggleExpand(item.title)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {expanded === item.title ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Button>
                {expanded === item.title && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.title}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start pl-8",
                          isActive(child.href) ? "font-medium" : "text-muted-foreground"
                        )}
                        onClick={() => navigate(child.href)}
                      >
                        {child.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive(item.href) ? "font-medium" : "text-muted-foreground"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.title}</span>
              </Button>
            )
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
