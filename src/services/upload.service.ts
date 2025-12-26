import { createClient } from "@/lib/supabase/client";

export async function uploadProductImage(file: File) {
  console.log("Uploading:", file.name);

  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);
  console.log("Uploaded path:", data?.path);

  return publicUrl.publicUrl;
}
