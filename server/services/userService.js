const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const serviceClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const userService = {
    async createUser(userData) {
        try {
            const { email, username, password, name } = userData;
            
            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Create user with service role client
            const { data: newUser, error } = await serviceClient
                .from('users')
                .insert([{
                    email,
                    username,
                    name,
                    password_hash,
                    has_password: true,
                    is_phone_verified: false
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Create user error:', error);
            return { success: false, error: error.message };
        }
    },

    async findUserById(userId) {
        try {
            const { data: user, error } = await serviceClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return { success: true, user };
        } catch (error) {
            console.error('Find user error:', error);
            return { success: false, error: error.message };
        }
    }
};

module.exports = userService; 