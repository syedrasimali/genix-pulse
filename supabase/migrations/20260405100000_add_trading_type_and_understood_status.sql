-- Add Understood to lead_status enum
ALTER TYPE public.lead_status RENAME TO lead_status_old;

CREATE TYPE public.lead_status AS ENUM ('Pending', 'Contacted', 'Replied', 'Closed', 'Understood');

ALTER TABLE public.leads 
  ALTER COLUMN status TYPE public.lead_status USING status::text::public.lead_status;

DROP TYPE public.lead_status_old;

-- Add trading_type column to leads table
ALTER TABLE public.leads 
ADD COLUMN trading_type TEXT DEFAULT 'General' CHECK (trading_type IN ('Export', 'Import', 'Trading', 'General'));

-- Create index for trading_type for better query performance
CREATE INDEX idx_leads_trading_type ON public.leads(trading_type);
