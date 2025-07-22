
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  MessageSquare, 
  Calendar, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const activeUsersData = [
  { month: 'Jan', daily: 28, weekly: 42, monthly: 46 },
  { month: 'Feb', daily: 32, weekly: 44, monthly: 47 },
  { month: 'Mar', daily: 30, weekly: 45, monthly: 48 },
  { month: 'Apr', daily: 35, weekly: 46, monthly: 48 },
  { month: 'May', daily: 33, weekly: 47, monthly: 48 },
  { month: 'Jun', daily: 38, weekly: 48, monthly: 48 },
];

const featureUsage = [
  { feature: 'Announcements', usage: 95, color: '#3b82f6' },
  { feature: 'Payment Portal', usage: 88, color: '#10b981' },
  { feature: 'Facility Booking', usage: 72, color: '#f59e0b' },
  { feature: 'Maintenance Requests', usage: 65, color: '#ef4444' },
  { feature: 'Documents', usage: 58, color: '#8b5cf6' },
  { feature: 'Community Chat', usage: 45, color: '#06b6d4' },
];

const communicationStats = [
  { type: 'Emergency Alerts', sent: 12, opened: 12, rate: 100 },
  { type: 'Payment Reminders', sent: 156, opened: 142, rate: 91 },
  { type: 'General Announcements', sent: 45, opened: 38, rate: 84 },
  { type: 'Meeting Invitations', sent: 24, opened: 22, rate: 92 },
  { type: 'Facility Updates', sent: 18, opened: 14, rate: 78 },
];

const facilityBookings = [
  { facility: 'Community Hall', bookings: 24, hours: 96 },
  { facility: 'Swimming Pool', bookings: 156, hours: 312 },
  { facility: 'Gym', bookings: 189, hours: 378 },
  { facility: 'Playground', bookings: 78, hours: 234 },
  { facility: 'Garden Area', bookings: 45, hours: 180 },
];

const supportTickets = [
  { category: 'Technical Issues', count: 28, avgResolution: 4.2, satisfaction: 4.1 },
  { category: 'Payment Queries', count: 45, avgResolution: 2.8, satisfaction: 4.5 },
  { category: 'Facility Issues', count: 32, avgResolution: 6.5, satisfaction: 3.8 },
  { category: 'Account Access', count: 18, avgResolution: 1.5, satisfaction: 4.7 },
  { category: 'General Inquiries', count: 22, avgResolution: 3.2, satisfaction: 4.3 },
];

export const MemberEngagementAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
                <p className="text-xl font-bold text-blue-600">38</p>
                <p className="text-xs text-blue-600">79% of total members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Active</p>
                <p className="text-xl font-bold text-green-600">48</p>
                <p className="text-xs text-green-600">100% engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session Time</p>
                <p className="text-xl font-bold text-purple-600">12m</p>
                <p className="text-xs text-purple-600">+2m from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction Score</p>
                <p className="text-xl font-bold text-yellow-600">4.2/5</p>
                <p className="text-xs text-yellow-600">Based on 156 responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Trend */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="daily" stroke="#3b82f6" strokeWidth={2} name="Daily Active" />
                <Line type="monotone" dataKey="weekly" stroke="#10b981" strokeWidth={2} name="Weekly Active" />
                <Line type="monotone" dataKey="monthly" stroke="#f59e0b" strokeWidth={2} name="Monthly Active" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureUsage.map((feature) => (
                <div key={feature.feature} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{feature.feature}</span>
                    <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                  </div>
                  <Progress value={feature.usage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communicationStats.map((stat) => (
                <div key={stat.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{stat.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.opened}/{stat.sent} opened
                    </p>
                  </div>
                  <Badge variant={stat.rate >= 90 ? "default" : stat.rate >= 80 ? "secondary" : "destructive"}>
                    {stat.rate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Facility Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Booking Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" name="Total Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Support & Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle>Support Request Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.category} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{ticket.category}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{ticket.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Resolution:</span>
                    <span className="font-medium">{ticket.avgResolution}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Satisfaction:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-medium">{ticket.satisfaction}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">Positive Trends</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">100% weekly active user engagement</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Payment portal usage increased by 12%</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-sm">High satisfaction scores across all categories</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-orange-600">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Community chat usage needs promotion</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Facility update notifications have low open rates</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Document section needs better organization</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
