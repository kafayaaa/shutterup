type InputValueMap = {
  text: string;
  email: string;
  password: string;
  number: number | string;
  date: string;
};

interface Props<T extends keyof InputValueMap> {
  title: string;
  name: string;
  type: T;
  value?: InputValueMap[T];
  required?: boolean;
  defaultValue?: string;
  step?: string;
  onChange?: (value: InputValueMap[T]) => void;
}

export default function DashboardInput<T extends keyof InputValueMap>({
  title,
  name,
  type,
  value,
  required,
  defaultValue,
  step,
  onChange,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs">
        {title}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        required={required}
        defaultValue={defaultValue}
        step={step || "1"}
        onChange={(e) =>
          onChange?.(
            type === "number"
              ? (Number(e.target.value) as InputValueMap[T])
              : (e.target.value as InputValueMap[T])
          )
        }
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-0 focus:border-zinc-500 transition-all duration-100"
      />
    </div>
  );
}
