import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const orderService = {
  /**
   * Mengambil semua daftar pesanan milik user yang sedang login
   */
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            name,
            image_urls,
            slug
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

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
            image_urls,
            slug
          )
        )
      `
      )
      .eq("id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllOrdersForAdmin() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      shipping_addresses (*), 
      order_items (*, products (*))
    `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin Fetch Error:", error);
      throw error;
    }
    return data;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: "pending" | "paid" | "shipped" | "delivered" | "canceled"
  ) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
