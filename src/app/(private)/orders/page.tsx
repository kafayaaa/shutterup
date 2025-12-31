"use client";

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { reviewService } from "@/services/review.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCancelReason } from "@/store/slices/orderSlice";
import { addReview } from "@/store/slices/reviewSlice";
import { Order } from "@/types";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiCircle, BiLoaderAlt } from "react-icons/bi";
import { MdCheckCircle, MdRateReview } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";

export default function OrdersPage() {
  const { profile, isLoading: profielLoading } = useAppSelector(
    (state) => state.user
  );
  const { orders, isLoading: ordersLoading } = useAppSelector(
    (state) => state.order
  );
  const {
    productReviews,
    pendingReviews,
    isLoading: reviewsLoading,
  } = useAppSelector((state) => state.review);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReasonMessage, setCancelReasonMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");

  const dispatch = useAppDispatch();
  const supabase = createClient();

  if (profielLoading) {
    return <LoadingScreen />;
  }

  if (!profile) redirect("/");

  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReasonMessage) return;

    setIsSubmitting(true);
    try {
      // 1. Simpan ke Database (Supabase)
      const { error } = await supabase
        .from("orders")
        .update({ cancel_reason: cancelReasonMessage })
        .eq("id", selectedOrderId);

      if (error) {
        console.error("Supabase error:", error);
      }

      // 2. Update Redux agar UI sinkron
      dispatch(
        setCancelReason({ id: selectedOrderId, reason: cancelReasonMessage })
      );

      setAlert({ message: "Cancel request sent!", type: "success" });
      setSelectedOrderId(null); // Tutup dialog
      setCancelReasonMessage("");
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to send request", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReview = async (order: Order) => {
    if (rating === 0) {
      setAlert({ message: "Please select a rating star", type: "error" });
      return;
    }

    // Pastikan order_items ada dan tidak kosong
    if (!order.order_items || order.order_items.length === 0) {
      setAlert({ message: "No items found in this order", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verifikasi ke database
      const { data: existingReview } = await supabase
        .from("product_reviews")
        .select("id")
        .eq("order_id", order.id)
        .maybeSingle(); // maybeSingle lebih aman daripada single() jika data mungkin nol

      if (existingReview) {
        setAlert({
          message: "You have already reviewed this order",
          type: "info",
        });
        setSelectedOrderId(null);
        return;
      }

      const payload = {
        product_id: order.order_items[0].product_id,
        user_id: profile.id,
        order_id: order.id,
        rating,
        comment: reviewMessage,
      };

      const response = await reviewService.createReview(payload);
      dispatch(addReview(response));

      // Opsional: Jika Anda ingin mengupdate state order secara lokal agar tombol langsung berubah
      // dispatch(markOrderAsReviewed(order.id));

      setAlert({ message: "Review submitted successfully!", type: "success" });
      setSelectedOrderId(null);
      setRating(0);
      setReviewMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setAlert({
          message: err.message || "Failed to submit review",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          duration={4000}
          onDismiss={() => setAlert(null)}
        />
      )}
      <Navbar />
      <div className="w-full max-w-7xl mx-auto">
        <div className="pt-30 pb-10 w-full space-y-5">
          <h1 className="text-2xl font-extrabold font-fira-code">
            Orders List
          </h1>
          <div className="w-full p-5 flex flex-col gap-5 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-none">
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
                  className="w-full p-5 flex items-center justify-between gap-5 dark:bg-zinc-700 rounded-md shadow-md"
                >
                  <div className="flex flex-col gap-5">
                    {/* ===== ORDER DETAILS ===== */}
                    <div className="flex items-center gap-5">
                      <span className="text-xs font-fira-code">
                        #{order.id}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
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
                          <span className="font-fira-code text-sm text-zinc-500 dark:text-zinc-400">
                            {item.quantity} X Rp{" "}
                            {item.price.toLocaleString("id")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="min-w-56 self-end flex flex-col gap-5 p-5 border-l border-zinc-200 dark:border-zinc-600">
                    <div className="flex flex-col">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Total Price
                      </p>
                      <span className="font-bold font-fira-code">
                        Rp {order.total_price.toLocaleString("id")}
                      </span>
                    </div>
                    <div>
                      {/* ==== CANCEL ORDER ==== */}
                      {order.status !== "delivered" &&
                        order.status !== "canceled" && (
                          <Dialog
                            open={selectedOrderId === order.id}
                            onOpenChange={(open) =>
                              setSelectedOrderId(open ? order.id : null)
                            }
                          >
                            {order.cancel_reason ? (
                              <button className="w-full py-2 bg-zinc-300 text-sm text-zinc-600 font-bold rounded-md cursor-not-allowed">
                                Request Sent
                              </button>
                            ) : (
                              <DialogTrigger asChild>
                                <button className="w-full py-2 bg-rose-500 hover:bg-rose-500/75 text-sm text-white font-bold rounded-md cursor-pointer">
                                  Cancel Order
                                </button>
                              </DialogTrigger>
                            )}
                            <DialogContent
                              className="[&>button]:hidden max-w-sm border-none dark:bg-zinc-800"
                              onInteractOutside={(e) => e.preventDefault()}
                            >
                              <DialogTitle className="hidden">
                                Remove Item
                              </DialogTitle>
                              <div className="flex justify-center">
                                <PiWarningCircle className="text-7xl text-rose-500" />
                              </div>
                              <div className="text-center space-y-2">
                                <p>Are you sure to cancel your order?</p>
                                <p className="text-sm">
                                  Please write down the reason why you want to
                                  cancel the order.
                                </p>
                                <textarea
                                  value={cancelReasonMessage}
                                  onChange={(e) =>
                                    setCancelReasonMessage(e.target.value)
                                  }
                                  className="w-full mt-2 h-32 px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-600 rounded-md resize-none"
                                />
                              </div>
                              <div className="my-5 flex justify-between gap-5 w-2/3 mx-auto font-bold">
                                <button
                                  onClick={() => setSelectedOrderId(null)}
                                  className="w-full py-2 border border-rose-500 text-rose-500 hover:bg-rose-100 hover:dark:bg-rose-900/20 rounded-md cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleCancelOrder}
                                  disabled={isSubmitting}
                                  className="w-full py-2 flex items-center justify-center bg-rose-500 hover:bg-rose-500/80 text-white rounded-md cursor-pointer"
                                >
                                  {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                      <div className="relative h-8 w-8 text-3xl">
                                        <BiCircle className="absolute top-0 left-0 text-white" />
                                        <BiLoaderAlt className="absolute top-0 left-0 z-10 animate-spin text-rose-500/70" />
                                      </div>
                                      <p>Sending...</p>
                                    </div>
                                  ) : (
                                    "Send"
                                  )}
                                </button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                      {/* ==== REVIEW PRODUCT ==== */}
                      {order.status === "delivered" && (
                        <>
                          {/* Cek apakah order ini sudah pernah direview */}
                          {productReviews.some(
                            (r) => r.order_id === order.id
                          ) ? (
                            <button
                              disabled
                              className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-sm text-zinc-400 font-bold rounded-md cursor-default flex items-center justify-center gap-2"
                            >
                              <MdCheckCircle className="text-lg text-zinc-600" />
                              Review Submitted
                            </button>
                          ) : (
                            <Dialog
                              open={selectedOrderId === order.id}
                              onOpenChange={(open) =>
                                setSelectedOrderId(open ? order.id : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <button className="w-full py-2 bg-teal-500 hover:bg-teal-500/80 text-sm text-white font-bold rounded-md cursor-pointer flex items-center justify-center gap-2">
                                  <MdRateReview className="text-lg" />
                                  Review
                                </button>
                              </DialogTrigger>

                              <DialogContent className="max-w-md border-none dark:bg-zinc-800">
                                <DialogTitle className="text-xl font-bold font-fira-code">
                                  Give Your Review
                                </DialogTitle>

                                <div className="space-y-4 py-4">
                                  {/* Rating Stars */}
                                  <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm font-medium">
                                      How was the product?
                                    </p>
                                    <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          onClick={() => setRating(star)}
                                          className={`text-3xl cursor-pointer ${
                                            rating >= star
                                              ? "text-yellow-400"
                                              : "text-zinc-400"
                                          }`}
                                        >
                                          {rating >= star ? (
                                            <AiFillStar />
                                          ) : (
                                            <AiOutlineStar />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Comment Box */}
                                  <div className="space-y-2">
                                    <label className="text-sm">
                                      Your Experience
                                    </label>
                                    <textarea
                                      placeholder="Share your experience about this product..."
                                      value={reviewMessage}
                                      onChange={(e) =>
                                        setReviewMessage(e.target.value)
                                      }
                                      className="w-full h-32 px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-600 rounded-md resize-none focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end gap-3 font-bold">
                                  <button
                                    onClick={() => handleAddReview(order)}
                                    disabled={
                                      isSubmitting ||
                                      rating === 0 ||
                                      reviewMessage.length < 5
                                    }
                                    className="px-6 py-2 bg-teal-500 hover:bg-teal-500/80 text-white rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                  >
                                    {isSubmitting ? (
                                      <BiLoaderAlt className="animate-spin" />
                                    ) : (
                                      "Submit Review"
                                    )}
                                  </button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </>
                      )}
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
