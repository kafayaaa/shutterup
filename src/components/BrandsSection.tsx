"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import Loading from "./Loading";
import Link from "next/link";

export default function BrandsSection() {
  const { brands, isLoading, error } = useAppSelector((state) => state.brand);
  if (error) {
    console.error(error);
  }
  return (
    <div className="w-full max-w-11/12 md:max-w-7xl mx-auto py-10 space-y-10">
      <h1 className="max-w-60 md:max-w-full mx-auto text-2xl md:text-4xl font-extrabold font-fira-code text-center">
        Find Your Favourite Brand
      </h1>
      <div className="px-5 md:px-0 grid grid-cols-2 md:grid-cols-5 gap-5">
        {isLoading ? (
          <div className="w-full py-10 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          brands.map((brand) => (
            <Link
              href={`/products?brand=${brand.name.toLowerCase()}`}
              key={brand.id}
              className="col-span-1 min-h-20 md:min-h-28 px-5 py-3 flex items-center justify-center bg-white/5 border border-white/20 inset-shadow-xs inset-shadow-white/50 rounded-lg shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.35)] hover:shadow-[0_1rem_0.75rem_rgba(0,0,0,0.35)] backdrop-blur-lg hover:-translate-y-3 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <Image
                src={brand.logo_url || ""}
                alt={brand.name}
                width={200}
                height={200}
                className="w-full h-full max-h-8/12 object-contain"
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
