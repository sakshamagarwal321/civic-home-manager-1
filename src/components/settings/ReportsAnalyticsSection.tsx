
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Settings
} from 'lucide-react';
import { AnalyticsOverview } from './analytics/AnalyticsOverview';
import { FinancialAnalytics } from './analytics/FinancialAnalytics';
import { MemberEngagementAnalytics } from './analytics/MemberEngagementAnalytics';
import { OperationalReports } from './analytics/OperationalReports';
import { CustomReportBuilder } from './analytics/CustomReportBuilder';

export const ReportsAnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const quickStats = [
    { label: 'Society Health Score', value: '87/100', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Payment Compliance', value: '83%', icon: IndianRupee, color: 'text-blue-600' },
    { label: 'Member Satisfaction', value: '4.2/5', icon: Users, color: 'text-purple-600' },
    { label: 'Facility Utilization', value: '78%', icon: Calendar, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into society operations and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialAnalytics />
        </TabsContent>

        <TabsContent value="engagement">
          <MemberEngagementAnalytics />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalReports />
        </TabsContent>

        <TabsContent value="builder">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            System Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="font-medium">Monthly Financial Report Pending</p>
                  <p className="text-sm text-muted-foreground">Due in 3 days</p>
                </div>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Backup Completed Successfully</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
