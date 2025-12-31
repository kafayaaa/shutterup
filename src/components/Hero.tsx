import Image from "next/image";
import AnimatedTagline from "./AnimatedTagline";
export default function Hero() {
  return (
    <div className="relative top-0 left-0 w-full h-screen bg-linear-to-tr from-teal-400 to-teal-700">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <Image
          src="/camera.png"
          alt="Slide 1"
          width={325}
          height={325}
          className="w-full h-full object-cover object-center drop-shadow-[3rem_-3rem_1rem_rgba(0,0,0,0.75)]"
        />
      </div>
      <div className="w-full h-full py-20 flex flex-col justify-between items-center">
        <h1 className="text-[13rem] font-black text-teal-950">ShutterUp</h1>
        <AnimatedTagline />
      </div>
    </div>
  );
}
