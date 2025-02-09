const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials in environment variables');
}

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test the connection
async function testConnection() {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('count');
        
        if (error) throw error;
        console.log('Supabase connection successful');
    } catch (error) {
        console.error('Supabase connection error:', error);
        throw error;
    }
}

testConnection();

module.exports = { supabase, supabaseAdmin };

// Remove or comment out the old PostgreSQL functions since we're using Supabase now