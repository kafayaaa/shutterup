"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

interface Props {
  slug: string;
  name: string;
  price: number;
  image_urls: string[];
  rating_avg: number;
  rating_count: number;
  sold: number;
}

export default function ProductCard({
  slug,
  name,
  price,
  image_urls,
  rating_avg,
  rating_count,
  sold,
}: Props) {
  return (
    <Link
      href={`/product/${slug}`}
      className="w-full min-w-40 p-3 md:p-4 flex flex-col items-center gap-5 rounded-lg transition-discrete transition-all duration-200 ease-in-out bg-white/5 border border-white/10 inset-shadow-sm inset-shadow-white/80 shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.35)] hover:shadow-[0_1rem_0.75rem_rgba(0,0,0,0.35)] backdrop-blur-lg hover:-translate-y-3"
    >
      <Image
        src={image_urls[0]}
        alt={name}
        width={300}
        height={300}
        className="w-full h-full object-cover object-center rounded-md"
      />
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm truncate">{name}</h2>
        <h1 className="font-extrabold font-fira-code">
          Rp {price.toLocaleString("id-ID")}
        </h1>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <FaStar className="text-yellow-400" />
            <p>
              {rating_avg} ({rating_count})
            </p>
          </div>
          <div>
            <p>{sold} sold</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
