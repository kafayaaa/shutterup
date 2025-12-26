"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { setProducts } from "@/store/slices/productSlice";

export default function ProductListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error: errorUser } = await supabase.auth.getUser();
      if (!data.user) {
        throw new Error(errorUser?.message);
      }

      const { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (!error && products) {
        dispatch(setProducts(products));
      }
    };

    loadProducts();
  }, [dispatch]);

  return null;
}
