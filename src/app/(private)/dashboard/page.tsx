"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { profile, isLoading } = useAppSelector((state) => state.user);

  if (isLoading) return <LoadingScreen />;

  if (!profile) {
    redirect("/");
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-9xl font-extrabold font-fira-code">Dashboard</h1>
    </div>
  );
}
