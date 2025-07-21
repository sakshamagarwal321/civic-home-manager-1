
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';

const expenseData = [
  { name: 'Utilities', value: 68500, percentage: 36.5, color: 'hsl(213, 94%, 68%)', key: 'utilities' },
  { name: 'Security', value: 45000, percentage: 24.0, color: 'hsl(142, 76%, 36%)', key: 'security' },
  { name: 'Maintenance', value: 42000, percentage: 22.4, color: 'hsl(20, 91%, 48%)', key: 'maintenance' },
  { name: 'Landscaping', value: 18000, percentage: 9.6, color: 'hsl(271, 81%, 56%)', key: 'landscaping' },
  { name: 'Administration', value: 14000, percentage: 7.5, color: 'hsl(187, 95%, 45%)', key: 'administration' },
];

const chartConfig = {
  utilities: {
    label: "Utilities",
    color: "hsl(213, 94%, 68%)",
  },
  security: {
    label: "Security",
    color: "hsl(142, 76%, 36%)",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(20, 91%, 48%)",
  },
  landscaping: {
    label: "Landscaping",
    color: "hsl(271, 81%, 56%)",
  },
  administration: {
    label: "Administration",
    color: "hsl(187, 95%, 45%)",
  },
};

const subcategoryData = {
  utilities: [
    { name: 'Electricity (Common Areas)', value: 38500 },
    { name: 'Water Supply', value: 22000 },
    { name: 'Internet/WiFi', value: 8000 },
  ],
  security: [
    { name: 'Security Guards Salary', value: 35000 },
    { name: 'CCTV Maintenance', value: 10000 },
  ],
  maintenance: [
    { name: 'Elevator Maintenance', value: 15000 },
    { name: 'Plumbing Repairs', value: 12000 },
    { name: 'Painting Work', value: 15000 },
  ],
  landscaping: [
    { name: 'Garden Maintenance', value: 12000 },
    { name: 'Plant Purchases', value: 6000 },
  ],
  administration: [
    { name: 'Office Supplies', value: 8000 },
    { name: 'Legal & Compliance', value: 6000 },
  ],
};

export const ExpenseBreakdown: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'trend'>('current');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSegmentClick = (data: any) => {
    setSelectedCategory(data.key);
    setActiveSegment(data.key);
  };

  const handleExportChart = () => {
    // Create canvas element to capture chart
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Note: This is a simplified export - in a real app you'd use a proper chart export library
    console.log('Exporting chart as PNG...');
    // Implementation would use html2canvas or similar library
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-mono font-semibold">₹{data.value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSegmentClick(entry.payload)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
            <span className="text-xs text-muted-foreground">
              ₹{entry.payload.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {viewMode === 'current' ? 'January 2025' : 'Last 6 Months'} Expense Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-mono font-semibold">₹1,87,500</span>
              {viewMode === 'trend' && (
                <Badge variant="secondary" className="ml-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% vs last period
                </Badge>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('current')}
            >
              Current Month
            </Button>
            <Button 
              variant={viewMode === 'trend' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trend')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              6 Months
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportChart}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
                onClick={handleSegmentClick}
                className="cursor-pointer"
                animationBegin={0}
                animationDuration={800}
              >
                {expenseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeSegment === entry.key ? 'hsl(var(--border))' : 'transparent'}
                    strokeWidth={activeSegment === entry.key ? 2 : 0}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Detailed Breakdown */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Category Breakdown</h4>
            {selectedCategory && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                View All
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {(selectedCategory 
              ? subcategoryData[selectedCategory as keyof typeof subcategoryData] || []
              : expenseData
            ).map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                onClick={() => !selectedCategory && handleSegmentClick(item)}
              >
                <div className="flex items-center space-x-3">
                  {!selectedCategory && (
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: (item as any).color }}
                    />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold">₹{item.value.toLocaleString()}</span>
                  {!selectedCategory && (
                    <span className="text-muted-foreground ml-2">
                      ({(item as any).percentage}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
