import { Interaction, InteractionType } from '@/types/crm';
import { format } from 'date-fns';
import { Phone, Mail, Users, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInteractions } from '@/hooks/useInteractions';

interface InteractionListProps {
  interactions: Interaction[];
  customerId: string;
}

const typeConfig: Record<InteractionType, { icon: typeof Phone; color: string }> = {
  call: { icon: Phone, color: 'text-emerald-600 bg-emerald-50' },
  email: { icon: Mail, color: 'text-blue-600 bg-blue-50' },
  meeting: { icon: Users, color: 'text-purple-600 bg-purple-50' },
  note: { icon: FileText, color: 'text-amber-600 bg-amber-50' },
};

export function InteractionList({ interactions, customerId }: InteractionListProps) {
  const { deleteInteraction } = useInteractions(customerId);

  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No interactions logged yet. Add your first interaction above.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction) => {
        const config = typeConfig[interaction.type];
        const Icon = config.icon;

        return (
          <div
            key={interaction.id}
            className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50 animate-fade-in"
          >
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium capitalize">{interaction.type}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(interaction.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{interaction.notes}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => deleteInteraction.mutate(interaction.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
