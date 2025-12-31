"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const { products, isLoading } = useAppSelector((state) => state.product);
  const readyProducts = products.filter((product) => product.stock > 0);

  return (
    <div className="relative w-full min-h-screen flex flex-col gap-10 ">
      <Navbar />
      <Hero />
      <div className="pt-30 w-full max-w-7xl mx-auto flex flex-col items-center gap-10">
        <div className="w-full grid grid-cols-5 gap-3">
          {isLoading ? (
            <div className="col-span-5 flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            readyProducts.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image_urls={product.image_urls}
                rating_avg={product.average_rating}
                rating_count={product.review_count}
                sold={product.sold}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
