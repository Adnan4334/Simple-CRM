import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerForm } from '@/components/customers/CustomerForm';

export default function CustomerNew() {
  return (
    <DashboardLayout>
      <CustomerForm />
    </DashboardLayout>
  );
}
