"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="h-96 flex-[0_0_100%] p-4">
            <Image
              src="https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg"
              alt="Slide 1"
              width={1000}
              height={1000}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="h-96 flex-[0_0_100%] p-4">
            <Image
              src="https://images.pexels.com/photos/1091294/pexels-photo-1091294.jpeg"
              alt="Slide 1"
              width={1000}
              height={1000}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 ml-5 bg-white p-2 rounded-full shadow cursor-pointer"
      >
        <IoIosArrowBack className="text-2xl dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 mr-5 bg-white p-2 rounded-full shadow cursor-pointer"
      >
        <IoIosArrowForward className="text-2xl dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
      </button>
    </div>
  );
}
