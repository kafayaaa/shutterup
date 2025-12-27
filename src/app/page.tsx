"use client";

import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/store/hooks";
export default function Home() {
  const { products, isLoading } = useAppSelector((state) => state.product);

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 ">
      <Navbar />
      <div className="pt-30 w-full max-w-7xl mx-auto flex flex-col items-center gap-10">
        <Carousel />
        <div className="w-full grid grid-cols-5 gap-3">
          {isLoading ? (
            <div className="col-span-5 flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image_urls={product.image_urls}
                rating_avg={product.rating_avg}
                rating_count={product.rating_count}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
