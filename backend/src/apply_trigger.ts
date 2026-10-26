import * as fs from 'fs';
import * as path from 'path';
import { prisma } from './db/prisma';

async function applyTrigger() {
  const sqlPath = path.resolve('./prisma/user_sync_trigger.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // We need to split the SQL into statements and execute them individually because 
  // Prisma $executeRawUnsafe might have issues executing multiple statements at once.
  
  try {
    console.log('Applying trigger function...');
    // Role is always CUSTOMER: raw_user_meta_data is user-controlled at signup
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = ''
      AS $$
      BEGIN
        INSERT INTO public.users (id, email, password, full_name, role, updated_at)
        VALUES (
          new.id,
          new.email,
          'EXTERNAL_AUTH',
          COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'New User'),
          'CUSTOMER'::public."Role",
          now()
        );
        RETURN new;
      END;
      $$;
    `);

    console.log('Revoking API access to trigger function...');
    await prisma.$executeRawUnsafe(`REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;`);

    console.log('Dropping old trigger if exists...');
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);

    console.log('Creating trigger...');
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

    console.log('✅ Trigger applied successfully!');
  } catch (error) {
    console.error('Failed to apply trigger:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyTrigger();
