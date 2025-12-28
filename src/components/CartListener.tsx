"use client";

import { createClient } from "@/lib/supabase/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartItems } from "@/store/slices/cartSlice";
import { CartItem } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SupabaseCartResponse {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
  products: {
    name: string;
    slug: string;
    image_urls: string[];
  };
}

export default function CartListener() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const loadCarts = async () => {
      // Tunggu sampai profile benar-benar ada
      if (!profile) {
        dispatch(setCartItems([]));
        return;
      }

      try {
        // 1. Ambil data cart berdasarkan user_id
        const { data: cart, error: cartError } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", profile.id)
          .maybeSingle(); // Menggunakan maybeSingle lebih aman daripada array

        if (cartError) throw cartError;

        // Jika user belum punya cart sama sekali di DB
        if (!cart) {
          console.log("User has no cart record yet");
          dispatch(setCartItems([]));
          return;
        }

        // 2. Ambil items berdasarkan cart_id yang ditemukan
        const { data, error: cartItemsError } = await supabase
          .from("cart_items")
          .select(
            "id, product_id, price, quantity, products(name, slug, image_urls)"
          )
          .eq("cart_id", cart.id)
          .order("created_at", { ascending: false });

        if (cartItemsError) throw cartItemsError;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedItems: CartItem[] = (data as any[]).map((item) => {
          const p = item.products;
          if (!p || !p.slug) {
            console.error("Produk tidak memiliki slug untuk item ID:", item.id);
          }

          return {
            id: item.id,
            product_id: item.product_id,
            name: p?.name || "No Name",
            slug: p?.slug || "", // Beri string kosong jika slug hilang
            image: p?.image_urls || [],
            price: item.price,
            quantity: item.quantity,
          };
        });

        dispatch(setCartItems(formattedItems));
      } catch (error) {
        console.error("Load cart items error:", error);
        dispatch(setCartItems([]));
      }
    };

    loadCarts();

    // TAMBAHKAN profile di sini agar trigger ulang saat user login/logout
  }, [dispatch, profile, pathname]);

  return null;
}
