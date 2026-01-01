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
  return (
    <button
      onClick={loginWithGoogle}
      className="px-4 py-2 bg-teal-500 hover:bg-teal-500/50 text-sm text-zinc-50 rounded-lg font-bold transition-colors duration-200 ease-out"
    >
      {text}
    </button>
  );
}
