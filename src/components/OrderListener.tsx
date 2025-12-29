"use client";

import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import {
  setOrders,
  setOrderLoading,
  setOrderError,
} from "@/store/slices/orderSlice";
import { clearProfile } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { orderService } from "@/services/order.service"; // Import service

export default function OrderListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadOrders = async () => {
      dispatch(setOrderLoading(true));

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        dispatch(clearProfile());
        dispatch(setOrderLoading(false));
        return;
      }

      // Ambil role dari user_metadata (bukan user.role)
      const userRole = user.user_metadata?.role;

      try {
        let ordersData;

        if (userRole === "admin") {
          // Gunakan service admin untuk mengambil SEMUA order + items
          ordersData = await orderService.getAllOrdersForAdmin();
        } else {
          // Gunakan service user untuk mengambil order milik sendiri + items
          ordersData = await orderService.getUserOrders(user.id);
        }

        if (ordersData) {
          dispatch(setOrders(ordersData));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error loading orders:", error);
          dispatch(setOrderError(error.message));
        }
      } finally {
        dispatch(setOrderLoading(false));
      }
    };

    loadOrders();
  }, [dispatch, supabase]);

  return null;
}
