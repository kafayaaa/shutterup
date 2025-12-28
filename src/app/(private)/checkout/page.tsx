"use client";

import Script from "next/script";
import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { useState } from "react";
import Alert from "@/components/Alert";
import { clearCart } from "@/store/slices/cartSlice";
import { removeCart } from "@/services/cart.service";
import { createClient } from "@/lib/supabase/client";
import { BiCircle, BiLoaderAlt } from "react-icons/bi";

export default function CheckoutPage() {
  const { profile, isLoading: profielLoading } = useAppSelector(
    (state) => state.user
  );
  const { items, isLoading: cartLoading } = useAppSelector(
    (state) => state.cart
  );

  const { addresses, isLoading: addressLoading } = useAppSelector(
    (state) => state.address
  );
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const supabase = createClient();

  if (profielLoading) {
    return <LoadingScreen />;
  }

  if (!profile) redirect("/");

  const defaultAddress = addresses.find((addr) => addr.is_default);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = 15000; // Contoh ongkir flat
  const total = subtotal + shippingFee;

  const handlePayment = async () => {
    if (!profile || !profile.email) {
      setAlert({
        message: "Email not found. Please complete your profile.",
        type: "error",
      });
      return;
    }
    setLoading(true); // Gunakan state loading yang sudah Anda punya

    // Buat array items dari keranjang
    const itemDetails = items.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    // TAMBAHKAN ONGKIR KE DALAM DAFTAR ITEM
    itemDetails.push({
      id: "SHIPPING_FEE",
      price: shippingFee,
      quantity: 1,
      name: "Shipping Fee",
    });

    const orderData = {
      orderId: `ORDER-${Date.now()}`, // ID unik sederhana
      amount: total,
      customerDetails: {
        first_name: defaultAddress?.recipient_name,
        email: profile.email,
        phone: defaultAddress?.phone_number,
        address: defaultAddress?.address_line,
      },
      items: itemDetails,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.token) {
        // @ts-expect-error (Mengabaikan error TS karena snap dipanggil dari script eksternal)
        window.snap.pay(data.token, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: async function (result: any) {
            setLoading(true);
            try {
              // Siapkan data items sesuai format yang dibutuhkan SQL (p_items)
              const orderItems = items.map((item) => ({
                product_id: item.product_id, // Pastikan ini UUID product
                quantity: item.quantity,
                price: item.price,
              }));

              // Panggil fungsi RPC di Supabase
              const { data: orderId, error } = await supabase.rpc(
                "create_order_and_clear_cart",
                {
                  p_user_id: profile.id,
                  p_total_price: total,
                  p_items: orderItems,
                }
              );

              if (error) throw error;

              // Jika berhasil di database, baru update UI
              dispatch(clearCart());
              setAlert({
                message: "Payment Successful! Order has been placed.",
                type: "success",
              });

              // Redirect ke halaman detail pesanan
              router.push(`/orders`);
            } catch (err) {
              console.error("Database Error:", err);
              setAlert({
                message: "Failed to save order to database",
                type: "error",
              });
            } finally {
              setLoading(false);
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPending: function (result: any) {
            setAlert({ message: "Payment Pending!", type: "info" });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: function (result: any) {
            setAlert({ message: "Payment Failed!", type: "error" });
          },
          onClose: function () {
            setAlert({ message: "Payment Cancelled!", type: "error" });
          },
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        message: "An error occurred, please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full min-h-screen">
        <Navbar />
        <div className="w-full max-w-7xl mx-auto">
          <div className="pt-30 pb-10 w-full grid grid-cols-12 gap-7">
            <div className="col-span-12">
              <h1 className="text-2xl font-extrabold font-fira-code">
                Checkout
              </h1>
            </div>
            <div className="col-span-8 flex flex-col gap-7">
              {/* ===== SHIPPING ADDRESS ===== */}
              <div className="w-full p-5 dark:bg-zinc-800 rounded-md shadow-md">
                <h2 className="font-bold mb-3">Shipping Address</h2>
                {addressLoading ? (
                  <div className="w-full py-10 flex justify-center items-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <BsPersonLinesFill />
                      <p>{defaultAddress?.recipient_name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaPhone />
                      <p>{defaultAddress?.phone_number}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaLocationDot />
                      <div>
                        <p>{defaultAddress?.address_line}</p>
                        <p>{defaultAddress?.city}</p>
                        <p>{defaultAddress?.province}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* ===== CART ITEMS ===== */}
              <div className="w-full p-5 dark:bg-zinc-800 rounded-md shadow-md">
                <h2 className="font-bold mb-3">Cart Items</h2>
                {cartLoading ? (
                  <div className="w-full py-10 flex justify-center items-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.image[0]}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p>{item.name}</p>
                            <p className="text-sm text-zinc-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-fira-code font-extrabold">
                          Rp. {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ===== PAYMENT METHOD ===== */}
            <div className="col-span-4">
              <div className="w-full p-5 flex flex-col gap-5 dark:bg-zinc-800 rounded-md shadow-md">
                <h2 className="font-bold border-b pb-2">Order Summary</h2>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Rp. {shippingFee.toLocaleString()}</span>
                  </div>
                  <hr className="border-zinc-700" />
                  <div className="flex justify-between font-extrabold text-lg text-teal-500">
                    <span>Total</span>
                    <span>Rp. {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!defaultAddress || items.length === 0 || loading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-md transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-full flex justify-center items-center gap-2">
                      <div className="relative h-8 w-8 text-3xl">
                        <BiCircle className="absolute top-0 left-0 text-white" />
                        <BiLoaderAlt className="absolute top-0 left-0 z-10 animate-spin text-teal-500/60" />
                      </div>
                      <p>Processing...</p>
                    </div>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>

                {!defaultAddress && (
                  <p className="text-xs text-rose-500 text-center mt-2">
                    Please add a shipping address first.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
    </>
  );
}
