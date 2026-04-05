-- 1. Create the function to handle new user insertion
-- This function will be called whenever a new user is created in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, password, full_name, role)
  VALUES (
    new.id,
    new.email,
    'EXTERNAL_AUTH', -- Required by Prisma schema, using dummy value for non-local auth
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER')::public."Role"
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
-- After every insert in auth.users, execute the handle_new_user function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Confirmation message
SELECT '✅ Trigger on_auth_user_created created successfully' as status;
