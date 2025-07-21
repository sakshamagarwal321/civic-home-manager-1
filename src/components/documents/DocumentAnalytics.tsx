
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Download, FileText, Calendar, Trophy } from 'lucide-react';

const storageData = [
  { name: 'Society Bylaws', value: 15, color: '#3b82f6' },
  { name: 'Meeting Minutes', value: 25, color: '#10b981' },
  { name: 'Financial Records', value: 30, color: '#f59e0b' },
  { name: 'Legal Documents', value: 20, color: '#ef4444' },
  { name: 'Others', value: 10, color: '#8b5cf6' },
];

const uploadTrends = [
  { month: 'Jan', uploads: 12, downloads: 340 },
  { month: 'Feb', uploads: 18, downloads: 450 },
  { month: 'Mar', uploads: 24, downloads: 520 },
  { month: 'Apr', uploads: 15, downloads: 380 },
  { month: 'May', uploads: 22, downloads: 680 },
  { month: 'Jun', uploads: 28, downloads: 720 },
];

const topContributors = [
  { name: 'Rajesh Kumar', uploads: 45, role: 'Secretary' },
  { name: 'Priya Sharma', uploads: 32, role: 'Treasurer' },
  { name: 'Amit Patel', uploads: 28, role: 'Committee' },
  { name: 'Sunita Gupta', uploads: 24, role: 'Resident' },
  { name: 'Vikram Singh', uploads: 18, role: 'Resident' },
];

const popularDocuments = [
  { name: 'AGM Minutes - Feb 2024', downloads: 127, category: 'Minutes' },
  { name: 'Society Bylaws 2023', downloads: 98, category: 'Legal' },
  { name: 'Budget Report Q1', downloads: 76, category: 'Financial' },
  { name: 'Maintenance Schedule', downloads: 64, category: 'Operations' },
  { name: 'Insurance Policy', downloads: 52, category: 'Legal' },
];

export const DocumentAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Analytics</h2>
        <Badge variant="outline" className="text-xs">
          Last updated: 2 hours ago
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Downloads</p>
                <p className="text-2xl font-bold text-green-600">8,432</p>
                <p className="text-xs text-muted-foreground">+156 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Contributors</p>
                <p className="text-2xl font-bold text-purple-600">28</p>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Avg. Downloads/Doc</p>
                <p className="text-2xl font-bold text-orange-600">6.8</p>
                <p className="text-xs text-muted-foreground">+0.3 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Storage Usage by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upload Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Upload & Download Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">{contributor.role}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{contributor.uploads} uploads</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Most Downloaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularDocuments.map((doc, index) => (
                <div key={doc.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.category}</p>
                    </div>
                    <Badge variant="outline">{doc.downloads} downloads</Badge>
                  </div>
                  <Progress value={(doc.downloads / 127) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Lifecycle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Document Lifecycle Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">342</div>
              <div className="text-sm text-blue-600">Active Documents</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">28</div>
              <div className="text-sm text-yellow-600">Pending Review</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-green-600">Recently Updated</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">89</div>
              <div className="text-sm text-gray-600">Archived</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
