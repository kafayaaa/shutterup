"use client";
import DashboardList from "@/components/DashboardList";
import DashboardSummary from "@/components/DashboardSummary";
import GlassContainer from "@/components/GlassContainer";
import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import RecentOrdersTable from "@/components/RecentOrdersTable";
import {
  getDashboardData,
  getDashboardStats,
} from "@/services/summary.service";
import { useAppSelector } from "@/store/hooks";
import { DashboardData, DashboardStats, Order } from "@/types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { profile, isLoading: profileLoading } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    async function initDashboard() {
      try {
        setIsLoading(true);
        const res = await getDashboardData();
        setData(res);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initDashboard();
  }, []);

  if (isLoading) return <LoadingScreen />;

  if (!profile) {
    redirect("/");
  }

  if (!data)
    return (
      <div className="p-10 text-white text-center">Failed to load data.</div>
    );

  return (
    <div className="w-full h-full p-5 space-y-8 min-h-screen">
      <h1 className="text-2xl font-bold font-fira-code text-white">
        Dashboard Overview
      </h1>

      {/* 1. Memanggil Kartu Statistik */}
      <DashboardSummary stats={data.stats} />

      {/* 2. Susunan Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kanan: List Produk (Lebar 1/3) */}

        <DashboardList
          title="Low Stock Alert"
          items={data.lowStock}
          type="stock"
        />

        <DashboardList
          title="Top Selling Products"
          items={data.topSelling}
          type="sold"
        />

        {/* Kolom Kiri: Tabel Pesanan Terbaru (Lebar 2/3) */}
        <div className="col-span-2">
          <RecentOrdersTable orders={data.recentOrders} />
        </div>
      </div>
    </div>
  );
}
