"use client";

import LogoutButton from "./LogoutButton";
import DashboardButton from "./DashboardButton";
import { RiHomeLine } from "react-icons/ri";
import { BsBox } from "react-icons/bs";
import { usePathname } from "next/navigation";
import ToggleTheme from "./ToggleTheme";
import { BiReceipt } from "react-icons/bi";

export default function SideBar() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const isProducts = pathname.includes("products");
  const isOrders = pathname.includes("orders");
  return (
    <div className="w-full h-screen p-5 border-r border-zinc-200 dark:border-zinc-800">
      <div className="h-full flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-5">
          <div className="self-center">
            <h1 className="text-2xl font-extrabold font-fira-code">
              ShutterUp
            </h1>
          </div>
          <div className="flex flex-col gap-2">
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
        </div>
        <div className="self-center flex justify-center items-center gap-2">
          <div className="w-fit">
            <ToggleTheme />
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
