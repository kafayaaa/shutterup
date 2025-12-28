"use client";

import LoadingScreen from "@/components/LoadingScreen";
import LogoutButton from "@/components/LogoutButton";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, isLoading } = useAppSelector((state) => state.user);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!profile) {
    redirect("/");
  }
  const isPersonalDataPage = pathname.includes("personal-data");
  const isAddressPage = pathname.includes("address");
  return (
    <div className="w-full min-h-screen">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto">
        <div className="pt-30 pb-10 w-full grid grid-cols-12 gap-5">
          <h1 className="col-span-12 text-2xl font-extrabold font-fira-code">
            Profile
          </h1>
          <div className="col-span-3">
            <div className="w-full flex flex-col gap-2 dark:bg-zinc-800 rounded-md shadow-md p-5">
              <Link
                href="/profile/personal-data"
                className={`w-full py-3 text-center hover:bg-zinc-100 ${
                  isPersonalDataPage
                    ? "border-l-4 border-teal-500 text-teal-500 font-extrabold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Personal Data
              </Link>
              <Link
                href="/profile/address"
                className={`w-full py-3 text-center hover:bg-zinc-100 ${
                  isAddressPage
                    ? "border-l-4 border-teal-500 text-teal-500 font-extrabold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Address
              </Link>
              <div className="mt-5">
                <LogoutButton />
              </div>
            </div>
          </div>
          {/* ===== PERSONAL DATA ===== */}
          <div className="col-span-9 p-5 dark:bg-zinc-800 rounded-md shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
