import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, CustomerStatus } from '@/types/crm';
import { useCustomers } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
}

const statusOptions: { value: CustomerStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'closed', label: 'Closed' },
];

export function CustomerForm({ customer }: CustomerFormProps) {
  const navigate = useNavigate();
  const { createCustomer, updateCustomer } = useCustomers();
  const isEditing = !!customer;

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    company: customer?.company || '',
    status: customer?.status || 'new' as CustomerStatus,
    notes: customer?.notes || '',
    follow_up_date: customer?.follow_up_date || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      company: formData.company || null,
      status: formData.status,
      notes: formData.notes || null,
      follow_up_date: formData.follow_up_date || null,
    };

    if (isEditing) {
      await updateCustomer.mutateAsync({ id: customer.id, ...customerData });
    } else {
      await createCustomer.mutateAsync(customerData);
    }

    navigate('/customers');
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: CustomerStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_date">Follow-up Date</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any relevant notes about this customer..."
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="gradient-primary gap-2"
                disabled={createCustomer.isPending || updateCustomer.isPending}
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Customer' : 'Create Customer'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
