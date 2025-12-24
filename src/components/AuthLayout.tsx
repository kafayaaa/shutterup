interface Props {
  title: string;
  desc: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, desc, children }: Props) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-2xl mx-auto p-5 flex flex-col items-center justify-center gap-5 rounded-xl border">
        <div className="flex flex-col items-center gap-2">
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
