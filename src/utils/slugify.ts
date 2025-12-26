export default function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // hapus karakter spesial
    .replace(/\s+/g, "-") // spasi → dash
    .replace(/-+/g, "-"); // dash beruntun
}
