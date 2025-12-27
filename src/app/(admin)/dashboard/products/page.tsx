"use client";

import DashboardDropdown from "@/components/DashboardDropdown";
import DashboardInput from "@/components/DashboardInput";
import DashboardOption from "@/components/DashboardOption";
import DashboardProductCard from "@/components/DashboardProductCard";
import DashboardTextarea from "@/components/DashboardTextarea";
import DialogCustom from "@/components/DialogCustom";
import DiscountForm from "@/components/DiscountForm";
import ImageUploadForm from "@/components/ImageUploadForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createProduct } from "@/services/product.service";
import { uploadProductImage } from "@/services/upload.service";
import { RootState, store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetImages } from "@/store/slices/imageSlice";
import { addProduct } from "@/store/slices/productSlice";
import slugify from "@/utils/slugify";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiCircleLine, RiLoader5Line } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const images = useSelector((state: RootState) => state.image.images);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [discountActive, setDiscountActive] = useState(false);
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState<number | string>(0);

  const { products, isLoading } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  if (!images) return [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const name = (formData.get("name") as string).trim();
      const price = Number(formData.get("price"));
      const stock = Number(formData.get("stock"));
      const discountType = formData.get("discount_type") as
        | "percentage"
        | "fixed"
        | null;
      const discountValue = Number(formData.get("discount_value") || 0);
      const discountActive = formData.get("discount_active") === "on";

      // ==== VALIDASI TEXT ====
      if (name.length < 3) {
        throw new Error("Nama produk minimal 3 karakter");
      }

      // ==== VALIDASI NUMBER ====
      if (price <= 0) {
        throw new Error("Harga harus lebih dari 0");
      }

      if (stock < 0) {
        throw new Error("Stok tidak boleh negatif");
      }

      if (discountActive) {
        if (discountValue <= 0) {
          throw new Error("Nilai diskon harus lebih dari 0");
        }

        if (discountType === "percentage" && discountValue > 100) {
          throw new Error("Diskon persen maksimal 100%");
        }
      }

      // ==== VALIDASI FILE ====
      const images = store.getState().image.images;

      const existingUrls = images
        .filter((img) => img.type === "existing")
        .map((img) => img.url);

      const newImages = images.filter(
        (img): img is typeof img & { file: File } =>
          img.type === "new" && img.file instanceof File
      );

      let uploadedUrls: string[] = [];

      if (newImages.length > 0) {
        uploadedUrls = await Promise.all(
          newImages.map((img) => uploadProductImage(img.file))
        );
      }

      const imageUrls = [...existingUrls, ...uploadedUrls];

      // ==== INSERT PRODUCT ====
      const newProduct = await createProduct({
        name,
        slug: `${slugify(name)}-${Date.now()}`,
        category: formData.get("category") as
          | "body"
          | "lens"
          | "fullset"
          | "accessories",
        price,
        stock,
        description: formData.get("description") as string,
        status: formData.get("status") as "active" | "inactive",
        condition: formData.get("condition") as "new" | "used",
        image_urls: imageUrls,
        discount_type: discountActive ? discountType ?? undefined : undefined,
        discount_value: discountActive ? discountValue : 0,
        discount_active: discountActive,
      });

      alert("Produk berhasil ditambahkan");
      form.reset();
      dispatch(resetImages());
      dispatch(addProduct(newProduct));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-5 flex flex-col gap-5">
      <div className="w-full flex justify-between items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold font-heading font-fira-code">
            Product Inventory
          </h1>
          <p className="text-zinc-400 text-sm">Manage catalog assets.</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!isOpen) {
              dispatch(resetImages());
            }
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className="px-4 py-2 flex items-center gap-2 text-sm text-zinc-50 font-bold bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 rounded"
            >
              <FaPlus className="text-base" /> Product
            </button>
          </DialogTrigger>
          <DialogContent className="border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
            <DialogTitle className="font-extrabold font-fira-code">
              Add Product
            </DialogTitle>
            <DialogCustom onSubmit={handleSubmit}>
              <div className="flex gap-3 items-center">
                <div className="w-2/3">
                  <DashboardInput
                    title="Name"
                    name="name"
                    type="text"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <DashboardDropdown name="category" title="Category" required>
                    <DashboardOption value="body" text="Body" />
                    <DashboardOption value="lens" text="Lens" />
                    <DashboardOption value="fullset" text="Full Set" />
                    <DashboardOption value="accessories" text="Accessories" />
                  </DashboardDropdown>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-1/3">
                  <DashboardInput
                    title="Price"
                    name="price"
                    type="number"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <DashboardInput
                    title="Stock"
                    name="stock"
                    type="number"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <DashboardDropdown name="condition" title="Condition">
                    <DashboardOption value="new" text="New" />
                    <DashboardOption value="used" text="Used" />
                  </DashboardDropdown>
                </div>
              </div>

              <DashboardTextarea
                name="description"
                title="Description"
                required
              />

              <ImageUploadForm />

              <select name="status" defaultValue="active" className="hidden">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>

              {/* ==== DISCOUNT ==== */}
              <DiscountForm
                discountActive={discountActive}
                onDiscountActiveChange={setDiscountActive}
                discountType={discountType}
                discountTypeOnChange={setDiscountType}
                discountValue={discountValue}
                discountValueOnChange={setDiscountValue}
              />
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

      {/* Table */}
      <div className="rounded-xl border border-white dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 uppercase text-xs tracking-widest font-fira-code">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <div className="w-full py-5 flex items-center justify-center font-extrabold font-fira-code">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 text-3xl">
                        <RiCircleLine className="absolute top-0 left-0 text-zinc-200 dark:text-zinc-700" />
                        <RiLoader5Line className="absolute top-0 left-0 z-10 animate-spin text-teal-500" />
                      </div>
                      <p>Loading...</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {products?.map((product, index) => (
                  <DashboardProductCard key={index} {...product} />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
