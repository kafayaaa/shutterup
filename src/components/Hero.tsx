import Image from "next/image";
import AnimatedTagline from "./AnimatedTagline";
import { FaArrowDown } from "react-icons/fa6";
import Link from "next/link";
export default function Hero() {
  return (
    <div className="relative top-0 left-0 w-full h-screen bg-linear-to-tr from-teal-400 to-teal-700 rounded-b-4xl shadow-[0_0.2rem_0.35rem_rgba(0,0,0,0.75)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <Image
          src="/camera.png"
          alt="Slide 1"
          width={325}
          height={325}
          className="w-full h-full object-cover object-center drop-shadow-[3rem_-3rem_1rem_rgba(0,0,0,0.75)]"
        />
      </div>
      <div className="w-full h-full py-10 md:py-20 flex flex-col justify-between items-center">
        <h1 className="mt-20 md:mt-0 text-7xl md:text-[13rem] font-black text-white/80">
          ShutterUp
        </h1>
        <div className="w-full flex flex-col items-center gap-10">
          <AnimatedTagline />
          <Link href="#promo" className="hover:bg-white/25 p-2 rounded-full">
            <FaArrowDown className="text-2xl md:text-4xl" />
          </Link>
        </div>
      </div>
    </div>
  );
}
