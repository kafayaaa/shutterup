"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5"; // Pastikan install react-icons
import GlassContainer from "./GlassContainer";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State lokal agar pengetikan lancar (tanpa lag)
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }

      // Update URL
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <GlassContainer className="w-full rounded-full px-3 py-3 md:py-5 md:px-5">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <IoSearchOutline className="text-zinc-500 text-xl" />
        </div>
        <input
          type="text"
          placeholder="Search body or lens..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-white rounded-full pl-10 pr-4 focus:outline-none focus:border-teal-500 transition-all placeholder:text-zinc-600"
        />
      </div>
    </GlassContainer>
  );
}
