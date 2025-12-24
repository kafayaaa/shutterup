import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/index";

export async function createProduct(data: Product) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      ...data,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return product;
}
