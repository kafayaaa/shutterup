interface Props {
  name: string;
  title: string;
  value?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function DashboardTextarea({
  name,
  title,
  value,
  required,
  onChange,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={name} className="text-xs">
        {title}
      </label>
      <textarea
        rows={4}
        name={name}
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-0 focus:border-zinc-500 transition-all duration-100"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
      />
    </div>
  );
}
