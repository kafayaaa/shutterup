"use client";

import Alert from "@/components/Alert";
import GlassContainer from "@/components/GlassContainer";
import Loading from "@/components/Loading";
import SideBar from "@/components/SideBar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orderService } from "@/services/order.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCancelReason, updateStatus } from "@/store/slices/orderSlice";
import { OrderStatus } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { BiCircle, BiLoaderAlt } from "react-icons/bi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

export default function DashboardOrdersPage() {
  const { profile } = useAppSelector((state) => state.user);
  const {
    orders,
    isLoading: ordersLoading,
    error,
  } = useAppSelector((state) => state.order);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setIsSubmitting(true);
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);

      // Pastikan response ada nilainya
      if (response) {
        // Kita gunakan status dari response DB agar sinkron
        dispatch(updateStatus({ id: orderId, status: response.status }));

        if (response.status === "canceled" || response.status === "delivered") {
          dispatch(clearCancelReason(orderId));
        }

        setAlert({
          message: `Status updated to ${response.status} successfully!`,
          type: "success",
        });
      }

      setSelectedOrderId(null);
    } catch (err) {
      setAlert({ message: "Failed to update status", type: "error" });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = async (orderId: string) => {
    setIsSubmitting(true);

    try {
      await orderService.updateOrderCancelReason(orderId, null);
      setAlert({ message: "Cancellation request rejected!", type: "info" });
      setSelectedOrderId(null);
      dispatch(clearCancelReason(orderId));
    } catch (err) {
      setAlert({ message: "Failed to reject cancellation", type: "error" });
      console.error("Failed to reject cancellation" + err);
    } finally {
      setIsSubmitting(false);
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
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading font-fira-code">
              Order Lists
            </h1>
            <p className="text-zinc-400 text-sm">Manage customer orders.</p>
          </div>
        </div>
        <div className="w-full p-5 flex flex-col gap-5 border border-zinc-200 dark:border-zinc-700 rounded-md ">
          {ordersLoading ? (
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
              <GlassContainer key={order.id}>
                <div className="space-y-5">
                  {/* ===== ORDER HEADER ===== */}
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
                  </div>
                  {/* ===== ORDER DETAILS ===== */}
                  <div className="w-full flex justify-between gap-5">
                    {/* ===== ORDER SHIPPING ADDRESS ===== */}
                    <div className="w-full flex flex-col gap-5">
                      <h2 className="font-extrabold font-fira-code">
                        Order Shipping Address
                      </h2>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <BsFillPersonLinesFill />
                          <span>
                            {order.shipping_addresses?.recipient_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <FaPhone />
                          <span>{order.shipping_addresses?.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <FaLocationDot />
                          <div className="flex flex-col">
                            <span>
                              {order.shipping_addresses?.address_line}
                            </span>
                            <span>{order.shipping_addresses?.city}</span>
                            <span>{order.shipping_addresses?.province}</span>
                            <span>{order.shipping_addresses?.postal_code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ===== ORDER ITEMS ===== */}
                    <div className="w-full px-5 border-x border-zinc-200 dark:border-zinc-700">
                      <h2 className="font-bold font-fira-code mb-5">
                        Order Items
                      </h2>

                      <div className="flex flex-col gap-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <Image
                                src={item.products?.image_urls[0] || ""}
                                alt={item.products?.name || ""}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div>
                                <p>{item.products?.name}</p>
                                <p className="text-sm text-zinc-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-fira-code font-extrabold">
                              Rp. {item.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-fit px-5 space-y-5">
                      {/* ===== ORDER STATUS ===== */}
                      <h2 className="font-extrabold font-fira-code">
                        Order Status
                      </h2>
                      {order.status !== "delivered" &&
                      order.status !== "canceled" &&
                      order.cancel_reason ? (
                        <Dialog
                          open={selectedOrderId === order.id}
                          onOpenChange={(open) =>
                            setSelectedOrderId(open ? order.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <button className="w-full py-2 bg-rose-500 hover:bg-rose-500/75 text-sm text-white font-bold rounded-md cursor-pointer">
                              Review Request
                            </button>
                          </DialogTrigger>
                          <DialogContent
                            className="max-w-sm border-none dark:bg-zinc-800"
                            onInteractOutside={(e) => e.preventDefault()}
                          >
                            <DialogTitle className="hidden"></DialogTitle>
                            <div className="mt-5 flex flex-col justify-center gap-5 text-center">
                              <h1 className="text-2xl font-extrabold font-fira-code">
                                Confirm Cancellation
                              </h1>
                              <p>{order.cancel_reason}</p>
                            </div>
                            <div className="my-5 flex justify-between gap-5 w-2/3 mx-auto font-bold">
                              <button
                                onClick={() => handleRejectCancel(order.id)}
                                disabled={isSubmitting}
                                className="w-full py-2 border border-rose-500 text-rose-500 hover:bg-rose-100 hover:dark:bg-rose-900/20 rounded-md cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id, "canceled")
                                }
                                disabled={isSubmitting}
                                className="w-full py-2 flex items-center justify-center bg-rose-500 hover:bg-rose-500/80 text-white rounded-md cursor-pointer"
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 text-3xl">
                                      <BiCircle className="absolute top-0 left-0 text-white" />
                                      <BiLoaderAlt className="absolute top-0 left-0 z-10 animate-spin text-rose-500/70" />
                                    </div>
                                    <p>Loading...</p>
                                  </div>
                                ) : (
                                  "Accept"
                                )}
                              </button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <select
                          disabled={
                            order.status === "canceled" ||
                            order.status === "delivered"
                          }
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className="text-sm p-1 rounded border outline-none bg-zinc-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid (Processing)</option>
                          <option value="shipped">Shipped (On Delivery)</option>
                          <option value="delivered">Delivered (Done)</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </GlassContainer>
            ))
          )}
        </div>
      </div>
    </>
  );
}
