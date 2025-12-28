"use client";

import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaLocationDot, FaPhone } from "react-icons/fa6";

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

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto">
        <div className="pt-30 pb-10 w-full grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <h1 className="text-2xl font-extrabold font-fira-code">Checkout</h1>
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
                disabled={!defaultAddress || items.length === 0}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-md transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
              >
                Proceed to Payment
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
  );
}
