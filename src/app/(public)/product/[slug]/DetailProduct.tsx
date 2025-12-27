"use client";

import { addToCart, getCart } from "@/services/cart.service";
import { useAppDispatch } from "@/store/hooks";
import { addCartItem, setCartItems } from "@/store/slices/cartSlice";
import { Product } from "@/types";
import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FaStar, FaTag } from "react-icons/fa6";

export default function DetailProduct({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getCart().then((items) => {
      dispatch(setCartItems(items)); // replace
    });
  }, []);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, product.price);

      const items = await getCart();
      dispatch(setCartItems(items));
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto pt-30 grid grid-cols-2 gap-5">
        {/* ===== IMAGES SECTION ===== */}
        <div className="col-span-1 w-full grid grid-cols-2 gap-3">
          {product.image_urls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full max-h-80 object-cover object-center rounded-lg"
            />
          ))}
        </div>

        <div className="col-span-1 flex flex-col">
          {/* ===== PRODUCT INFO SECTION ===== */}
          <div className="flex flex-col gap-3">
            {/* ===== PRODUCT NAME ===== */}
            <h1 className="text-xl font-extrabold font-fira-code">
              {product.name}
            </h1>
            {/* ===== PRODUCT RATING ===== */}
            <div className="flex items-center text-xs font-fira-code">
              <div className="flex items-center gap-1">
                <FaStar className="text-sm text-amber-400" />
                {product.rating_avg}
              </div>
              <span className="ml-0.5 text-zinc-400 dark:text-zinc-500">
                ({product.rating_count})
              </span>
            </div>
            {/* ===== PRODUCT PRICE ===== */}
            <div className="flex items-center gap-2">
              <FaTag className="text-xl text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-semibold font-fira-code text-teal-600 dark:text-teal-400">
                Rp {product.final_price.toLocaleString("id-ID")}
              </h2>
              <p className="ml-2 text-xs line-through decoration-2 text-zinc-400 dark:text-zinc-500 font-fira-code">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              {product.discount_type === "percentage" && (
                <div className="bg-teal-200 dark:bg-teal-700 rounded px-1 py-0.5">
                  <p className="text-[0.6rem] text-teal-700 dark:text-teal-200 font-fira-code">
                    {product.discount_value}%
                  </p>
                </div>
              )}
            </div>
            {/* ===== ACTION BUTTON ===== */}
            <div className="my-5 flex justify-between gap-5">
              <button
                onClick={handleAddToCart}
                className="w-full py-2 text-sm text-zinc-50 bg-teal-500 hover:bg-teal-500/80 rounded-lg font-extrabold cursor-pointer"
              >
                Add to Cart
              </button>
              <button className="w-full py-2 text-sm text-teal-500 border-2 border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-lg font-extrabold cursor-pointer">
                <p className="text-sm font-fira-code">Buy</p>
              </button>
            </div>
            {/* ===== PRODUCT DESCRIPTION ===== */}
            <div>
              <h2 className="font-bold">Detail Product</h2>
              <p className="text-sm ">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
