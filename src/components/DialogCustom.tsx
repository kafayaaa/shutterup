interface Props {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function DialogCustom({ children, onSubmit }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl flex flex-col justify-center gap-5"
      >
        {children}
      </form>
    </div>
  );
}
