"use client";

import Link from "next/link";
import Image from "next/image";
import ToggleTheme from "./ToggleTheme";
import { MdOutlineShoppingCart } from "react-icons/md";
import OAuthButton from "./OAuthButton";
import { BiReceipt } from "react-icons/bi";
import { useAppSelector } from "@/store/hooks";

export default function Navbar() {
  const { profile } = useAppSelector((state) => state.user);

  return (
    <div className="fixed top-0 left-0 right-0 z-10 w-full py-5 shadow backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold font-fira-code">ShutterUp</h1>
        <nav className="flex items-center gap-5">
          <ToggleTheme />
          <ul className="flex items-center gap-5">
            <li>
              <Link href="#">
                <MdOutlineShoppingCart className="text-2xl hover:text-teal-500 transition-colors duration-200 ease-out" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <BiReceipt className="text-2xl hover:text-teal-500 transition-colors duration-200 ease-out" />
              </Link>
            </li>
            {profile ? (
              <li className="flex items-center gap-2">
                <div className="h-7 w-auto aspect-square rounded-full outline-0 outline-offset-1 hover:outline-2 hover:outline-teal-500 transition-colors duration-200 ease-out">
                  <Image
                    src={profile.avatar_url}
                    width={10}
                    height={10}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
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
