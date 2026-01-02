import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useCustomer } from '@/hooks/useCustomers';

export default function CustomerEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomer(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl animate-pulse space-y-6">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-foreground mb-2">Customer not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CustomerForm customer={customer} />
    </DashboardLayout>
  );
}
