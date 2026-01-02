import { Link } from 'react-router-dom';
import { Customer } from '@/types/crm';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link to={`/customers/${customer.id}`}>
      <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer border-border/50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{customer.name}</h3>
              {customer.company && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {customer.company}
                </div>
              )}
            </div>
            <StatusBadge status={customer.status} />
          </div>

          <div className="space-y-1.5 text-sm">
            {customer.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.follow_up_date && (
              <div className="flex items-center gap-2 text-accent-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Follow up: {format(new Date(customer.follow_up_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
