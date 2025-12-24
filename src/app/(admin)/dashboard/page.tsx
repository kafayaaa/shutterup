import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: user } = await supabase.from("users").select("*").single();
  return (
    <div className="w-full p-5 flex flex-col gap-10">
      <h1>Ini Dashboard</h1>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
}
