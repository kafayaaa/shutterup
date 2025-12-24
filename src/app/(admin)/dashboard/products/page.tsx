"use client";

import Dialog from "@/components/Dialog";
import ProductCard from "@/components/ProductCard";
import { createProduct } from "@/services/product.service";
import { useState } from "react";

export default function ProductPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createProduct({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        image_url: formData.get("image_url") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as string,
        condition: formData.get("condition") as string,
      });

      alert("Product berhasil ditambahkan");
      e.currentTarget.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="w-full p-5 flex flex-col gap-5 text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full flex justify-between items-center gap-5">
        <h1>Products</h1>
        <button
          onClick={handleOpen}
          className="text-zinc-50 dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-50 p-2"
        >
          Tambah Produk
        </button>
        {isOpen && (
          <Dialog onClick={handleOpen} title="Tambah Produk">
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Nama produk" />
              <input type="text" name="category" placeholder="Kategori" />
              <input type="number" name="price" placeholder="Harga" />
              <input type="number" name="qty" placeholder="Kuantitas" />
              <input type="text" name="description" placeholder="Deskripsi" />
              <input type="text" name="status" placeholder="Status" />
              <input type="text" name="condition" placeholder="Kondisi" />
              <button disabled={loading}>
                {loading ? "Menyimpan..." : "Tambah Produk"}
              </button>
            </form>
          </Dialog>
        )}
      </div>
      <div className="w-full grid grid-cols-5 gap-5">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
