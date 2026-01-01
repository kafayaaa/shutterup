"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-52 md:h-160 overflow-hidden">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {[
            "https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg",
            "https://images.pexels.com/photos/1091294/pexels-photo-1091294.jpeg",
            "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
          ].map((src, index) => (
            <div key={index} className="h-52 md:h-160 flex-[0_0_100%]">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={1000}
                height={1000}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 ml-2 md:ml-5 bg-white/80 p-1.5 md:p-2 rounded-full shadow shadow-inset-xs inset-shadow-white/50 backdrop-blur-md"
      >
        <IoIosArrowBack className="text-xl md:text-2xl text-zinc-950 hover:text-teal-500 transition-colors" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 mr-2 md:mr-5 bg-white/80 p-1.5 md:p-2 rounded-full shadow shadow-inset-xs inset-shadow-white/50 backdrop-blur-md"
      >
        <IoIosArrowForward className="text-xl md:text-2xl text-zinc-950 hover:text-teal-500 transition-colors" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-6 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
