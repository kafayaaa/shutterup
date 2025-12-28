import { BiCircle, BiLoaderAlt } from "react-icons/bi";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/80 z-50">
      <div className="flex items-center gap-2">
        <div className="relative h-15 w-15 text-3xl">
          <BiCircle className="absolute top-0 left-0 text-6xl text-teal-500" />
          <BiLoaderAlt className="absolute top-0 left-0 text-6xl z-10 animate-spin text-teal-950/50" />
        </div>
        <p className="text-3xl font-fira-code font-extrabold text-white">
          Loading...
        </p>
      </div>
    </div>
  );
}
