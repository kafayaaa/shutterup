"use client";

import { createClient } from "@/lib/supabase/client";

interface Props {
  text: string;
}

const supabase = createClient();

const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/callback?next=/dashboard`,
    },
  });
};

export default function OAuthButton({ text }: Props) {
  return <button onClick={loginWithGoogle}>{text}</button>;
}
