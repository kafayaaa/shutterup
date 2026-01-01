import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function submitProductReview(
  productId: string,
  rating: number,
  review?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("product_reviews").upsert(
    {
      product_id: productId,
      user_id: user.id,
      rating,
      review,
    },
    {
      onConflict: "product_id,user_id",
    }
  );

  if (error) throw new Error(error.message);
}

export const reviewService = {
  /**
   * Mengambil semua ulasan untuk produk tertentu
   */
  async getAllProductReviews() {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *,
        users (
          full_name,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
  /**
   * Mengambil semua ulasan untuk produk tertentu
   */
  async getProductReviews(productId: string) {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *,
        users (
          full_name,
          avatar_url
        )
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * User membuat review baru
   */
  async createReview(payload: {
    product_id: string;
    user_id: string;
    order_id?: string;
    rating: number;
    comment: string;
    images?: string[];
    is_anonymous?: boolean;
  }) {
    const { data, error } = await supabase
      .from("product_reviews")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin membalas ulasan
   */
  async replyToReview(reviewId: string, replyMessage: string) {
    const { data, error } = await supabase
      .from("product_reviews")
      .update({
        admin_reply: replyMessage,
        replied_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil ulasan yang belum dibalas (untuk Dashboard Admin)
   */
  async getPendingReviews() {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *,
        products (name),
        users (full_name)
      `
      )
      .is("admin_reply", null)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },
};
