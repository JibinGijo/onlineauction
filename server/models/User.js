const { supabaseAdmin } = require('../utils/db');

const User = {
    async findByEmail(email) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (error) throw error;
        return data;
    },
    
    async findById(id) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return data;
    }
};

module.exports = User;