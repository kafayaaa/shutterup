import { createClient } from "@/lib/supabase/client";
import { supabasePublic } from "@/lib/supabase/public";
import { Category } from "@/types";

const supabase = createClient();

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabasePublic
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabasePublic
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  },

  async createCategory(categoryData: { name: string }) {
    const { data, error } = await createClient() // Pastikan menggunakan client yang sama
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, categoryData: Partial<Category>) {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteCategory(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};
