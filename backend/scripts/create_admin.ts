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
  const adminEmail = 'admin@beyfragrance.com';
  const adminPassword = 'admin1234';

  console.log(`🚀 Creating admin user: ${adminEmail}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: { 
      role: 'admin',
      full_name: 'Bey Fragrance Admin'
    },
    app_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('✅ Admin already exists! Updating role to make sure it is correct...');
        // Find user first to get their ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const user = users?.find(u => u.email === adminEmail);
        
        if (user) {
            const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: { role: 'admin' },
                app_metadata: { role: 'admin' }
            });
            if (updateError) console.error('❌ Failed to update role:', updateError.message);
            else console.log('✅ Role updated successfully!');
        }
    } else {
        console.error('❌ Error creating admin:', error.message);
    }
  } else {
    console.log('🎉 Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  }
}

createAdmin();
