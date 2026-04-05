-- =============================================================
-- DIAGNOSTIC: Check orders with NULL user_id
-- Run this in your Supabase SQL editor to see the damage
-- =============================================================

-- 1. Count how many orders have no user linked
SELECT 
  COUNT(*) FILTER (WHERE user_id IS NULL)     AS "Orders with NULL userId",
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) AS "Orders with valid userId",
  COUNT(*)                                     AS "Total Orders"
FROM public.orders;

-- 2. View the orphaned orders (no userId)
SELECT 
  o.id,
  o.client_name,
  o.phone_number,
  o.created_at,
  o.status,
  o.total_amount
FROM public.orders o
WHERE o.user_id IS NULL
ORDER BY o.created_at DESC
LIMIT 50;

-- 3. Check which Supabase users exist in public.users vs auth.users
SELECT 
  a.id AS supabase_uid,
  a.email,
  CASE WHEN u.id IS NOT NULL THEN 'EXISTS in public.users' ELSE 'MISSING from public.users' END AS sync_status
FROM auth.users a
LEFT JOIN public.users u ON u.id = a.id
ORDER BY sync_status;

-- =============================================================
-- BACKFILL: Sync missing auth.users into public.users
-- Run this BEFORE the next step if any users are missing above
-- =============================================================
DO $$
BEGIN
  INSERT INTO public.users (id, email, password, full_name, role, created_at, updated_at)
  SELECT 
    a.id,
    a.email,
    'EXTERNAL_AUTH',
    COALESCE(a.raw_user_meta_data->>'full_name', a.raw_user_meta_data->>'name', split_part(a.email, '@', 1)),
    COALESCE(a.raw_user_meta_data->>'role', 'CUSTOMER')::public."Role",
    NOW(),
    NOW()
  FROM auth.users a
  WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = a.id);

  RAISE NOTICE '✅ Backfill complete';
END $$;

-- =============================================================
-- OPTIONAL: Manually backfill userId on orders by phone/name
-- Only run if you KNOW which user placed those orders.
-- Replace the values below with real data from your admin panel.
-- =============================================================
-- UPDATE public.orders
-- SET user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
-- WHERE phone_number = '+213XXXXXXXXX'
--   AND user_id IS NULL;

-- =============================================================
-- VERIFY: After backfill, confirm everything is linked
-- =============================================================
SELECT 
  COUNT(*) FILTER (WHERE user_id IS NULL)     AS "Still NULL (orphaned)",
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) AS "Now linked to a user",
  COUNT(*)                                     AS "Total"
FROM public.orders;
