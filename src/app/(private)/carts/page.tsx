"use client";

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decrementQuantity,
  incrementQuantity,
  removeCartItem,
} from "@/store/slices/cartSlice";
import { CartItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";

export default function CartsPage() {
  const { profile, isLoading: profileLoading } = useAppSelector(
    (state) => state.user
  );
  const { items, isLoading } = useAppSelector((state) => state.cart);
  const { products } = useAppSelector((state) => state.product);

  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const dispatch = useAppDispatch();
  const supabase = createClient();

  const availableStock = (id: string) => {
    const product = products.find((p) => p.id === id);
    return product ? product.stock : 0;
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;

    // 1. Update di Redux (Optimistic Update agar UI cepat)
    if (newQty > items.find((i) => i.id === id)!.quantity) {
      dispatch(incrementQuantity(id));
    } else {
      dispatch(decrementQuantity(id));
    }

    // 2. Update di Supabase
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", id);

    if (error) {
      console.error("Gagal update quantity:", error.message);
      // Jika gagal, sebaiknya panggil fetch ulang atau kembalikan state
    }
  };

  const handleRemoveItem = async (id: string) => {
    handleClose();
    dispatch(removeCartItem(id));
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) console.error("Gagal delete item:", error.message);
  };

  if (profileLoading) return <LoadingScreen />;

  return (
    <div className="w-full">
      <Navbar />

      {/* ===== ALERT ===== */}
      {!profile && (
        <Alert
          message="Please sign in first to see your cart"
          type="error"
          duration={4000}
        />
      )}

      <div className="pt-30 w-full max-w-7xl mx-auto grid grid-cols-12 gap-5">
        {!profile ? (
          <div className="col-span-12 text-center mt-10">
            You are not logged in.
          </div>
        ) : isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <div className="col-span-12 text-center mt-10">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="col-span-12 font-extrabold font-fira-code text-2xl">
              Your Cart
            </div>
            <div className="col-span-8 flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.slug}`}
                  className="p-5 dark:bg-zinc-800 rounded-md shadow-md"
                >
                  <div className="flex justify-between items-center gap-5">
                    <Link
                      href={item.slug ? `/product/${item.slug}` : "#"}
                      className={`flex gap-5 ${
                        !item.slug ? "pointer-events-none" : ""
                      }`}
                    >
                      <Image
                        src={item.image[0]}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover"
                      />
                      <div>
                        <h1 className="font-semibold">{item.name}</h1>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Available Stock: {availableStock(item.product_id)}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-bold font-fira-code">
                        Rp {item.price.toLocaleString("id")}
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-200 ease-out cursor-pointer"
                        >
                          <FaTrash className="text-rose-500" />
                        </button>
                        <div className="rounded-full border px-4 py-2 flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="cursor-pointer font-bold disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <div className="min-w-10 flex items-center justify-center ">
                            {item.quantity}
                          </div>
                          <button
                            disabled={
                              item.quantity >= availableStock(item.product_id)
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                Math.min(
                                  availableStock(item.product_id),
                                  item.quantity + 1
                                )
                              )
                            }
                            className="cursor-pointer font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Dialog
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
              >
                <DialogContent
                  className="[&>button]:hidden max-w-sm border-none dark:bg-zinc-800"
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <DialogTitle className="hidden">Remove Item</DialogTitle>
                  <div className="flex justify-center">
                    <PiWarningCircle className="text-7xl text-rose-500" />
                  </div>
                  <div className="text-center">
                    Are you sure you want to remove <br />
                    <span className="font-extrabold text-rose-500">
                      {selectedItem?.name}
                    </span>
                    <br />
                    from your cart?
                  </div>
                  <div className="my-5 flex justify-between gap-5 w-2/3 mx-auto font-bold">
                    <button
                      onClick={handleClose}
                      className="w-full py-2 border border-rose-500 text-rose-500 hover:bg-rose-100 hover:dark:bg-rose-900/20 rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        selectedItem && handleRemoveItem(selectedItem.id)
                      }
                      className="w-full py-2 bg-rose-500 hover:bg-rose-500/80 text-white rounded-md cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-3 p-5 dark:bg-zinc-800 rounded-md shadow-md">
                <div className="font-semibold">Order Summary</div>
                <div className="flex justify-between mt-2">
                  <span>Total</span>
                  <span className="font-extrabold font-fira-code">
                    Rp{" "}
                    {items
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      ) // Harga * Qty
                      .toLocaleString("id")}
                  </span>
                </div>
                <div className="mt-3 w-full py-2 flex items-center justify-center rounded-md bg-teal-500 hover:bg-teal-500/80 text-zinc-50 font-extrabold cursor-pointer">
                  <Link href="/checkout" className="">
                    Checkout Now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
