import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCustomer, useCustomers } from '@/hooks/useCustomers';
import { useInteractions } from '@/hooks/useInteractions';
import { StatusBadge } from '@/components/customers/StatusBadge';
import { InteractionForm } from '@/components/interactions/InteractionForm';
import { InteractionList } from '@/components/interactions/InteractionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Building2, Mail, Phone, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id);
  const { deleteCustomer } = useCustomers();
  const { interactions } = useInteractions(id);

  const handleDelete = async () => {
    if (id) {
      await deleteCustomer.mutateAsync(id);
      navigate('/customers');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-foreground mb-2">Customer not found</h2>
          <p className="text-muted-foreground mb-4">This customer may have been deleted.</p>
          <Link to="/customers">
            <Button>Back to Customers</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{customer.name}</CardTitle>
                  <StatusBadge status={customer.status} />
                </div>
                {customer.company && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    {customer.company}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/customers/${customer.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {customer.name}? This action cannot be undone and will also delete all related interactions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {customer.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={`mailto:${customer.email}`} className="text-sm text-primary hover:underline">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a href={`tel:${customer.phone}`} className="text-sm text-primary hover:underline">
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                )}
                {customer.follow_up_date && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Follow-up Date</p>
                      <p className="text-sm">{format(new Date(customer.follow_up_date), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Added</p>
                    <p className="text-sm">{format(new Date(customer.created_at), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Notes</p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractionList interactions={interactions} customerId={customer.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <InteractionForm customerId={customer.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
