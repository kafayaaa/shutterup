import { useAppSelector } from "@/store/hooks";
import Loading from "./Loading";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function ProductListSection() {
  const { products, isLoading } = useAppSelector((state) => state.product);
  const newArrival = products
    .filter((product) => product.stock > 0)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="w-full max-w-11/12 md:max-w-7xl mx-auto py-10 flex flex-col items-center gap-10 overflow-clip">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-extrabold font-fira-code">
          New Arrival
        </h1>
        <Link
          href={"/products"}
          className="flex items-center gap-2 text-sm md:text-base hover:text-teal-500"
        >
          <span>See All</span>
          <FaArrowRight />
        </Link>
      </div>
      <div className="w-full py-3 flex gap-6 overflow-x-scroll hide-scrollbar">
        {isLoading ? (
          <div className="col-span-5 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          newArrival.map((product) => (
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
  );
}
