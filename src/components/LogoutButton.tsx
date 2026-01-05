import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { clearProfile } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { RiLogoutCircleLine } from "react-icons/ri";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Bersihkan state (Redux/Context jika ada)
    dispatch(clearProfile());
    router.push("/login");
    router.refresh(); // Penting untuk reset server component
  };
  return (
    // <form action="/logout" method="post">
    <button
      // type="submit"
      onClick={handleLogout}
      className="w-full px-2 py-2 flex items-center justify-center gap-2 bg-rose-500 font-extrabold font-fira-code text-sm text-white rounded-md hover:bg-rose-500/80"
    >
      <RiLogoutCircleLine className="text-2xl" />
    </button>
    // </form>
  );
}
