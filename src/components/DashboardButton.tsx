import Link from "next/link";

interface Props {
  href: string;
  text: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export default function DashboardButton({ href, text, icon, isActive }: Props) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 flex flex-row-reverse lg:flex-row items-center gap-2 text-sm rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
        isActive && "text-teal-500 font-bold"
      }`}
    >
      {icon}
      {text}
    </Link>
  );
}
