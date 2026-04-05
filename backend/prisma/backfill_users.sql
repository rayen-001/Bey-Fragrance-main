-- 1. Manual Sync of existing users from auth.users to public.users
-- This is a one-time operation to fix existing "Foreign Key" crashes.

DO $$
BEGIN
  INSERT INTO public.users (id, email, password, full_name, role)
  SELECT 
    id, 
    email, 
    'EXTERNAL_AUTH' as password, -- Required by Prisma schema
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'CUSTOMER')::public."Role" as role
  FROM auth.users
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE '✅ Backfill of users completed successfully';
END $$;

-- Confirmation of synced user count
SELECT count(*) as "Synced User Count" FROM public.users WHERE password = 'EXTERNAL_AUTH';
