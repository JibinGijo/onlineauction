const { supabaseAdmin } = require('./db');
const bcrypt = require('bcrypt');

async function ensureAdminExists() {
    try {
        // Check if admin user exists
        const { data: existingAdmin, error: checkError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('username', 'admin')
            .single();

        if (checkError || !existingAdmin) {
            // Create admin user if it doesn't exist
            const password_hash = await bcrypt.hash('admin', 10);
            
            const { error: createError } = await supabaseAdmin
                .from('users')
                .insert([{
                    username: 'admin',
                    email: 'admin@bidbazaar.com',
                    password_hash,
                    name: 'Administrator',
                    is_admin: true,
                    is_phone_verified: true
                }]);

            if (createError) {
                console.error('Error creating admin user:', createError);
            } else {
                console.log('Default admin user created successfully');
            }
        }
    } catch (error) {
        console.error('Error ensuring admin exists:', error);
    }
}

module.exports = ensureAdminExists; 