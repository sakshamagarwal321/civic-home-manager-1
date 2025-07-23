
import React, { useState } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Plus, Download, Filter, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExpenseCategoriesGrid } from '@/components/finances/ExpenseCategoriesGrid';
import { RecentExpensesTable } from '@/components/finances/RecentExpensesTable';
import { ExpenseEntryModal } from '@/components/finances/ExpenseEntryModal';
import { QuickActionsPanel } from '@/components/finances/QuickActionsPanel';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Finances: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
  const months = [
    'January 2025', 'December 2024', 'November 2024', 'October 2024'
  ];

  const monthlyMetrics = {
    totalExpenses: 187500,
    budgetAllocated: 200000,
    variance: -12500,
    pendingApprovals: 37200
  };

  const budgetUtilization = (monthlyMetrics.totalExpenses / monthlyMetrics.budgetAllocated) * 100;

  return (
    <EnhancedAppShell>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Financial Management</h1>
              <p className="text-muted-foreground">
                Track expenses, manage budgets, and monitor society finances
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <EnhancedButton variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </EnhancedButton>
              <EnhancedButton variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </EnhancedButton>
              <EnhancedButton onClick={() => setShowExpenseModal(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </EnhancedButton>
            </div>
          </div>

          {/* Monthly Summary Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Monthly Summary</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EnhancedButton variant="outline" className="w-full sm:w-48">
                    {selectedMonth}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </EnhancedButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {months.map((month) => (
                    <DropdownMenuItem 
                      key={month} 
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                  <div className="text-xl lg:text-2xl font-bold">₹{monthlyMetrics.totalExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Budget Allocated</div>
                  <div className="text-xl lg:text-2xl font-bold">₹{monthlyMetrics.budgetAllocated.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Variance</div>
                  <div className="text-xl lg:text-2xl font-bold text-green-600">
                    ₹{Math.abs(monthlyMetrics.variance).toLocaleString()}
                    <span className="text-sm font-normal ml-1">under budget</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Pending Approvals</div>
                  <div className="text-xl lg:text-2xl font-bold text-orange-600">
                    ₹{monthlyMetrics.pendingApprovals.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Budget Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    {budgetUtilization.toFixed(1)}% utilized
                  </span>
                </div>
                <Progress 
                  value={budgetUtilization} 
                  className="h-2" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹0</span>
                  <span>₹{monthlyMetrics.budgetAllocated.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Categories Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Expense Categories</h2>
            <ExpenseCategoriesGrid />
          </div>

          {/* Recent Expenses Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <RecentExpensesTable />
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <QuickActionsPanel />
        </div>
      </div>

      {/* Expense Entry Modal */}
      <ExpenseEntryModal 
        open={showExpenseModal} 
        onOpenChange={setShowExpenseModal} 
      />
    </EnhancedAppShell>
  );
};

export default Finances;
