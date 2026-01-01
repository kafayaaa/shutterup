"use client";

import Link from "next/link";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import OAuthButton from "./OAuthButton";
import { BiReceipt } from "react-icons/bi";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/selectors/cartSelector";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

export default function Navbar() {
  const { profile } = useAppSelector((state) => state.user);
  const cartCount = useAppSelector(selectCartCount);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-5 left-0 right-0 z-20">
      <div className="w-full max-w-11/12 md:max-w-7xl py-3 md:py-5 px-5 md:px-10 mx-auto flex justify-between items-center bg-zinc-50/5 border border-white/10 rounded-full shadow inset-shadow-sm inset-shadow-white/50 backdrop-blur-lg">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/shutterup.webp"}
            alt="ShutterUp"
            width={50}
            height={50}
            className="w-10 h-10"
          />
          <span className="text-xl md:text-2xl text-zinc-50 font-bold font-fira-code">
            ShutterUp
          </span>
        </Link>
        <nav className="hidden md:block">
          {/* <ToggleTheme /> */}
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/carts" className="relative">
                <MdOutlineShoppingCart className="text-2xl text-zinc-50 hover:text-teal-500 transition-colors duration-200 ease-out" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[0.6rem] font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <BiReceipt className="text-2xl text-zinc-50 hover:text-teal-500 transition-colors duration-200 ease-out" />
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
        <button onClick={handleOpen} className="md:hidden">
          <GiHamburgerMenu className="text-2xl cursor-pointer" />
        </button>
      </div>
      {/* ===== MOBILE MENU ===== */}
      {isOpen && (
        <nav className="absolute top-20 right-8 md:hidden py-5 px-3 bg-zinc-50/5 border border-white/10 rounded-xl shadow inset-shadow-sm inset-shadow-white/50 backdrop-blur-lg">
          {/* <ToggleTheme /> */}
          <ul className="flex flex-col items-center gap-5">
            <li>
              <Link href="/carts" className="relative">
                <MdOutlineShoppingCart className="text-2xl text-zinc-50 hover:text-teal-500 transition-colors duration-200 ease-out" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[0.6rem] font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <BiReceipt className="text-2xl text-zinc-50 hover:text-teal-500 transition-colors duration-200 ease-out" />
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
      )}
    </div>
  );
}
