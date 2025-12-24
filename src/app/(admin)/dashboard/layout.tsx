"use client";

import SideBar from "@/components/SideBar";

export default function DahsboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:zinc-950">
      <div className="grid grid-cols-12">
        <div className="col-span-1 overflow-hidden">
          <SideBar />
        </div>
        <div className="col-span-11">{children}</div>
      </div>
    </div>
  );
}
