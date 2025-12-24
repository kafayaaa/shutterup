interface Props {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Dialog({ title, children, onClick }: Props) {
  return (
    <div className="fixed inset-0 z-20 w-full h-screen bg-black/80">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 flex flex-col gap-5 text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
        <button onClick={onClick}>Close</button>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}
