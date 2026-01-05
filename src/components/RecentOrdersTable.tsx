import { Order } from "@/types";
import GlassContainer from "./GlassContainer";

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <GlassContainer className="p-6 rounded-lg">
      <h2 className="text-xl font-bold font-fira-code mb-6 text-white">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-zinc-500 text-sm border-b border-white/10">
            <tr>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-300">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 last:border-none"
              >
                <td className="py-4">
                  <p className="font-medium">
                    {order.user?.full_name || "Guest"}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase">
                    {order.id.slice(0, 8)}
                  </p>
                </td>
                <td className="py-4 font-fira-code text-teal-500">
                  Rp {order.total_price.toLocaleString("id")}
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-zinc-500/20 text-zinc-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassContainer>
  );
}
