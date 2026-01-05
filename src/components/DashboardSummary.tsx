interface DashboardSummaryProps {
  stats: DashboardStats; // Gunakan interface di sini, bukan any
}

import { DashboardStats } from "@/types";
import GlassContainer from "./GlassContainer";
import LoadingScreen from "./LoadingScreen";

export default function DashboardSummary({ stats }: DashboardSummaryProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `Rp ${stats.revenue.toLocaleString("id")}`,
      color: "text-emerald-500",
    },
    {
      title: "Total Orders",
      value: stats.orderCount.toString(),
      color: "text-sky-500",
    },
    {
      title: "Avg Rating",
      value: `${stats.avgRating} / 5.0`,
      color: "text-yellow-500",
    },
    {
      title: "Low Stock",
      value: stats.lowStockItems.toString(),
      color: "text-rose-500",
    },
  ];

  if (!stats) return <LoadingScreen />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, i) => (
        <GlassContainer key={i} className="p-6 rounded-lg">
          <p className="text-sm text-zinc-400 font-medium">{card.title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h3>
        </GlassContainer>
      ))}
    </div>
  );
}
