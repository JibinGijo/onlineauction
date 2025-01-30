const { supabase } = require("../utils/db");

class Auction {
  static async create({ name, image, current_bid, time_left }) {
    const { data, error } = await supabase
      .from("auctions")
      .insert([{ name, image, current_bid, time_left }])
      .select();
    if (error) throw error;
    return data;
  }

  static async getAll() {
    const { data, error } = await supabase.from("auctions").select("*");
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from("auctions")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data;
  }
}

module.exports = Auction;