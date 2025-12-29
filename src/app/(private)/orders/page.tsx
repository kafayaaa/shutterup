"use client";

import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  const { profile, isLoading: profielLoading } = useAppSelector(
    (state) => state.user
  );
  const { orders, isLoading: ordersLoading } = useAppSelector(
    (state) => state.order
  );

  if (profielLoading) {
    return <LoadingScreen />;
  }

  if (!profile) redirect("/");

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto">
        <div className="pt-30 pb-10 w-full space-y-5">
          <h1 className="text-2xl font-extrabold font-fira-code">
            Orders Page
          </h1>
          <div className="w-full p-5 flex flex-col gap-5 dark:bg-zinc-800 rounded-md border border-zinc-200">
            {ordersLoading ? (
              <div className="w-full py-10 flex items-center justify-center">
                <Loading />
              </div>
            ) : orders.length === 0 ? (
              <div className="w-full py-10 flex items-center justify-center text-xl font-bold">
                No orders found
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="w-full p-5 flex items-center justify-between gap-5 dark:bg-zinc-800 rounded-md shadow-md"
                >
                  <div className="flex flex-col gap-5">
                    {/* ===== ORDER DETAILS ===== */}
                    <div className="flex items-center gap-5">
                      <span className="text-sm text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <div
                        className={`text-xs font-bold font-fira-code px-2 py-0.5 rounded ${
                          order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : order.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : order.status === "shipped"
                            ? "bg-orange-500/20 text-orange-500"
                            : order.status === "delivered"
                            ? "bg-sky-500/20 text-sky-500"
                            : order.status === "canceled"
                            ? "bg-rose-500/20 text-rose-500"
                            : ""
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </div>
                      <span className="text-xs font-fira-code">
                        #{order.id}
                      </span>
                    </div>
                    {/* ===== ORDER ITEMS ===== */}
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="w-full flex gap-5">
                        <div className="aspect-square max-h-20">
                          <Image
                            src={item.products?.image_urls[0] || ""}
                            alt={item.products?.name || "Product Image"}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="font-bold">{item.products?.name}</h2>
                          <span className="font-fira-code text-sm text-zinc-500">
                            {item.quantity} X Rp{" "}
                            {item.price.toLocaleString("id")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="min-w-44 self-end flex flex-col gap-5 p-5 border-l border-zinc-200">
                    <div className="flex flex-col">
                      <p className="text-sm text-zinc-500">Total Price</p>
                      <span className="font-bold font-fira-code">
                        Rp {order.total_price.toLocaleString("id")}
                      </span>
                    </div>
                    <div>
                      <button className="w-full py-2 bg-rose-500 hover:bg-rose-500/75 text-sm text-white font-bold rounded-md cursor-pointer">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
