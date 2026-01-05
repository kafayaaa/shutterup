import { createClient } from "@/lib/supabase/client";
import { supabasePublic } from "@/lib/supabase/public";
import { Brand } from "@/types";

const supabase = createClient();

export const brandService = {
  /**
   * Mengambil semua daftar brand untuk keperluan filter di sidebar
   * Data diurutkan berdasarkan nama (A-Z)
   */
  async getAllBrands(): Promise<Brand[]> {
    try {
      const { data, error } = await supabasePublic
        .from("brands")
        .select("id, name, logo_url")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  },

  /**
   * Mengambil detail satu brand (jika diperlukan untuk halaman khusus brand)
   */
  async getBrandById(id: string): Promise<Brand | null> {
    try {
      const { data, error } = await supabasePublic
        .from("brands")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      return null;
    }
  },

  /**
   * Fungsi Admin: Menambah Brand Baru
   * RLS akan memblokir jika user bukan admin
   */
  async createBrand(brandData: { name: string; logo_url: string }) {
    const { data, error } = await createClient() // Pastikan menggunakan client yang sama
      .from("brands")
      .insert([brandData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fungsi Admin: Update Brand
   */
  async updateBrand(id: string, brandData: Partial<Brand>) {
    const { data, error } = await supabase
      .from("brands")
      .update(brandData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteBrand(id: string) {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw error;
  },
};
