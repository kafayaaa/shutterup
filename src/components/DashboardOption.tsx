interface DashboardOptionProps<T extends string> {
  value: T;
  text: string;
}

export default function DashboardOption<T extends string>({
  value,
  text,
}: DashboardOptionProps<T>) {
  return (
    <option value={value} className="dark:bg-zinc-800">
      {text}
    </option>
  );
}
