const { supabase } = require("../utils/db");

class User {
  static async create({ email, password }) {
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password }])
      .select();
    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = User;