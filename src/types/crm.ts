export type CustomerStatus = 'new' | 'contacted' | 'interested' | 'closed';
export type InteractionType = 'call' | 'email' | 'meeting' | 'note';

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: CustomerStatus;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  customer_id: string;
  user_id: string;
  type: InteractionType;
  notes: string;
  created_at: string;
}

export interface CustomerWithInteractions extends Customer {
  interactions: Interaction[];
}
