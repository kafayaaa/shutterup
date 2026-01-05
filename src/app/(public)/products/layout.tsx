"use client";

import FiltersSection from "@/components/FiltersSection";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();

  return (
    <div className="w-full min-h-screen pt-27 md:pt-40 pb-10 md:pb-20 bg-linear-to-tr from-zinc-900 via-zinc-800 to-zinc-900">
      <Navbar />
      <div className="w-full max-w-11/12 md:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="hidden md:block col-span-3">
          <FiltersSection key={searchParams.toString()} />
        </div>
        <div className="col-span-1 md:col-span-9">{children}</div>
      </div>
    </div>
  );
}
