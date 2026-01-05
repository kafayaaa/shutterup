"use client";

import { addToCart, getCart } from "@/services/cart.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartItems } from "@/store/slices/cartSlice";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FaStar, FaTag } from "react-icons/fa6";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import { BiCircle, BiLoaderAlt } from "react-icons/bi";
import { ProductRating } from "@/components/ProductRating";
import { reviewService } from "@/services/review.service";
import { setProductReviews } from "@/store/slices/reviewSlice";
import { formatDate } from "@/utils/dateFornat";

export default function DetailProduct({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { profile } = useAppSelector((state) => state.user);
  const { productReviews } = useAppSelector((state) => state.review);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [quantity, setQuantity] = useState(1);
  const [addToCartloading, setAddToCartLoading] = useState(false);
  const [buyNowloading, setBuyNowLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image_urls[0]);

  const reviews = productReviews.filter((r) => r.product_id === product.id);

  useEffect(() => {
    getCart().then((items) => {
      dispatch(setCartItems(items)); // replace
    });
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Pastikan Anda sudah membuat service ini sebelumnya
        const data = await reviewService.getProductReviews(product.id);
        dispatch(setProductReviews(data));
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (product?.id) {
      fetchReviews();
    }
  }, [product.id, dispatch]);

  const handleAddToCart = async () => {
    if (!profile) {
      setAlertMessage(`Please sign in first to add products to your cart`);
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    try {
      setAddToCartLoading(true);
      await addToCart(product.id, product.price);

      const items = await getCart();
      dispatch(setCartItems(items));
      setAlertMessage(`Successfully added ${product.name} to your cart!`);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
      setAlertMessage(`Failed to add ${product.name} to your cart!`);
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!profile) {
      setAlertMessage("Please sign in first to buy products");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Validasi stok
    if (quantity > product.stock) {
      setAlertMessage("Not enough stock available");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      setBuyNowLoading(true);
      // Tambahkan ke cart dengan quantity yang dipilih
      await addToCart(product.id, product.final_price, quantity);

      // Update store cart agar checkout mendapatkan data terbaru
      const items = await getCart();
      dispatch(setCartItems(items));

      // Langsung arahkan ke checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Buy now failed:", error);
      setAlertMessage("Something went wrong");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setBuyNowLoading(false);
    }
  };

  const dismissAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full max-w-11/12 md:max-w-7xl mx-auto pt-28 md:pt-40 pb-20 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ===== ALERT ===== */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            onDismiss={dismissAlert}
            duration={4000}
          />
        )}
        {/* ===== IMAGES SECTION ===== */}
        <div className="col-span-1 w-full flex flex-col gap-4">
          {/* AREA GAMBAR BESAR */}
          <div className="w-full aspect-square overflow-hidden rounded-2xl bg-zinc-800/50 border border-white/10">
            <Image
              src={selectedImage}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
          </div>

          {/* LIST THUMBNAILS */}
          <div className="w-full flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.image_urls.map((url, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(url)} // Klik untuk ganti gambar besar
                className={`aspect-square w-20 md:min-w-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === url
                    ? "border-teal-500 scale-95"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`${product.name} preview ${index}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
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
                {product.average_rating}
              </div>
              <span className="ml-0.5 text-zinc-400 dark:text-zinc-500">
                ({product.review_count})
              </span>
              <span className="ml-3">{product.sold} sold</span>
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
            {/* ===== VALUES / QUANTITY CONTROL ===== */}
            <div className="mt-5 flex flex-col gap-2">
              <p className="text-sm font-bold">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg w-max">
                  <button
                    disabled={quantity === 0}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-fira-code border-x border-zinc-300 dark:border-zinc-700 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity === 0}
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Stock: <span className="font-bold">{product.stock}</span>
                </p>
              </div>
            </div>

            {/* ===== ACTION BUTTON ===== */}
            <div className="my-5 flex justify-between gap-5">
              <button
                onClick={handleAddToCart}
                disabled={addToCartloading}
                className={`w-full py-2 flex items-center justify-center text-sm rounded-lg font-extrabold text-zinc-50 bg-teal-500 hover:bg-teal-500/80 ${
                  addToCartloading ? "pointer-events-none" : " cursor-pointer"
                }`}
              >
                {addToCartloading ? (
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 text-3xl">
                      <BiCircle className="absolute top-0 left-0 text-zinc-200 dark:text-zinc-700" />
                      <BiLoaderAlt className="absolute top-0 left-0 z-10 animate-spin text-teal-500" />
                    </div>
                    <p>Adding...</p>
                  </div>
                ) : (
                  <p className="text-sm font-fira-code">Add to Cart</p>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={buyNowloading}
                className={`w-full flex items-center justify-center py-2 text-sm border-2 rounded-lg font-extrabold text-teal-500 border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 ${
                  buyNowloading ? "pointer-events-none" : "cursor-pointer"
                }`}
              >
                {buyNowloading ? (
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 text-3xl">
                      <BiCircle className="absolute top-0 left-0 text-zinc-200 dark:text-zinc-700" />
                      <BiLoaderAlt className="absolute top-0 left-0 z-10 animate-spin text-teal-500" />
                    </div>
                    <p>Processing...</p>
                  </div>
                ) : (
                  <p className="text-sm font-fira-code">Buy Now</p>
                )}
              </button>
            </div>
            {/* ===== PRODUCT DESCRIPTION ===== */}
            <div className="pb-5 border-b border-zinc-700">
              <h2 className="font-bold">Detail Product</h2>
              <p className="text-sm ">{product.description}</p>
            </div>
            {/* ===== PRODUCT DIMENSIONS & WEIGHT ===== */}
            <div className="pb-5">
              <h2 className="font-bold mb-2">Dimensions & Weight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 md:gap-y-2 text-sm">
                <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                  <span className="text-zinc-400 text-xs uppercase">
                    WEIGHT
                  </span>
                  <span className="text-zinc-200 font-medium text-sm">
                    {product.weight}g
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                  <span className="text-zinc-400 text-xs uppercase">
                    Size (l x w x h)
                  </span>
                  <span className="text-zinc-200 font-medium text-sm">
                    {product.length} x {product.width} x {product.height} mm
                  </span>
                </div>
              </div>
            </div>
            {/* ===== PRODUCT SPECIFICATIONS ===== */}
            <div className="pb-5">
              <h2 className="font-bold mb-3">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 md:gap-y-2">
                {product.product_specs &&
                Object.keys(product.product_specs).length > 0 ? (
                  Object.entries(product.product_specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-zinc-700/50 pb-1"
                    >
                      <span className="text-zinc-400 text-xs uppercase">
                        {key}
                      </span>
                      <span className="text-zinc-200 font-medium text-sm">
                        {String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 italic text-xs">
                    No specifications available
                  </p>
                )}
              </div>
            </div>
            {/* ===== PRODUCT REVIEWS ===== */}
            <div className="flex flex-col">
              <div>
                <h1 className="font-bold">Reviews</h1>
              </div>
              {reviews.length > 0 && (
                <div className="pb-5 border-b border-zinc-200 flex flex-col gap-1">
                  <span className="text-sm text-zinc-600">Overall Rating</span>
                  <ProductRating
                    rating={product.average_rating}
                    count={product.review_count}
                    size={25}
                  />
                </div>
              )}
              <div className="flex flex-col gap-6 mt-4">
                {reviews.length > 0 ? (
                  reviews.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-zinc-100 pb-4"
                    >
                      <div className="flex justify-between items-start">
                        <ProductRating
                          rating={item.rating}
                          count={1}
                          size={14}
                        />
                        <span className="text-[10px] text-zinc-400">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <p className="text-xs font-bold mt-1">
                        by {item.users?.full_name || "Customer"}
                      </p>
                      <p className="text-sm text-zinc-600 mt-1">
                        {item.comment}
                      </p>

                      {/* Render balasan admin jika ada */}
                      {item.admin_reply && (
                        <div className="mt-3 ml-4 p-3 bg-zinc-50 rounded-lg border-l-4 border-teal-500">
                          <p className="text-xs font-bold text-teal-600">
                            Admin Response:
                          </p>
                          <p className="text-sm italic text-zinc-600">
                            {item.admin_reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">
                    There is no reviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
