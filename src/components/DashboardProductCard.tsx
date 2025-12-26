"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaPenToSquare, FaStar, FaTag, FaTrash } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch } from "@/store/hooks";
import { deleteProduct } from "@/services/product.service";
import { removeProduct } from "@/store/slices/productSlice";

interface Props {
  id: string;
  name: string;
  category: "body" | "lens" | "fullset" | "accessories";
  price: number;
  stock: number;
  image_urls: string[];
  description: string;
  status: "active" | "inactive";
  condition: "new" | "used";
  rating_avg: number;
  rating_count: number;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  discount_active: boolean;
  final_price: number;
}

export default function DashboardProductCard({
  id,
  name,
  category,
  price,
  stock,
  image_urls,
  description,
  status,
  condition,
  rating_avg,
  rating_count,
  discount_type,
  discount_value,
  discount_active,
  final_price,
}: Props) {
  const [detail, setDetail] = useState(false);
  const handleDetail = () => setDetail(!detail);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    const confirm = window.confirm(`Yakin ingin menghapus produk "${name}"?`);

    if (!confirm) return;

    try {
      await deleteProduct(id, image_urls);
      dispatch(removeProduct(id));
      alert("Produk berhasil dihapus");
    } catch (error) {
      alert("Gagal menghapus produk");
    }
  };
  return (
    <>
      <tr
        onClick={handleDetail}
        className="hover:bg-zinc-300/20 dark:hover:bg-zinc-700/20 transition-colors group cursor-pointer"
      >
        {/* Name & Image */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Image
              src={image_urls[0]}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
            />
            <div className="w-full">
              <div className="font-bold truncate">{name}</div>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4">
          <span className="px-2 py-1 bg-teal-500 text-zinc-50 rounded text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </td>

        {/* Stock */}
        <td className="px-6 py-4 font-fira-code text-sm">
          {stock <= 5 ? (
            <span className="text-rose-400 font-bold">{stock} (Low)</span>
          ) : (
            <span>{stock}</span>
          )}
        </td>

        {/* Price & Discount */}
        <td className="px-6 py-4">
          <div className="flex flex-col font-fira-code">
            <span className="text-sm font-bold">
              Rp{final_price.toLocaleString()}
            </span>
          </div>
        </td>

        {/* Rating */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1">
            <FaStar size={14} fill="currentColor" className="text-amber-400" />
            <span className="text-sm font-bold">{rating_avg}</span>
          </div>
        </td>
      </tr>
      <tr className={`${detail ? "table-row" : "hidden"}`}>
        <td colSpan={6} className="px-6 py-4">
          <div className="w-full flex gap-6 border border-zinc-200 dark:border-zinc-700 rounded p-5">
            <div className="self-center relative w-96 max-h-96 overflow-hidden rounded">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {image_urls.map((image, index) => (
                    <div key={index} className="h-full flex-[0_0_100%]">
                      <Image
                        src={image}
                        alt={name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover object-center rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow cursor-pointer"
              >
                <IoIosArrowBack className="text-base dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
              </button>

              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow cursor-pointer"
              >
                <IoIosArrowForward className="text-base dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
              </button>
            </div>
            <div className="relative w-full flex gap-6">
              {/* Text Description */}
              <div className="w-full max-w-1/3 space-y-5">
                <div className="overflow-hidden">
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Description
                  </h1>
                  <p className="max-w-80 text-zinc-500 leading-relaxed text-sm text-clip text-wrap">
                    {description}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Condition
                  </h1>
                  <p className="text-zinc-500 leading-relaxed text-sm">
                    {condition === "new" ? "New" : "Second"}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Status
                  </h1>
                  <p className="text-zinc-500 leading-relaxed text-sm">
                    {status === "active" ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              {/* Price Detail */}
              <div className="w-full">
                <h1 className="text-base font-bold mb-1 font-heading">
                  Price Detail
                </h1>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Original Price: Rp {price.toLocaleString()}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Status: {discount_active ? "Active" : "Inactive"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Type:{" "}
                  {discount_type === "percentage"
                    ? "Percentage"
                    : discount_type === "fixed"
                    ? "Nominal"
                    : "-"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Value:{" "}
                  {discount_type === "percentage"
                    ? `${discount_value}%`
                    : discount_type === "fixed"
                    ? `Rp ${discount_value.toLocaleString()}`
                    : "-"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Final Price: Rp {final_price.toLocaleString()}
                </p>
              </div>
              {/* Rating Detail */}
              <div className="w-full">
                <h1 className="text-base font-bold mb-1 font-heading">
                  Rating Detail
                </h1>
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <p>Overall Rating:</p>
                  <FaStar
                    size={14}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                  <span className="text-sm font-bold">{rating_avg}</span>
                </div>
                <div className="text-sm text-zinc-500">
                  <p>Rating Count: {rating_count}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-fit flex items-center gap-3 text-base text-zinc-50">
                <button className="p-2 rounded-full shadow bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 transition-colors duration-200 ease-out">
                  <FaPenToSquare />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full shadow bg-rose-400 dark:bg-rose-700 hover:bg-rose-500 transition-colors duration-200 ease-out"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
