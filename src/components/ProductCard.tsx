"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

export default function ProductCard() {
  return (
    <Link
      href={"/product/"}
      className="w-full p-3 flex flex-col items-center justify-center gap-5 rounded hover:shadow-xl hover:scale-110 transition-discrete transition-all duration-200 ease-out"
    >
      <div className="w-full aspect-square">
        <Image
          src="https://images.pexels.com/photos/15073866/pexels-photo-15073866.jpeg"
          alt="Product"
          width={200}
          height={200}
          className="w-full h-full object-cover object-center rounded"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm truncate">
          Fujifilm XA-3 dsjfkajnfkenakejnksdfnake
        </h2>
        <h1 className="font-extrabold font-fira-code">Rp 4.000.000</h1>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5">
            <FaStar className="text-yellow-400" />
            <p>5</p>
          </div>
          <div>
            <p>7 terjual</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
