import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerStatus } from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCustomers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!user,
  });

  const createCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([{ ...customer, user_id: user!.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create customer: ' + error.message);
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update customer: ' + error.message);
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete customer: ' + error.message);
    },
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    error: customersQuery.error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}

export function useCustomer(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Customer | null;
    },
    enabled: !!user && !!id,
  });
}
