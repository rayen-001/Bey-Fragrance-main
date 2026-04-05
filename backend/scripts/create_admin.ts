import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Supabase URL or Service Role Key is missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const newAdminEmail = 'admin@hamafragrance.com';
  const newAdminPassword = 'Hama@Fragrance&2026#Secure!';
  const oldAdminEmail = 'admin@beyfragrance.com';

  console.log(`🧹 Cleaning up old admin if it exists: ${oldAdminEmail}...`);
  try {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const oldUser = users?.find(u => u.email === oldAdminEmail);
    if (oldUser) {
      await supabase.auth.admin.deleteUser(oldUser.id);
      console.log('✅ Old admin account deleted.');
    }
  } catch (err) {
    console.log('ℹ️ Old admin account not found or already deleted.');
  }

  console.log(`🚀 Creating/Updating admin user: ${newAdminEmail}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: newAdminEmail,
    password: newAdminPassword,
    email_confirm: true,
    user_metadata: { 
      role: 'admin',
      full_name: 'Hama Fragrance Admin'
    },
    app_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('✅ Admin already exists! Updating role and password...');
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const user = users?.find(u => u.email === newAdminEmail);
        
        if (user) {
            await supabase.auth.admin.updateUserById(user.id, {
                password: newAdminPassword,
                user_metadata: { role: 'admin' },
                app_metadata: { role: 'admin' }
            });
            console.log('✅ Account updated successfully!');
        }
    } else {
        console.error('❌ Error creating admin:', error.message);
    }
  } else {
    console.log('🎉 Admin user created successfully!');
  }
  
  console.log(`📧 Email: ${newAdminEmail}`);
  console.log(`🔑 Password: ${newAdminPassword}`);
}

createAdmin();
