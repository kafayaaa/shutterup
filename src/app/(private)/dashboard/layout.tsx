import SideBar from "@/components/SideBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DahsboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen flex">
      <div className="relative w-60 hidden lg:block">
        <div className="sticky left-0 inset-y-0 z-10 w-full">
          <SideBar />
        </div>
      </div>
      <div className="w-full">
        <div className="lg:hidden fixed inset-x-0 top-0 w-full bg-zinc-50 dark:bg-zinc-800 shadow-md">
          <SideBar />
        </div>
        {children}
      </div>
    </div>
  );
}
