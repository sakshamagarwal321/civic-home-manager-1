import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const expenseData = [
  { name: 'Utilities', value: 68500, percentage: 36.5, color: '#2563eb' },
  { name: 'Security', value: 45000, percentage: 24.0, color: '#16a34a' },
  { name: 'Maintenance', value: 42000, percentage: 22.4, color: '#ea580c' },
  { name: 'Landscaping', value: 18000, percentage: 9.6, color: '#8b5cf6' },
  { name: 'Administration', value: 14000, percentage: 7.5, color: '#06b6d4' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percentage
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${percentage}%`}
    </text>
  );
};

export const ExpenseBreakdown: React.FC = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          January 2025 Expense Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-mono font-semibold">₹1,87,500</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value}: ₹{entry.payload.value.toLocaleString()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {expenseData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-mono">₹{item.value.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};