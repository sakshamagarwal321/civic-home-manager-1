
import React, { useState } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { SocietyInformationSection } from '@/components/settings/SocietyInformationSection';
import { FinancialSettingsSection } from '@/components/settings/FinancialSettingsSection';
import { PropertyManagementSection } from '@/components/settings/PropertyManagementSection';
import { UserManagementSection } from '@/components/settings/UserManagementSection';
import { NotificationPreferencesSection } from '@/components/settings/NotificationPreferencesSection';
import { SystemConfigurationSection } from '@/components/settings/SystemConfigurationSection';
import { ReportsAnalyticsSection } from '@/components/settings/ReportsAnalyticsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('society-info');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'society-info':
        return <SocietyInformationSection />;
      case 'user-management':
        return <UserManagementSection />;
      case 'financial-settings':
        return <FinancialSettingsSection />;
      case 'property-management':
        return <PropertyManagementSection />;
      case 'notifications':
        return <NotificationPreferencesSection />;
      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security settings coming soon...
              </p>
            </CardContent>
          </Card>
        );
      case 'system-config':
        return <SystemConfigurationSection />;
      case 'reports':
        return <ReportsAnalyticsSection />;
      case 'maintenance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Maintenance & Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Maintenance and backup options coming soon...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return <SocietyInformationSection />;
    }
  };

  return (
    <EnhancedAppShell>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="lg:hidden mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure society settings, user permissions, and system preferences
            </p>
          </div>
        </div>
        
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Configure society settings, user permissions, and system preferences
              </p>
            </div>
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </EnhancedAppShell>
  );
};

export default Settings;
