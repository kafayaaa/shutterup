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
}

export default function ProductCard({
  slug,
  name,
  price,
  image_urls,
  rating_avg,
  rating_count,
}: Props) {
  return (
    <Link
      href={`/product/${slug}`}
      className="w-full p-3 flex flex-col items-center justify-center gap-5 rounded-lg hover:shadow-xl hover:scale-110 transition-discrete transition-all duration-200 ease-out"
    >
      <div className="w-full aspect-square">
        <Image
          src={image_urls[0]}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-cover object-center rounded"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm truncate">{name}</h2>
        <h1 className="font-extrabold font-fira-code">
          {price.toLocaleString("id-ID")}
        </h1>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5">
            <FaStar className="text-yellow-400" />
            <p>{rating_avg}</p>
          </div>
          <div>
            <p>{rating_count} terjual</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
