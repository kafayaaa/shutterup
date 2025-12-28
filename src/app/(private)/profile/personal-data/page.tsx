"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

export default function PersonalDataPage() {
  const { profile, isLoading } = useAppSelector((state) => state.user);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!profile) {
    return null;
  }
  return (
    <div className="w-full">
      <div className="flex gap-5">
        <div className="aspect-square h-52">
          <Image
            src={profile?.avatar_url}
            alt="Avatar"
            width={208}
            height={208}
            className="object-cover rounded-md w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="">
            <span className="text-xs text-zinc-500">Name</span>
            <p className="font-bold">{profile?.full_name}</p>
          </div>
          <div className="">
            <span className="text-xs text-zinc-500">Email</span>
            <p className="font-bold">{profile?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
