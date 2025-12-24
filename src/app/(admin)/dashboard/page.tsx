"use client";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const { profile, isLoading } = useAppSelector((state) => state.user);

  if (isLoading) return <p>Loading...</p>;

  if (!profile) {
    return <p>Unauthorized</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Nama: {profile.full_name}</p>
      <p>Role: {profile.role}</p>
      <p>Email: {profile.email}</p>
      <p>Avatar: {profile.avatar_url}</p>
    </div>
  );
}
