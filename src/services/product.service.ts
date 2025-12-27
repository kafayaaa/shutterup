import { createClient } from "@/lib/supabase/client";
import { CreateProductInput, UpdateProductPayload } from "@/types/index";

export async function createProduct(data: CreateProductInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      ...data,
      discount_active: data.discount_active ?? false,
      discount_value: data.discount_value ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return product;
}

export async function deleteProduct(productId: string, imageUrls: string[]) {
  const supabase = await createClient();

  /* ============================
   1. HAPUS FILE DI STORAGE
  ============================ */
  if (imageUrls.length > 0) {
    const paths = imageUrls.map((url) => {
      const { pathname } = new URL(url);
      return pathname.replace("/storage/v1/object/public/products/", "");
    });

    const { error: storageError } = await supabase.storage
      .from("products")
      .remove(paths);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      throw storageError;
    }
  }

  /* ============================
   2. HAPUS DATA PRODUCT
  ============================ */
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Delete product error:", error);
    throw error;
  }

  return true;
}

export async function updateProduct(product: UpdateProductPayload) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", product.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
