
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Star,
  Shield
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const maintenanceData = [
  { month: 'Jan', requests: 45, completed: 42, pending: 3, avgTime: 4.2 },
  { month: 'Feb', requests: 38, completed: 36, pending: 2, avgTime: 3.8 },
  { month: 'Mar', requests: 52, completed: 48, pending: 4, avgTime: 4.5 },
  { month: 'Apr', requests: 41, completed: 39, pending: 2, avgTime: 3.9 },
  { month: 'May', requests: 35, completed: 33, pending: 2, avgTime: 3.2 },
  { month: 'Jun', requests: 48, completed: 45, pending: 3, avgTime: 4.1 },
];

const maintenanceCategories = [
  { name: 'Plumbing', requests: 68, avgTime: 3.5, cost: 25000, color: '#3b82f6' },
  { name: 'Electrical', requests: 42, avgTime: 2.8, cost: 18000, color: '#10b981' },
  { name: 'HVAC', requests: 28, avgTime: 5.2, cost: 35000, color: '#f59e0b' },
  { name: 'Cleaning', requests: 35, avgTime: 1.5, cost: 8000, color: '#ef4444' },
  { name: 'Security', requests: 15, avgTime: 6.0, cost: 12000, color: '#8b5cf6' },
  { name: 'Other', requests: 22, avgTime: 3.8, cost: 15000, color: '#06b6d4' },
];

const vendorPerformance = [
  { name: 'Quick Fix Solutions', rating: 4.8, jobs: 28, onTime: 96, avgCost: 2500 },
  { name: 'Elite Maintenance Co', rating: 4.6, jobs: 22, onTime: 91, avgCost: 3200 },
  { name: 'City Repair Services', rating: 4.2, jobs: 35, onTime: 87, avgCost: 1800 },
  { name: 'Express Fix Ltd', rating: 4.0, jobs: 18, onTime: 83, avgCost: 2200 },
  { name: 'Home Care Services', rating: 3.8, jobs: 15, onTime: 80, avgCost: 2800 },
];

const complianceData = [
  { area: 'Fire Safety', status: 'Compliant', lastCheck: '2024-05-15', nextDue: '2024-11-15' },
  { area: 'Elevator Maintenance', status: 'Compliant', lastCheck: '2024-06-01', nextDue: '2024-12-01' },
  { area: 'Water Quality Testing', status: 'Due Soon', lastCheck: '2024-03-15', nextDue: '2024-09-15' },
  { area: 'Electrical Safety Audit', status: 'Overdue', lastCheck: '2024-01-20', nextDue: '2024-07-20' },
  { area: 'Waste Management License', status: 'Compliant', lastCheck: '2024-04-10', nextDue: '2024-10-10' },
];

const meetingAttendance = [
  { meeting: 'AGM 2024', date: '2024-06-15', invited: 48, attended: 42, percentage: 87.5 },
  { meeting: 'Committee Meeting - May', date: '2024-05-20', invited: 12, attended: 11, percentage: 91.7 },
  { meeting: 'Budget Discussion', date: '2024-04-25', invited: 48, attended: 35, percentage: 72.9 },
  { meeting: 'Committee Meeting - Apr', date: '2024-04-15', invited: 12, attended: 10, percentage: 83.3 },
  { meeting: 'Emergency Meeting', date: '2024-03-30', invited: 48, attended: 38, percentage: 79.2 },
];

export const OperationalReports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Operational Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-xl font-bold text-blue-600">259</p>
                <p className="text-xs text-blue-600">Last 6 months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold text-green-600">94.2%</p>
                <p className="text-xs text-green-600">243/259 completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Resolution</p>
                <p className="text-xl font-bold text-orange-600">3.9h</p>
                <p className="text-xs text-orange-600">-0.3h improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
                <p className="text-xl font-bold text-red-600">16</p>
                <p className="text-xs text-red-600">2 high priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Total Requests" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Average Resolution Time by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#3b82f6" name="Avg Time (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Categories Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maintenanceCategories.map((category) => (
              <div key={category.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{category.name}</h4>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requests:</span>
                    <span className="font-medium">{category.requests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Time:</span>
                    <span className="font-medium">{category.avgTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-medium">₹{category.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendorPerformance.map((vendor, index) => (
              <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{vendor.jobs} jobs</span>
                      <span>{vendor.onTime}% on-time</span>
                      <span>₹{vendor.avgCost} avg. cost</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{vendor.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Compliance & Governance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceData.map((item) => (
                <div key={item.area} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.area}</p>
                    <p className="text-sm text-muted-foreground">
                      Last: {new Date(item.lastCheck).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        item.status === 'Compliant' ? 'default' : 
                        item.status === 'Due Soon' ? 'secondary' : 'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(item.nextDue).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Meeting Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetingAttendance.map((meeting) => (
                <div key={meeting.meeting} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{meeting.meeting}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{meeting.attended}/{meeting.invited}</p>
                      <p className="text-sm text-muted-foreground">{meeting.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={meeting.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Response Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Response & Critical Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-red-600">Emergency Incidents</p>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">8min</p>
              <p className="text-sm text-green-600">Avg Response Time</p>
              <p className="text-xs text-muted-foreground">Under 15min target</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-blue-600">Resolution Rate</p>
              <p className="text-xs text-muted-foreground">All incidents resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
