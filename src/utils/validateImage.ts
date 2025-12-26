export function validateImage(file: File) {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran gambar maksimal 2MB");
  }
}
