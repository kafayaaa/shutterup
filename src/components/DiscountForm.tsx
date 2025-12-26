import { useState } from "react";
import DashboardDropdown from "./DashboardDropdown";
import DashboardInput from "./DashboardInput";
import DashboardOption from "./DashboardOption";

export default function DiscountForm() {
  const [isDiscount, setIsDiscount] = useState(false);

  const handleDiscount = () => {
    setIsDiscount(!isDiscount);
  };

  return (
    <div className="space-y-2">
      <div className="w-full flex items-center text-sm">
        <label htmlFor="discount_active">Aktifkan diskon</label>
        <input
          onChange={handleDiscount}
          checked={isDiscount}
          type="checkbox"
          name="discount_active"
          className="ml-1 size-4 checked:bg-teal-500"
        />
      </div>
      <div
        className={`w-full flex items-center gap-3 ${!isDiscount && "hidden"}`}
      >
        <div className="w-1/2">
          <DashboardDropdown
            name="discount_type"
            title="Tipe diskon"
            defaultValue="percentage"
          >
            <DashboardOption value="percentage" text="Persentase" />
            <DashboardOption value="fixed" text="Nominal" />
          </DashboardDropdown>
        </div>
        <div className="w-1/2">
          <DashboardInput
            title="Nilai diskon"
            name="discount_value"
            type="number"
            required
          />
        </div>
      </div>
    </div>
  );
}
