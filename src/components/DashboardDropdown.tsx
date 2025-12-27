interface DashboardDropdownProps<T extends string | null> {
  name: string;
  title: string;
  value?: T;
  required?: boolean;
  onChange?: (value: T) => void;
  children: React.ReactNode;
}

export default function DashboardDropdown<T extends string | null>({
  name,
  title,
  value,
  required,
  onChange,
  children,
}: DashboardDropdownProps<T>) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={name} className="text-xs">
        {title}
      </label>

      <select
        name={name}
        value={value ?? ""}
        required={required}
        onChange={(e) => onChange?.(e.target.value as T)}
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-0 focus:border-zinc-500 transition-all duration-100"
      >
        {children}
      </select>
    </div>
  );
}
