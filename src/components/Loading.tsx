import { RiCircleLine, RiLoader5Line } from "react-icons/ri";

export default function Loading() {
  return (
    <div className="w-full py-5 flex items-center justify-center font-extrabold font-fira-code">
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 text-3xl">
          <RiCircleLine className="absolute top-0 left-0 text-zinc-200 dark:text-zinc-700" />
          <RiLoader5Line className="absolute top-0 left-0 z-10 animate-spin text-teal-500" />
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
