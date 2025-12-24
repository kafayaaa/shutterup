"use client";

import Link from "next/link";
import ToggleTheme from "./ToggleTheme";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 w-full py-5 shadow-lg ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">ShutterUp</h1>
        <nav className="flex items-center gap-3">
          <ToggleTheme />
          <ul className="flex gap-4">
            <li>
              <Link href="#">Keranjang</Link>
            </li>
            <li>
              <Link href="signin">masuk</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
