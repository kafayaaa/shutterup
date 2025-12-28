"use client";

import Alert from "@/components/Alert";
import DashboardDropdown from "@/components/DashboardDropdown";
import DashboardInput from "@/components/DashboardInput";
import DashboardOption from "@/components/DashboardOption";
import DashboardTextarea from "@/components/DashboardTextarea";
import DialogCustom from "@/components/DialogCustom";
import Loading from "@/components/Loading";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addressService } from "@/services/address.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addAddressSuccess } from "@/store/slices/addressSlice";
import { CreateAddressInput } from "@/types";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddressPage() {
  const { profile, isLoading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { addresses, isLoading } = useAppSelector((state) => state.address);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const dispatch = useAppDispatch();

  if (userLoading) {
    return <LoadingScreen />;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!profile) {
      <Alert
        message="You must be logged in to add an address."
        type="error"
        duration={4000}
      />;
      return; // Pastikan hanya return kosong
    }

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const addressData: CreateAddressInput = {
        recipient_name: formData.get("recipient_name") as string,
        phone_number: formData.get("phone_number") as string,
        address_line: formData.get("address_line") as string,
        province: formData.get("province") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postal_code") as string,
        is_default: isDefault,
      };

      const newAddress = await addressService.addAddress(
        profile.id,
        addressData
      );
      dispatch(addAddressSuccess(newAddress));

      setOpen(false);
      setIsDefault(false);
      (e.target as HTMLFormElement).reset();

      <Alert
        message="Address added successfully!"
        type="success"
        duration={4000}
      />;
    } catch (error: unknown) {
      if (error instanceof Error) {
        <Alert
          message={`Failed to add address: ${error.message}`}
          type="error"
          duration={4000}
        />;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Shipping Addresses List</h2>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className="px-4 py-2 flex items-center gap-2 text-sm text-zinc-50 font-bold bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 rounded"
            >
              <FaPlus className="text-base" /> Address
            </button>
          </DialogTrigger>
          <DialogContent className="border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
            <DialogTitle className="font-extrabold font-fira-code">
              Add Address
            </DialogTitle>
            <DialogCustom onSubmit={handleSubmit}>
              <DashboardInput
                title="Receipt Name"
                name="recipient_name"
                type="text"
                required
              />
              <DashboardInput
                title="Phone Number"
                name="phone_number"
                type="number"
                required
              />
              <DashboardDropdown name="province" title="Province" required>
                <DashboardOption value="java" text="Java" />
              </DashboardDropdown>
              <DashboardDropdown name="city" title="City" required>
                <DashboardOption value="magelang" text="Magelang" />
              </DashboardDropdown>
              <DashboardTextarea
                name="address_line"
                title="Address Line"
                required
              />
              <DashboardInput
                title="Postal Code"
                name="postal_code"
                type="number"
                required
              />
              <div className="w-full flex items-center text-sm">
                <label htmlFor="is_default">Make as default</label>
                <input
                  type="checkbox"
                  name="is_default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="ml-1 size-4 checked:bg-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-bold font-fira-code text-zinc-50 bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 rounded ${
                  loading && "bg-zinc-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </DialogCustom>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="w-full py-5 flex items-center justify-center">
          <Loading />
        </div>
      ) : addresses.length === 0 ? (
        <div className="w-full py-5 flex items-center justify-center">
          <p className="text-gray-500">No addresses yet.</p>
        </div>
      ) : (
        // ===== ADDRESS LIST =====
        <div className="w-full flex flex-col gap-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative p-5 pt-7 flex flex-col gap-5 rounded-md shadow ${
                address.is_default
                  ? "border-2 border-teal-500 bg-teal-500/10 dark:bg-teal-900/10"
                  : "dark:bg-zinc-700 "
              }`}
            >
              {/* ===== DEFAULT ADDRESS BADGE ===== */}
              {address.is_default && (
                <div className="absolute -top-3 left-5 bg-teal-500 text-zinc-50 px-3 py-1 rounded-md text-xs font-fira-code font-semibold">
                  Default Address
                </div>
              )}
              {/* ===== RECEIPT NAME ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>Receipt Name</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold">{address.recipient_name}</p>
                </div>
              </div>
              {/* ===== PHONE NUMBER ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>Phone Number</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold font-fira-code">
                    {address.phone_number}
                  </p>
                </div>
              </div>
              {/* ===== PROVINCE ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>Province</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold">{address.province}</p>
                </div>
              </div>
              {/* ===== CITY ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>City</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold">{address.city}</p>
                </div>
              </div>
              {/* ===== ADDRESS LINE ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>Address Line</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold">{address.address_line}</p>
                </div>
              </div>
              {/* ===== POSTAL CODE ===== */}
              <div className="grid grid-cols-12">
                <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>Postal Code</p>
                </div>
                <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-300">
                  <p>:</p>
                </div>
                <div className="col-span-7">
                  <p className="font-semibold font-fira-code">
                    {address.postal_code}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
