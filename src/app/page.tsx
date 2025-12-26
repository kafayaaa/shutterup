import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-10 ">
      <Navbar />
      <div className="pt-30 w-full max-w-7xl mx-auto flex flex-col items-center gap-10">
        <Carousel />
        <div className="w-full grid grid-cols-5 gap-3">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}
