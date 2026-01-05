"use client";

import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { setCategories } from "@/store/slices/categorySlice";
import { useEffect } from "react";

export default function CategoriesListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select(`*, spec_keys!inner(*)`)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to load categories" + error.message);
        }

        dispatch(setCategories(data ?? []));
      } catch (error) {
        console.error("Load category error:", error);
        dispatch(setCategories([])); // STOP loading
      }
    };

    loadCategories();
  }, [dispatch]);
  return null;
}
