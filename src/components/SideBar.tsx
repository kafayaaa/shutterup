"use client";

import LogoutButton from "./LogoutButton";
import DashboardButton from "./DashboardButton";
import { RiHomeLine } from "react-icons/ri";
import { BsBox } from "react-icons/bs";
import { usePathname } from "next/navigation";
import ToggleTheme from "./ToggleTheme";
import { BiReceipt } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineBrandingWatermark, MdOutlineCategory } from "react-icons/md";

export default function SideBar() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const isBrands = pathname.includes("brands");
  const isCategories = pathname.includes("categories");
  const isProducts = pathname.includes("products");
  const isOrders = pathname.includes("orders");
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      href: "/dashboard",
      icon: <RiHomeLine className="text-lg" />,
      text: "Dashboard",
      isActive: isDashboard,
    },
    {
      href: "/dashboard/brands",
      icon: <MdOutlineBrandingWatermark className="text-lg" />,
      text: "Brands",
      isActive: isBrands,
    },
    {
      href: "/dashboard/categories",
      icon: <MdOutlineCategory className="text-lg" />,
      text: "Categories",
      isActive: isCategories,
    },
    {
      href: "/dashboard/products",
      icon: <BsBox className="text-lg" />,
      text: "Products",
      isActive: isProducts,
    },
    {
      href: "/dashboard/orders",
      icon: <BiReceipt className="text-lg" />,
      text: "Orders",
      isActive: isOrders,
    },
  ];
  return (
    <div className="z-40 w-full lg:h-screen p-5 lg:border-r border-zinc-200 dark:border-zinc-800">
      <div className="lg:h-full flex lg:flex-col justify-between lg:justify-start items-center gap-5 ">
        <div className="self-center">
          <h1 className="text-2xl font-extrabold font-fira-code">ShutterUp</h1>
        </div>
        <div className="hidden lg:block h-full">
          {/* ===== DEKSTOP ===== */}
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <DashboardButton
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  text={link.text}
                  isActive={link.isActive}
                />
              ))}
            </div>
            <div className="self-center flex justify-center items-center gap-2">
              {/* <div className="w-fit">
                <ToggleTheme />
              </div> */}
              <LogoutButton />
            </div>
          </div>
        </div>
        {/* ===== MOBILE ===== */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-2xl cursor-pointer"
        >
          <GiHamburgerMenu />
        </button>
        {isOpen && (
          <div className="fixed w-60 h-screen inset-y-0 right-0 bg-zinc-50 dark:bg-zinc-800 shadow-lg">
            <div className="h-screen flex flex-col justify-between p-5">
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="mr-3 text-3xl cursor-pointer"
                >
                  <IoClose />
                </button>
                <DashboardButton
                  href="/dashboard"
                  icon={<RiHomeLine className="text-lg" />}
                  text="Dashboard"
                  isActive={isDashboard}
                />
                <DashboardButton
                  href="/dashboard/products"
                  icon={<BsBox className="text-lg" />}
                  text="Products"
                  isActive={isProducts}
                />
                <DashboardButton
                  href="/dashboard/orders"
                  icon={<BiReceipt className="text-lg" />}
                  text="Orders"
                  isActive={isOrders}
                />
              </div>
              <div className="self-center flex justify-center items-center gap-2">
                <div className="w-fit">
                  <ToggleTheme />
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
