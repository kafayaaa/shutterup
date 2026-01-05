import React from "react";

interface DashboardDropdownProps<T extends string | null> {
  name: string;
  title: string;
  value?: T;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
      <label htmlFor={name} className="text-xs font-bold">
        {title}
      </label>

      <select
        id={name}
        name={name}
        {...(onChange ? { value: value ?? "" } : { defaultValue: value ?? "" })}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-0 focus:border-zinc-500 transition-all duration-100"
      >
        <option value="" disabled>
          Select {title}
        </option>
        {children}
      </select>
    </div>
  );
}
