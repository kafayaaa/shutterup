"use client";

import { useAppSelector } from "@/store/hooks";
import GlassContainer from "./GlassContainer";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardInput from "./DashboardInput";
import { useEffect, useState } from "react";

export default function FiltersSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { brands } = useAppSelector((state) => state.brand);
  const { categories } = useAppSelector((state) => state.category);

  const [minInput, setMinInput] = useState(searchParams.get("min_price") || "");
  const [maxInput, setMaxInput] = useState(searchParams.get("max_price") || "");

  // Debounce Logic untuk Min Price
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (minInput) {
        params.set("min_price", minInput);
      } else {
        params.delete("min_price");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500); // Jeda 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [minInput]);

  // Debounce Logic untuk Max Price
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (maxInput) {
        params.set("max_price", maxInput);
      } else {
        params.delete("max_price");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [maxInput]);

  const getActiveFilters = (key: string) =>
    searchParams.get(key)?.split(",") || [];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = getActiveFilters(key);

    let newFilters: string[];
    if (current.includes(value)) {
      newFilters = current.filter((item) => item !== value);
    } else {
      newFilters = [...current, value];
    }

    if (newFilters.length > 0) {
      params.set(key, newFilters.join(","));
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-30 col-span-3 self-start flex flex-col gap-6">
      {/* ===== BRAND FILTER ===== */}
      <GlassContainer>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Brand</h3>
          <div className="grid grid-cols-2 gap-2">
            {brands.map((brand) => (
              <label
                key={brand.id}
                htmlFor={brand.id}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  name="brand"
                  id={brand.id}
                  checked={getActiveFilters("brand").includes(
                    brand.name.toLowerCase()
                  )}
                  onChange={() =>
                    updateFilters("brand", brand.name.toLowerCase())
                  }
                />{" "}
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      </GlassContainer>

      {/* ===== CATEGORY FILTER ===== */}
      <GlassContainer>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label
                key={category.id}
                htmlFor={category.id}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  name="category"
                  id={category.id}
                  checked={getActiveFilters("category_id").includes(
                    category.id
                  )}
                  onChange={() => updateFilters("category_id", category.id)}
                />{" "}
                {category.name}
              </label>
            ))}
          </div>
        </div>
      </GlassContainer>

      {/* ===== PRICE FILTER ===== */}
      <GlassContainer>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Price</h3>
          <span className="text-xs text-zinc-500">Min</span>
          <div className="relative">
            <input
              type="number"
              placeholder="Rp 0"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>
          <span className="text-xs text-zinc-500">Max</span>
          <div className="relative">
            <input
              type="number"
              placeholder="Rp Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>
      </GlassContainer>
      {searchParams.toString() && (
        <button
          onClick={() => router.push("/products")}
          className="text-xs text-zinc-400 hover:text-white underline text-left mt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
