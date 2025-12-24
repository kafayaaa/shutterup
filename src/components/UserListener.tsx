"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { clearProfile, setProfile } from "@/store/slices/userSlice";

export default function UserListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        dispatch(clearProfile());
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!error && profile) {
        dispatch(setProfile(profile));
      }
    };

    loadUser();
  }, [dispatch]);

  return null;
}
