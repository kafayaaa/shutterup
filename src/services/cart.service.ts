import { createClient } from "@/lib/supabase/client";
import { CartItem } from "@/types";

export async function getCart(): Promise<CartItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("carts")
    .select(
      `
      id,
      cart_items (
        id,
        product_id,
        quantity,
        price,
        product:products!inner (
          name,
          slug,
          image_urls
        )
      )
    `
    )
    .eq("user_id", user.id)
    .limit(1);

  if (error || !data?.[0]?.cart_items) return [];

  const rawItems = Array.isArray(data[0].cart_items)
    ? data[0].cart_items
    : [data[0].cart_items];

  const items: CartItem[] = rawItems.map((item) => {
    const product = Array.isArray(item.product)
      ? item.product[0]
      : item.product;

    return {
      id: item.id,
      product_id: item.product_id,
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      image: product?.image_urls ?? [],
      price: item.price,
      quantity: item.quantity,
    };
  });

  return items;
}

export async function addToCart(
  productId: string,
  price: number
): Promise<CartItem> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // 1. Ambil cart user
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let cartId = cart?.id;
  if (!cartId) {
    const { data: newCart, error: createCartError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();
    if (createCartError || !newCart) throw new Error("Failed to create cart");
    cartId = newCart.id;
  }

  // 2. Cek apakah product sudah ada di cart
  const { data: existingItem, error: existingItemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();
  if (existingItemError) throw existingItemError;

  let cartItem;
  if (existingItem) {
    // update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id)
      .select()
      .single();
    if (error || !data) throw new Error("Failed to update cart item");
    cartItem = data;
  } else {
    // insert baru
    const { data, error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, price, quantity: 1 })
      .select()
      .single();
    if (error) {
      console.error("DEBUG SUPABASE ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to insert cart item: ${error.message}`);
    }
    cartItem = data;
  }

  // ambil nama & image product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("name, slug, image_urls")
    .eq("id", productId)
    .single();
  if (productError || !product) throw new Error("Failed to fetch product");

  return {
    id: cartItem.id,
    product_id: productId,
    name: product.name,
    slug: product.slug,
    image: product.image_urls ?? [],
    price: cartItem.price,
    quantity: cartItem.quantity,
  };
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to update cart item quantity" + error.message);
  }

  return data;
}

export async function removeCart(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("carts").delete().eq("user_id", userId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to remove cart item" + error.message);
  }

  return true;
}
