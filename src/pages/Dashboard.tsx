import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingFollowups } from '@/components/dashboard/UpcomingFollowups';
import { RecentInteractions } from '@/components/dashboard/RecentInteractions';
import { Users, UserPlus, Star, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { customers, isLoading } = useCustomers();

  const stats = {
    total: customers.length,
    new: customers.filter((c) => c.status === 'new').length,
    interested: customers.filter((c) => c.status === 'interested').length,
    closed: customers.filter((c) => c.status === 'closed').length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your CRM overview.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Customers"
            value={stats.total}
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="New Leads"
            value={stats.new}
            icon={UserPlus}
            iconColor="text-status-new"
          />
          <StatsCard
            title="Interested"
            value={stats.interested}
            icon={Star}
            iconColor="text-status-interested"
          />
          <StatsCard
            title="Closed Deals"
            value={stats.closed}
            icon={CheckCircle}
            iconColor="text-status-closed"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingFollowups customers={customers} />
        <RecentInteractions />
      </div>
    </DashboardLayout>
  );
}
