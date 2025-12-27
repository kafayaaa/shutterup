"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setProducts } from "@/store/slices/productSlice";
import { supabasePublic } from "@/lib/supabase/public";

export default function ProductListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("products")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to load product" + error.message);
        }

        dispatch(setProducts(data ?? []));
      } catch (error) {
        console.error("Load products error:", error);
        dispatch(setProducts([])); // STOP loading
      }
    };

    loadProducts();
  }, [dispatch]);

  return null;
}
