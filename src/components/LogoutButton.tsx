import { createClient } from "@/lib/supabase/client";
import { RiLogoutCircleLine } from "react-icons/ri";

export default function LogoutButton() {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();

    window.location.href = "/";
  };
  return (
    <button
      onClick={handleLogout}
      className="w-full px-2 py-2 flex items-center justify-center gap-2 bg-rose-500 font-extrabold font-fira-code text-sm text-white rounded-md hover:bg-rose-500/80"
    >
      <RiLogoutCircleLine className="text-2xl" />
    </button>
  );
}
