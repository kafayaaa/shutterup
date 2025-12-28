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
      <div className="relative w-60 ">
        <div className="sticky left-0 inset-y-0 z-10 w-full">
          <SideBar />
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
