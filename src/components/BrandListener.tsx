"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createClient } from "@/lib/supabase/client";
import { setBrands } from "@/store/slices/brandSlice";

export default function ProductListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to load product" + error.message);
        }

        dispatch(setBrands(data ?? []));
      } catch (error) {
        console.error("Load brands error:", error);
        dispatch(setBrands([])); // STOP loading
      }
    };

    loadBrands();
  }, [dispatch]);

  return null;
}
