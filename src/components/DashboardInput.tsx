interface Props {
  title: string;
  name: string;
  type: string;
  required?: boolean;
}

export default function DashboardInput({ title, name, type, required }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs">
        {title}
      </label>
      <input
        name={name}
        type={type}
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-0 focus:border-zinc-500 transition-all duration-100"
        required={required}
      />
    </div>
  );
}
