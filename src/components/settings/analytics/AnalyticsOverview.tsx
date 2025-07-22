
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Users, 
  Home, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 240000, expenses: 180000, satisfaction: 4.1 },
  { month: 'Feb', revenue: 245000, expenses: 175000, satisfaction: 4.0 },
  { month: 'Mar', revenue: 250000, expenses: 187500, satisfaction: 4.2 },
  { month: 'Apr', revenue: 245000, expenses: 190000, satisfaction: 4.3 },
  { month: 'May', revenue: 252000, expenses: 185000, satisfaction: 4.2 },
  { month: 'Jun', revenue: 248000, expenses: 182000, satisfaction: 4.4 },
];

const facilityUsage = [
  { name: 'Gym', value: 85, color: '#3b82f6' },
  { name: 'Swimming Pool', value: 72, color: '#10b981' },
  { name: 'Community Hall', value: 45, color: '#f59e0b' },
  { name: 'Playground', value: 68, color: '#ef4444' },
  { name: 'Garden', value: 90, color: '#8b5cf6' },
];

export const AnalyticsOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Society Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Society Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">87/100</span>
              <Badge variant="outline" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 from last month
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Financial Health</span>
                <span className="text-sm font-medium">92/100</span>
              </div>
              <Progress value={92} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Member Satisfaction</span>
                <span className="text-sm font-medium">84/100</span>
              </div>
              <Progress value={84} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Operational Efficiency</span>
                <span className="text-sm font-medium">88/100</span>
              </div>
              <Progress value={88} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance</span>
                <span className="text-sm font-medium">85/100</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">₹2,45,000</p>
                  <Badge variant="outline" className="text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2%
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">₹1,87,500</p>
                  <Badge variant="outline" className="text-red-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.1%
                  </Badge>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Net Surplus</p>
                <p className="text-2xl font-bold text-blue-600">₹57,500</p>
                <p className="text-sm text-green-600">+15.3% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Member Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-xl font-bold">48</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-xl font-bold text-green-600">45</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Compliance</span>
                  <span className="text-sm font-medium">83% (40/48)</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Satisfaction: 4.2/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Facility Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={facilityUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {facilityUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Key Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Monthly Maintenance Collection</p>
                <p className="text-sm text-muted-foreground">₹2,15,000 collected (88% completion)</p>
              </div>
              <Badge variant="outline">2 days ago</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">Committee Meeting Conducted</p>
                <p className="text-sm text-muted-foreground">Monthly review and planning session</p>
              </div>
              <Badge variant="outline">1 week ago</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium">Pending Maintenance Requests</p>
                <p className="text-sm text-muted-foreground">8 requests awaiting assignment</p>
              </div>
              <Badge variant="outline">Ongoing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
