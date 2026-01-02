import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users } from 'lucide-react';
import { CustomerStatus } from '@/types/crm';

export default function Customers() {
  const { customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.company?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
        </div>
        <Link to="/customers/new">
          <Button className="gradient-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CustomerStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No customers found</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Get started by adding your first customer'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link to="/customers/new">
              <Button className="gradient-primary gap-2">
                <Plus className="w-4 h-4" />
                Add Customer
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
