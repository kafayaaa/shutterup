import DashboardDropdown from "./DashboardDropdown";
import DashboardInput from "./DashboardInput";
import DashboardOption from "./DashboardOption";

interface Props {
  discountActive: boolean;
  onDiscountActiveChange: (value: boolean) => void;
  discountType: "fixed" | "percentage";
  discountTypeOnChange: (value: "fixed" | "percentage") => void;
  discountValue?: number | string;
  discountValueOnChange: (value: number | string) => void;
}

export default function DiscountForm({
  discountActive,
  onDiscountActiveChange,
  discountType,
  discountTypeOnChange,
  discountValue,
  discountValueOnChange,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="w-full flex items-center text-sm">
        <label htmlFor="discount_active">Activate discount</label>
        <input
          type="checkbox"
          name="discount_active"
          checked={discountActive}
          onChange={(e) => onDiscountActiveChange(e.target.checked)}
          className="ml-1 size-4 checked:bg-teal-500"
        />
      </div>

      {discountActive && (
        <div className="w-full flex items-center gap-3">
          <div className="w-1/2">
            <DashboardDropdown
              name="discount_type"
              title="Discount Type"
              value={discountType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = e.target.value as "fixed" | "percentage";
                discountTypeOnChange(val);
              }}
            >
              <DashboardOption value="percentage" text="Percentage" />
              <DashboardOption value="fixed" text="Nominal" />
            </DashboardDropdown>
          </div>

          <div className="w-1/2">
            <DashboardInput
              title="Discount Value"
              name="discount_value"
              type="number"
              value={discountValue}
              onChange={discountValueOnChange}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
