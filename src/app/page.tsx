"use client";

import BrandsSection from "@/components/BrandsSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProductListSection from "@/components/ProductListSection";
import PromoSection from "@/components/PromoSection";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full bg-linear-to-bl from-zinc-700 via-zinc-900 to-zinc-700">
        <Hero />
        <PromoSection />
        <BrandsSection />
        <ProductListSection />
        <Footer />
      </div>
    </div>
  );
}
