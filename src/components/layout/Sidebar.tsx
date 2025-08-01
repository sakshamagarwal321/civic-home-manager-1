import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, IndianRupee, Calendar, Settings, MessageSquare, FileText, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [{
  name: 'Dashboard',
  href: '/',
  icon: LayoutDashboard
}, {
  name: 'Financial Management',
  href: '/finances',
  icon: IndianRupee
}, {
  name: 'Members',
  href: '/members',
  icon: Users
}, {
  name: 'Facilities',
  href: '/facilities',
  icon: Building
}, {
  name: 'Announcements',
  href: '/announcements',
  icon: MessageSquare
}, {
  name: 'Documents',
  href: '/documents',
  icon: FileText
}, {
  name: 'Settings',
  href: '/settings',
  icon: Settings
}];
export const Sidebar: React.FC = () => {
  const location = useLocation();
  return <div className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Eco Towers
          </h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map(item => {
          const isActive = location.pathname === item.href;
          return <li key={item.name}>
                <Link to={item.href} className={cn("flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted hover:text-foreground")}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>;
        })}
        </ul>
      </nav>
    </div>;
};