import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  const { profile, isLoading: profielLoading } = useAppSelector(
    (state) => state.user
  );

  if (profielLoading) {
    return <LoadingScreen />;
  }

  if (!profile) redirect("/");

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto">
        <div className="pt-30 pb-10 w-full">
          <h1 className="text-2xl font-extrabold font-fira-code">
            Orders Page
          </h1>
          {/* Konten halaman pesanan akan ditambahkan di sini */}
        </div>
      </div>
    </div>
  );
}
