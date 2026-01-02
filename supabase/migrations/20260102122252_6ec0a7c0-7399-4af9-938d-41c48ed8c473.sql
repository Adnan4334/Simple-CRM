-- Create enum for customer status
CREATE TYPE public.customer_status AS ENUM ('new', 'contacted', 'interested', 'closed');

-- Create enum for interaction type
CREATE TYPE public.interaction_type AS ENUM ('call', 'email', 'meeting', 'note');

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status customer_status NOT NULL DEFAULT 'new',
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interactions table
CREATE TABLE public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type interaction_type NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Users can view their own customers" 
ON public.customers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers" 
ON public.customers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
ON public.customers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
ON public.customers FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for interactions
CREATE POLICY "Users can view their own interactions" 
ON public.interactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" 
ON public.interactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" 
ON public.interactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" 
ON public.interactions FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();