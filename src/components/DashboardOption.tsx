interface Props {
  value: string;
  text: string;
}

export default function DashboardOption({ value, text }: Props) {
  return (
    <option value={value} className="dark:bg-zinc-800">
      {text}
    </option>
  );
}
