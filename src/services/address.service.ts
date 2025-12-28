import { createClient } from "@/lib/supabase/client";
import { CreateAddressInput, ShippingAddress } from "@/types";

const supabase = createClient();

export const addressService = {
  // 1. Ambil semua alamat milik user
  async getAddresses(userId: string): Promise<ShippingAddress[]> {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false }) // Alamat utama di paling atas
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 2. Tambah alamat baru
  async addAddress(
    userId: string,
    addressData: CreateAddressInput
  ): Promise<ShippingAddress> {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert([{ ...addressData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 3. Update alamat (termasuk mengganti detail atau status is_default)
  async updateAddress(
    addressId: string,
    updates: Partial<CreateAddressInput | { is_default: boolean }>
  ): Promise<ShippingAddress> {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Hapus alamat
  async deleteAddress(addressId: string): Promise<void> {
    const { error } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("id", addressId);

    if (error) throw error;
  },

  // 5. Set satu alamat sebagai default (Logic Trigger di DB akan menangani sisanya)
  async setDefaultAddress(addressId: string): Promise<void> {
    const { error } = await supabase
      .from("shipping_addresses")
      .update({ is_default: true })
      .eq("id", addressId);

    if (error) throw error;
  },
};
