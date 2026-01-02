import { useState } from 'react';
import { InteractionType } from '@/types/crm';
import { useInteractions } from '@/hooks/useInteractions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Users, FileText, Plus } from 'lucide-react';

interface InteractionFormProps {
  customerId: string;
}

const interactionTypes: { value: InteractionType; label: string; icon: typeof Phone }[] = [
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'note', label: 'Note', icon: FileText },
];

export function InteractionForm({ customerId }: InteractionFormProps) {
  const { createInteraction } = useInteractions(customerId);
  const [type, setType] = useState<InteractionType>('call');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    await createInteraction.mutateAsync({
      customer_id: customerId,
      type,
      notes: notes.trim(),
    });

    setNotes('');
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Log Interaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={type} onValueChange={(v: InteractionType) => setType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interactionTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <div className="flex items-center gap-2">
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the interaction..."
            rows={3}
          />

          <Button
            type="submit"
            className="w-full gradient-primary gap-2"
            disabled={createInteraction.isPending || !notes.trim()}
          >
            <Plus className="w-4 h-4" />
            Log Interaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
