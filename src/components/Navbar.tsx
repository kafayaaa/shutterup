"use client";

import Link from "next/link";
import Image from "next/image";
import ToggleTheme from "./ToggleTheme";
import { MdOutlineShoppingCart } from "react-icons/md";
import OAuthButton from "./OAuthButton";
import { BiReceipt } from "react-icons/bi";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/selectors/cartSelector";

export default function Navbar() {
  const { profile } = useAppSelector((state) => state.user);
  const cartCount = useAppSelector(selectCartCount);

  return (
    <div className="fixed top-0 left-0 right-0 z-10 w-full py-5 shadow backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-fira-code">
          ShutterUp
        </Link>
        <nav className="flex items-center gap-5">
          <ToggleTheme />
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/carts" className="relative">
                <MdOutlineShoppingCart className="text-2xl hover:text-teal-500 transition-colors duration-200 ease-out" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[0.6rem] font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <BiReceipt className="text-2xl hover:text-teal-500 transition-colors duration-200 ease-out" />
              </Link>
            </li>
            {profile?.role === "admin" ? (
              <li className="flex items-center gap-2">
                <Link
                  href={"/dashboard"}
                  className="h-7 w-auto aspect-square rounded-full outline-0 outline-offset-1 hover:outline-2 hover:outline-teal-500 transition-colors duration-200 ease-out"
                >
                  <Image
                    src={profile.avatar_url}
                    width={10}
                    height={10}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </Link>
                <div className="text-sm">{profile.full_name}</div>
              </li>
            ) : profile ? (
              <li className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="h-7 w-auto aspect-square rounded-full outline-0 outline-offset-1 hover:outline-2 hover:outline-teal-500 transition-colors duration-200 ease-out"
                >
                  <Image
                    src={profile.avatar_url}
                    width={10}
                    height={10}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </Link>
                <div className="text-sm">{profile.full_name}</div>
              </li>
            ) : (
              <li className="">
                <OAuthButton text="Sign In" />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
