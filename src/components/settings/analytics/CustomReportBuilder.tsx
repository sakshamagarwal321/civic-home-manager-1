
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart,
  FileText,
  Mail,
  Settings,
  Save,
  Play,
  Clock,
  TrendingUp
} from 'lucide-react';

const reportTemplates = [
  {
    id: 1,
    name: 'Monthly Financial Summary',
    description: 'Comprehensive financial overview with revenue, expenses, and budget analysis',
    category: 'Financial',
    popularity: 95,
    lastUsed: '2024-06-15',
    schedule: 'Monthly'
  },
  {
    id: 2,
    name: 'Member Engagement Report',
    description: 'User activity, feature usage, and satisfaction metrics',
    category: 'Engagement',
    popularity: 78,
    lastUsed: '2024-06-10',
    schedule: 'Weekly'
  },
  {
    id: 3,
    name: 'Maintenance Performance',
    description: 'Request volume, resolution times, and vendor performance',
    category: 'Operations',
    popularity: 82,
    lastUsed: '2024-06-12',
    schedule: 'Monthly'
  },
  {
    id: 4,
    name: 'Compliance Dashboard',
    description: 'Regulatory compliance status and upcoming requirements',
    category: 'Compliance',
    popularity: 65,
    lastUsed: '2024-06-01',
    schedule: 'Quarterly'
  },
  {
    id: 5,
    name: 'Facility Utilization Analysis',
    description: 'Booking patterns, peak usage times, and facility performance',
    category: 'Facilities',
    popularity: 71,
    lastUsed: '2024-06-08',
    schedule: 'Weekly'
  }
];

const scheduledReports = [
  {
    name: 'Weekly Activity Summary',
    recipient: 'committee@society.com',
    schedule: 'Every Monday 9:00 AM',
    status: 'Active',
    lastSent: '2024-06-17'
  },
  {
    name: 'Monthly Financial Report',
    recipient: 'treasurer@society.com',
    schedule: '1st of every month',
    status: 'Active',
    lastSent: '2024-06-01'
  },
  {
    name: 'Quarterly Compliance Report',
    recipient: 'admin@society.com',
    schedule: 'Every 3 months',
    status: 'Active',
    lastSent: '2024-04-01'
  }
];

const recentReports = [
  {
    name: 'June 2024 Financial Summary',
    generatedOn: '2024-06-15 10:30 AM',
    size: '2.4 MB',
    format: 'PDF',
    downloads: 12
  },
  {
    name: 'Member Engagement - Week 24',
    generatedOn: '2024-06-14 2:15 PM',
    size: '1.8 MB',
    format: 'Excel',
    downloads: 8
  },
  {
    name: 'Maintenance Report - May 2024',
    generatedOn: '2024-06-12 11:45 AM',
    size: '3.1 MB',
    format: 'PDF',
    downloads: 15
  }
];

const dataSourceOptions = [
  { name: 'Financial Transactions', fields: ['Revenue', 'Expenses', 'Categories', 'Vendors'] },
  { name: 'User Activity', fields: ['Login Stats', 'Feature Usage', 'Session Duration'] },
  { name: 'Maintenance Requests', fields: ['Request Volume', 'Resolution Times', 'Categories'] },
  { name: 'Facility Bookings', fields: ['Booking Counts', 'Duration', 'Peak Times'] },
  { name: 'Member Information', fields: ['Demographics', 'Payment Status', 'Engagement'] }
];

export const CustomReportBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [activeBuilder, setActiveBuilder] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Report Builder</h3>
          <p className="text-muted-foreground">Create, schedule, and manage custom reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setActiveBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{template.popularity}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last used: {new Date(template.lastUsed).toLocaleDateString()}</span>
                      <Badge variant="secondary">{template.schedule}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>To: {report.recipient}</span>
                        <span>Schedule: {report.schedule}</span>
                        <span>Last sent: {new Date(report.lastSent).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === 'Active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{report.generatedOn}</span>
                          <span>{report.size}</span>
                          <span>{report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{report.downloads} downloads</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <div className="space-y-6">
            {/* Report Builder Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Drag & Drop Report Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Data Sources */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Data Sources</h4>
                    <div className="space-y-2">
                      {dataSourceOptions.map((source, index) => (
                        <div key={index} className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <p className="font-medium text-sm">{source.name}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {source.fields.map((field) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Report Canvas */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Report Canvas</h4>
                    <div className="min-h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 bg-muted/10">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Drag data sources here to build your report</p>
                        <p className="text-sm">You can add charts, tables, and filters</p>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Panel */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuration</h4>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium text-sm mb-2">Report Settings</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <Badge variant="outline">PDF</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Schedule:</span>
                            <Badge variant="outline">Manual</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Recipients:</span>
                            <Badge variant="outline">None</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <p className="font-medium text-sm mb-2">Filters</p>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <Calendar className="h-3 w-3 mr-1" />
                            Date Range
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Filter className="h-3 w-3 mr-1" />
                            Categories
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full">
                          <Save className="h-3 w-3 mr-1" />
                          Save Template
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Play className="h-3 w-3 mr-1" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Predictive Analytics</p>
                    <p className="text-sm text-muted-foreground">Forecast trends and patterns</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">Comparative Analysis</p>
                    <p className="text-sm text-muted-foreground">Year-over-year comparisons</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium">Interactive Charts</p>
                    <p className="text-sm text-muted-foreground">Dynamic visualizations</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Mail className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-medium">Auto Delivery</p>
                    <p className="text-sm text-muted-foreground">Scheduled email reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
