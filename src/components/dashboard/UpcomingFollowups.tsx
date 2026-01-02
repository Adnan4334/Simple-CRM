import { Link } from 'react-router-dom';
import { Customer } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/customers/StatusBadge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface UpcomingFollowupsProps {
  customers: Customer[];
}

export function UpcomingFollowups({ customers }: UpcomingFollowupsProps) {
  const followups = customers
    .filter((c) => c.follow_up_date)
    .sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime())
    .slice(0, 5);

  const getDateLabel = (date: string) => {
    const d = new Date(date);
    if (isPast(d) && !isToday(d)) return { label: 'Overdue', className: 'text-destructive' };
    if (isToday(d)) return { label: 'Today', className: 'text-amber-600' };
    if (isTomorrow(d)) return { label: 'Tomorrow', className: 'text-primary' };
    return { label: format(d, 'MMM d'), className: 'text-muted-foreground' };
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Follow-ups
        </CardTitle>
        <Link
          to="/customers"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {followups.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No upcoming follow-ups scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {followups.map((customer) => {
              const dateInfo = getDateLabel(customer.follow_up_date!);
              return (
                <Link
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{customer.name}</p>
                    {customer.company && (
                      <p className="text-sm text-muted-foreground truncate">{customer.company}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={customer.status} />
                    <span className={`text-sm font-medium ${dateInfo.className}`}>
                      {dateInfo.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
