import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Interaction, InteractionType } from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useInteractions(customerId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const interactionsQuery = useQuery({
    queryKey: ['interactions', customerId],
    queryFn: async () => {
      let query = supabase
        .from('interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Interaction[];
    },
    enabled: !!user,
  });

  const createInteraction = useMutation({
    mutationFn: async (interaction: { customer_id: string; type: InteractionType; notes: string }) => {
      const { data, error } = await supabase
        .from('interactions')
        .insert([{ ...interaction, user_id: user!.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-interactions'] });
      toast.success('Interaction logged successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to log interaction: ' + error.message);
    },
  });

  const deleteInteraction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('interactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-interactions'] });
      toast.success('Interaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete interaction: ' + error.message);
    },
  });

  return {
    interactions: interactionsQuery.data || [],
    isLoading: interactionsQuery.isLoading,
    error: interactionsQuery.error,
    createInteraction,
    deleteInteraction,
  };
}

export function useRecentInteractions(limit = 5) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-interactions', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          *,
          customers:customer_id (
            id,
            name,
            company
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
