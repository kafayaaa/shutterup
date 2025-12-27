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

export async function deleteProductImages(urls: string[]) {
  if (urls.length === 0) return;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Auth user:", user);

  const paths = urls
    .map((url) => {
      const marker = "/storage/v1/object/public/products/";
      if (!url.includes(marker)) return null;
      return url.split(marker)[1];
    })
    .filter(Boolean) as string[];

  if (paths.length === 0) return;

  console.log("Deleting storage paths:", paths);

  const { error } = await supabase.storage.from("products").remove(paths);

  if (error) {
    console.error("Failed to delete images:", error);
    throw error;
  }

  console.log("Deleted URLs:", urls);
  console.log("Delete paths:", paths);
}
