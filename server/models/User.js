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

  static async isAdmin(email) {
    const { data, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data.is_admin;
  }

  static async updateMobile(email, mobile) {
    const { data, error } = await supabase
      .from("users")
      .update({ mobile })
      .eq("email", email)
      .select();
    if (error) throw error;
    return data;
  }

  static async changePassword(email, newPassword) {
    const { data, error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("email", email)
      .select();
    if (error) throw error;
    return data;
  }
}

module.exports = User;