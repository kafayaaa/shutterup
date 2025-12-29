"use client";

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import { orderService } from "@/services/order.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateStatus } from "@/store/slices/orderSlice";
import { OrderStatus } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function DashboardOrdersPage() {
  const { profile } = useAppSelector((state) => state.user);
  const { orders, isLoading, error } = useAppSelector((state) => state.order);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const dispatch = useAppDispatch();

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      dispatch(updateStatus({ id: orderId, status: newStatus }));
      setAlert({ message: "Status updated successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to update status" + err);
    }
  };

  if (!profile) {
    return null;
  }
  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          duration={4000}
          onDismiss={() => setAlert(null)}
        />
      )}
      <div className="w-full flex flex-col gap-5 p-5">
        <div>
          <h1 className="text-2xl font-bold font-heading font-fira-code">
            Order Lists
          </h1>
          <p className="text-zinc-400 text-sm">Manage customer orders.</p>
        </div>
        <div className="w-full p-5 flex flex-col gap-5 border border-zinc-200 rounded-md ">
          {isLoading ? (
            <div className="w-full py-10 flex items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="w-full py-10 flex items-center justify-center text-xl font-bold text-rose-500">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full py-10 flex items-center justify-center text-xl font-bold">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="w-full p-5 flex gap-5 dark:bg-zinc-800 rounded-md shadow-md"
              >
                <div className="w-full flex flex-col">
                  <div className="flex items-center gap-5 text-xs font-fira-code">
                    <span className=" text-zinc-500 ">#{order.id}</span>
                    <span className="">
                      {" "}
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="">
                    {order.shipping_addresses?.recipient_name}
                    {order.shipping_addresses?.phone_number}
                  </div>
                  <div className="">
                    {order.shipping_addresses?.address_line}
                  </div>
                  <div className="">{order.shipping_addresses?.city}</div>
                  <div className="">{order.shipping_addresses?.province}</div>
                  <div className="">
                    {order.shipping_addresses?.postal_code}
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="bg-zinc-700 text-xs p-1 rounded border border-zinc-600 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid (Processing)</option>
                    <option value="shipped">Shipped (On Delivery)</option>
                    <option value="delivered">Delivered (Done)</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
