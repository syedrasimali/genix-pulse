-- Create avatars storage bucket with proper idempotency
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Drop existing policies if they exist (for idempotency)
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Enable RLS on storage.objects
DO $$
BEGIN
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Create policies for avatar uploads
DO $$
BEGIN
  CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
