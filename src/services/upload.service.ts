import { createClient } from "@/lib/supabase/client";
import { supabasePublic } from "@/lib/supabase/public";

export async function uploadProductImage(file: File) {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from("shutterup")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error);
    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to upload image" + error.message);
    }
  }

  const { data: publicUrl } = supabase.storage
    .from("shutterup")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

export async function deleteProductImages(urls: string[]) {
  if (urls.length === 0) return;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const paths = urls
    .map((url) => {
      const marker = "/storage/v1/object/public/shutterup/";
      if (!url.includes(marker)) return null;
      return url.split(marker)[1];
    })
    .filter(Boolean) as string[];

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from("shutterup").remove(paths);

  if (error) {
    console.error("Failed to delete images:", error);
    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to delete images" + error.message);
    }
  }
}

export async function uploadBrandImage(file: File) {
  const supabase = await createClient();
  // Cek sesi secara mendalam
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Debug: Lihat apa yang ditangkap oleh client ini
  console.log("Current Session:", session);

  if (!session) {
    throw new Error(
      "You must be logged in to upload images. Session not found."
    );
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `brands/${fileName}`;

  const { data, error } = await supabase.storage
    .from("shutterup")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("shutterup")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

export async function deleteStorageFile(url: string) {
  const supabase = await createClient();
  // Ambil path setelah nama bucket 'shutterup/'
  // Contoh: 'brands/nama-file.png'
  const path = url.split("shutterup/")[1];

  if (path) {
    const { error } = await supabase.storage.from("shutterup").remove([path]);

    if (error) console.error("Error deleting file from storage:", error);
  }
}
