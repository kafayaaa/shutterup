import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const orderService = {
  /**
   * Mengambil semua daftar pesanan milik user yang sedang login
   */
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }); // Pesanan terbaru di atas

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil detail satu pesanan beserta item-item di dalamnya
   * Kita menggunakan join table (select order_items yang berelasi)
   */
  async getOrderDetail(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            name,
            image,
            slug
          )
        )
      `
      )
      .eq("id", orderId)
      .single(); // Karena kita hanya mengambil satu data

    if (error) throw error;
    return data;
  },
};
