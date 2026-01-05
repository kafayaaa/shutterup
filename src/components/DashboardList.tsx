import { Product } from "@/types";
import GlassContainer from "./GlassContainer";

interface DashboardListProps {
  title: string;
  items: Product[];
  type: "stock" | "sold";
}

export default function DashboardList({
  title,
  items,
  type,
}: DashboardListProps) {
  return (
    <GlassContainer className="p-6 rounded-lg">
      <h3 className="font-bold mb-4 font-fira-code text-lg text-white">
        {title}
      </h3>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-zinc-500 text-sm">No data available</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-white/5 pb-2"
            >
              <div className="max-w-37.5">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-zinc-500">
                  Rp {item.final_price.toLocaleString("id")}
                </p>
              </div>
              <div className="text-right">
                {type === "stock" ? (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      item.stock <= 3
                        ? "bg-rose-500/20 text-rose-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {item.stock} Qty
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-1 rounded bg-teal-500/20 text-teal-400">
                    {item.sold} Sold
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </GlassContainer>
  );
}
