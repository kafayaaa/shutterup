"use client";

import FiltersSection from "@/components/FiltersSection";
import GlassContainer from "@/components/GlassContainer";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa6";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const brandFilter = searchParams.get("brand")?.split(",") || [];
  const categoryFilter = searchParams.get("category_id")?.split(",") || [];
  const minPrice = Number(searchParams.get("min_price")) || 0;
  const maxPrice = Number(searchParams.get("max_price")) || Infinity;
  const searchKey = searchParams.get("search") || "empty";

  const { products, isLoading } = useAppSelector((state) => state.product);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery);

    // Cek Filter Brand
    const matchesBrand =
      brandFilter.length === 0 ||
      brandFilter.includes(product.brands?.name?.toLowerCase() || "");

    // Cek Filter Category
    const matchesCategory =
      categoryFilter.length === 0 ||
      categoryFilter.includes(product.categories?.id || "");

    const productPrice = product.final_price ?? product.price; // Fallback ke price jika final_price null
    const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

    // Produk harus memenuhi kedua syarat
    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between gap-3">
        <div className="block md:hidden">
          <Dialog>
            <DialogTrigger>
              <GlassContainer className="flex items-center justify-center rounded-full px-4 py-4">
                <FaFilter />
              </GlassContainer>
            </DialogTrigger>
            <DialogContent className="max-h-10/12 overflow-y-scroll">
              <DialogTitle>Filters</DialogTitle>
              <FiltersSection key={searchParams.toString()} />
            </DialogContent>
          </Dialog>
        </div>
        <SearchBar key={searchKey} />
      </div>
      {isLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center">
          <Loading />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
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
          ))}
        </div>
      ) : (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-400">
          <p className="text-xl font-medium">No products found</p>
          <p className="text-sm">Try selecting different filters</p>
        </div>
      )}
    </div>
  );
}
