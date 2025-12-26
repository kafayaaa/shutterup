import { createClient } from "@/lib/supabase/client";

export async function submitProductReview(
  productId: string,
  rating: number,
  review?: string
) {
  const supabase = await createClient();

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
