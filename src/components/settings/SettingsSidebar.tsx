
import React from 'react';
import { 
  Building, 
  Users, 
  IndianRupee, 
  Home, 
  Bell, 
  Shield, 
  Settings, 
  BarChart3, 
  Wrench 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const settingsNavigation = [
  { id: 'society-info', name: 'Society Information', icon: Building },
  { id: 'user-management', name: 'User Management', icon: Users },
  { id: 'financial-settings', name: 'Financial Settings', icon: IndianRupee },
  { id: 'property-management', name: 'Property Management', icon: Home },
  { id: 'notifications', name: 'Notification Preferences', icon: Bell },
  { id: 'security', name: 'Security & Privacy', icon: Shield },
  { id: 'system-config', name: 'System Configuration', icon: Settings },
  { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
  { id: 'maintenance', name: 'Maintenance & Backup', icon: Wrench },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <nav className="space-y-1">
          {settingsNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-left",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
