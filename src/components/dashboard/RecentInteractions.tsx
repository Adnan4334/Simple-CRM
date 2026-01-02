import { Link } from 'react-router-dom';
import { useRecentInteractions } from '@/hooks/useInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Users, FileText, ArrowRight, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { InteractionType } from '@/types/crm';

const typeIcons: Record<InteractionType, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  note: FileText,
};

export function RecentInteractions() {
  const { data: interactions, isLoading } = useRecentInteractions(5);

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Recent Interactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !interactions?.length ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No interactions logged yet
          </p>
        ) : (
          <div className="space-y-3">
            {interactions.map((interaction: any) => {
              const Icon = typeIcons[interaction.type as InteractionType];
              return (
                <Link
                  key={interaction.id}
                  to={`/customers/${interaction.customer_id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-accent text-accent-foreground">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-medium text-foreground truncate">
                        {interaction.customers?.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(interaction.created_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{interaction.notes}</p>
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
