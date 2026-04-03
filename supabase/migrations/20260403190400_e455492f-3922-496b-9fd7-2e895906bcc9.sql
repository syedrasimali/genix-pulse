
DROP POLICY "Users can view their own leads" ON public.leads;
CREATE POLICY "All authenticated users can view all leads" ON public.leads
FOR SELECT TO authenticated
USING (true);
