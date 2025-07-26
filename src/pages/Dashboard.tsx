
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ExpenseBreakdown } from '@/components/dashboard/ExpenseBreakdown';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';

const Dashboard: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, Rajesh Kumar
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening in Greenfield Residency today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <FinancialOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expense Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            <ExpenseBreakdown />
            <PendingApprovals />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="space-y-8">
            <RecentActivity />
            
            {/* Quick Actions Card */}
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="font-medium text-sm">Add New Expense</div>
                  <div className="text-xs text-muted-foreground">Record a new expense entry</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                  <div className="font-medium text-sm">Send Announcement</div>
                  <div className="text-xs text-muted-foreground">Notify all residents</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div className="font-medium text-sm">Generate Report</div>
                  <div className="text-xs text-muted-foreground">Monthly financial summary</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
