"use client";

import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { setOrders } from "@/store/slices/orderSlice";
import { clearProfile } from "@/store/slices/userSlice";
import { useEffect } from "react";

export default function OrderListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        dispatch(clearProfile());
        return;
      }

      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", data.user.id);

      if (!error && orders) {
        dispatch(setOrders(orders));
      }
    };

    loadOrders();
  }, [dispatch]);

  return null;
}
