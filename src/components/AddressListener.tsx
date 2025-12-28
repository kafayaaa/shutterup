"use client";

import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { setAddresses } from "@/store/slices/addressSlice";
import { clearProfile } from "@/store/slices/userSlice";
import { useEffect } from "react";

export default function AddressListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadAddresses = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        dispatch(clearProfile());
        return;
      }

      const { data: addresses, error } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", data.user.id);

      if (!error && addresses) {
        dispatch(setAddresses(addresses));
      }
    };

    loadAddresses();
  }, [dispatch]);
  return null;
}
