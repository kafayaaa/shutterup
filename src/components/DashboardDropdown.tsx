interface Props {
  name: string;
  title: string;
  defaultValue: string;
  children: React.ReactNode;
}

export default function DashboardDropdown({
  name,
  title,
  defaultValue,
  children,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={name} className="text-xs">
        {title}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-0 focus:border-zinc-500 transition-all duration-100"
      >
        {children}
      </select>
    </div>
  );
}
