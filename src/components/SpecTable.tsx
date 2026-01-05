import { ProductSpecifications } from "@/types";

interface Props {
  specs: ProductSpecifications;
}

export default function SpecTable({ specs }: Props) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-200 pt-5 mt-5">
      {Object.entries(specs).map(([key, value]) => {
        if (value === undefined || value === null) return null;
        return (
          <div
            key={key}
            className="flex justify-between border-b border-zinc-100 pb-2"
          >
            <span className="text-zinc-500 capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : Array.isArray(value)
                ? value.join(", ")
                : value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
