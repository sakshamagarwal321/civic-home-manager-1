
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Shield, 
  Settings, 
  Activity, 
  HardDrive, 
  Clock,
  Key,
  Globe,
  Smartphone,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  database: {
    autoBackup: boolean;
    backupTime: string;
    retentionPeriod: number;
    storageUsed: number;
    storageLimit: number;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireComplexity: boolean;
      expiryDays: number;
    };
    sessionTimeout: number;
    twoFactorMandatory: boolean;
    ipRestrictions: boolean;
    dataEncryption: boolean;
  };
  integrations: {
    paymentGateway: string;
    smsProvider: string;
    emailService: string;
    whatsappBusiness: boolean;
    bankingIntegration: boolean;
  };
  system: {
    autoUpdates: boolean;
    errorLogging: boolean;
    analytics: boolean;
    supportTickets: boolean;
  };
}

export const SystemConfigurationSection: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SystemConfig>({
    database: {
      autoBackup: true,
      backupTime: '02:00',
      retentionPeriod: 30,
      storageUsed: 1.2,
      storageLimit: 10.0,
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireComplexity: true,
        expiryDays: 90,
      },
      sessionTimeout: 30,
      twoFactorMandatory: false,
      ipRestrictions: false,
      dataEncryption: true,
    },
    integrations: {
      paymentGateway: 'razorpay',
      smsProvider: 'twilio',
      emailService: 'smtp',
      whatsappBusiness: false,
      bankingIntegration: false,
    },
    system: {
      autoUpdates: true,
      errorLogging: true,
      analytics: true,
      supportTickets: true,
    },
  });

  const [systemHealth] = useState({
    uptime: 99.8,
    responseTime: 120,
    errorRate: 0.02,
    activeUsers: 23,
  });

  const handleConfigChange = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedConfigChange = (section: keyof SystemConfig, nested: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...(prev[section] as any)[nested],
          [key]: value
        }
      }
    }));
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "System configuration has been updated successfully.",
    });
  };

  const handleRunBackup = () => {
    toast({
      title: "Backup Started",
      description: "Manual backup is running in the background.",
    });
  };

  const handleTestIntegration = (service: string) => {
    toast({
      title: "Testing Integration",
      description: `Testing ${service} connection...`,
    });
  };

  const storagePercentage = (config.database.storageUsed / config.database.storageLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">System Configuration</h2>
        <p className="text-muted-foreground">
          Configure system settings, security policies, and integrations.
        </p>
      </div>

      {/* System Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemHealth.responseTime}ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{systemHealth.errorRate}%</div>
              <div className="text-sm text-muted-foreground">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemHealth.activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Database & Performance */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-backup Schedule</Label>
                  <p className="text-sm text-muted-foreground">Automated daily backups</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.database.autoBackup}
                    onCheckedChange={(value) => handleConfigChange('database', 'autoBackup', value)}
                  />
                  <Input
                    type="time"
                    value={config.database.backupTime}
                    onChange={(e) => handleConfigChange('database', 'backupTime', e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Storage Usage</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.database.storageUsed}GB / {config.database.storageLimit}GB
                  </span>
                </div>
                <Progress value={storagePercentage} className="h-2" />
                {storagePercentage > 80 && (
                  <p className="text-sm text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Storage usage is high. Consider cleanup or upgrade.
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Retention Period</Label>
                  <p className="text-sm text-muted-foreground">Days to keep backup data</p>
                </div>
                <Input
                  type="number"
                  value={config.database.retentionPeriod}
                  onChange={(e) => handleConfigChange('database', 'retentionPeriod', parseInt(e.target.value))}
                  className="w-20"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleRunBackup} variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Run Manual Backup
                </Button>
                <Button variant="outline">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Configuration */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Password Policy</Label>
                <div className="space-y-3 pl-4 border-l-2 border-muted">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Minimum Length</span>
                    <Input
                      type="number"
                      value={config.security.passwordPolicy.minLength}
                      onChange={(e) => handleNestedConfigChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require Complexity</span>
                    <Switch
                      checked={config.security.passwordPolicy.requireComplexity}
                      onCheckedChange={(value) => handleNestedConfigChange('security', 'passwordPolicy', 'requireComplexity', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expiry (days)</span>
                    <Input
                      type="number"
                      value={config.security.passwordPolicy.expiryDays}
                      onChange={(e) => handleNestedConfigChange('security', 'passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Session Timeout
                  </Label>
                  <p className="text-sm text-muted-foreground">Minutes of inactivity before logout</p>
                </div>
                <Input
                  type="number"
                  value={config.security.sessionTimeout}
                  onChange={(e) => handleConfigChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-20"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">Mandatory for committee members</p>
                </div>
                <Switch
                  checked={config.security.twoFactorMandatory}
                  onCheckedChange={(value) => handleConfigChange('security', 'twoFactorMandatory', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">IP Address Restrictions</Label>
                  <p className="text-sm text-muted-foreground">Whitelist for admin access</p>
                </div>
                <Switch
                  checked={config.security.ipRestrictions}
                  onCheckedChange={(value) => handleConfigChange('security', 'ipRestrictions', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Data Encryption
                  </Label>
                  <p className="text-sm text-muted-foreground">All data encrypted at rest and in transit</p>
                </div>
                <Badge variant="secondary">
                  {config.security.dataEncryption ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Payment Gateway</Label>
                  <p className="text-sm text-muted-foreground">Online payment processing</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={config.integrations.paymentGateway} onValueChange={(value) => handleConfigChange('integrations', 'paymentGateway', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="payu">PayU</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => handleTestIntegration('Payment Gateway')}>
                    Test
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">SMS Service Provider</Label>
                  <p className="text-sm text-muted-foreground">Bulk SMS delivery service</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={config.integrations.smsProvider} onValueChange={(value) => handleConfigChange('integrations', 'smsProvider', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => handleTestIntegration('SMS Provider')}>
                    Test
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Service</Label>
                  <p className="text-sm text-muted-foreground">Email delivery configuration</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={config.integrations.emailService} onValueChange={(value) => handleConfigChange('integrations', 'emailService', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => handleTestIntegration('Email Service')}>
                    Test
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">WhatsApp Business API</Label>
                  <p className="text-sm text-muted-foreground">Official communication channel</p>
                </div>
                <Switch
                  checked={config.integrations.whatsappBusiness}
                  onCheckedChange={(value) => handleConfigChange('integrations', 'whatsappBusiness', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Banking Integration</Label>
                  <p className="text-sm text-muted-foreground">Automatic bank statement import</p>
                </div>
                <Switch
                  checked={config.integrations.bankingIntegration}
                  onCheckedChange={(value) => handleConfigChange('integrations', 'bankingIntegration', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Automatic Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">Security patches and feature updates</p>
                </div>
                <Switch
                  checked={config.system.autoUpdates}
                  onCheckedChange={(value) => handleConfigChange('system', 'autoUpdates', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Error Logging</Label>
                  <p className="text-sm text-muted-foreground">Application errors with stack traces</p>
                </div>
                <Switch
                  checked={config.system.errorLogging}
                  onCheckedChange={(value) => handleConfigChange('system', 'errorLogging', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics & Reporting
                  </Label>
                  <p className="text-sm text-muted-foreground">User activity tracking and reports</p>
                </div>
                <Switch
                  checked={config.system.analytics}
                  onCheckedChange={(value) => handleConfigChange('system', 'analytics', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Support Ticket System</Label>
                  <p className="text-sm text-muted-foreground">Resident issue reporting and tracking</p>
                </div>
                <Switch
                  checked={config.system.supportTickets}
                  onCheckedChange={(value) => handleConfigChange('system', 'supportTickets', value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile App Settings
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View System Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </div>
    </div>
  );
};
