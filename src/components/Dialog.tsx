import { IoIosClose } from "react-icons/io";

interface Props {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function Dialog({ title, children, onClick, onSubmit }: Props) {
  return (
    <div className="fixed inset-0 z-20 w-full h-screen bg-black/80">
      <div className="absolute max-h-10/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-fira-code font-extrabold">{title}</h1>
          <button onClick={onClick}>
            <IoIosClose className="text-3xl hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full" />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="max-w-md  flex flex-col justify-center gap-5"
        >
          {children}
        </form>
      </div>
    </div>
  );
}
