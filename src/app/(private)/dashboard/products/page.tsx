"use client";

import Alert from "@/components/Alert";
import DashboardDropdown from "@/components/DashboardDropdown";
import DashboardInput from "@/components/DashboardInput";
import DashboardOption from "@/components/DashboardOption";
import DashboardProductCard from "@/components/DashboardProductCard";
import DashboardTextarea from "@/components/DashboardTextarea";
import DialogCustom from "@/components/DialogCustom";
import DiscountForm from "@/components/DiscountForm";
import ImageUploadForm from "@/components/ImageUploadForm";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { createProduct } from "@/services/product.service";
import { uploadProductImage } from "@/services/upload.service";
import { RootState, store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetImages } from "@/store/slices/imageSlice";
import { addProduct } from "@/store/slices/productSlice";
import { SpecKey } from "@/types";
import slugify from "@/utils/slugify";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const images = useSelector((state: RootState) => state.image.images);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [discountActive, setDiscountActive] = useState(false);
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState<number | string>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [availableSpecs, setAvailableSpecs] = useState<SpecKey[]>([]);

  const { brands } = useAppSelector((state) => state.brand);
  const { products, isLoading } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const supabase = createClient();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSpecs = async () => {
      if (!selectedCategoryId) {
        setAvailableSpecs([]);
        return;
      }

      const { data, error } = await supabase
        .from("spec_keys")
        .select("*")
        .eq("category_id", selectedCategoryId);

      if (error) {
        console.error("Error ambil spek:", error.message);
        return;
      }
      setAvailableSpecs(data || []);
    };

    fetchSpecs();
  }, [selectedCategoryId]);

  if (!images) return [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategoryId(val);
  };

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

      // 1. Ambil Category Name dari List Categories (untuk field 'category' enum)
      const categoryObj = categories.find((c) => c.id === selectedCategoryId);
      if (!categoryObj) throw new Error("Silakan pilih kategori yang valid");

      // Casting category name ke literal type yang diharapkan
      const categoryName = categoryObj.name.toLowerCase() as
        | "body"
        | "lens"
        | "fullset"
        | "accessories";

      // 2. Kumpulkan Spesifikasi Dinamis (Tipe Record<string, string>)
      const specs: Record<string, string> = {};
      availableSpecs.forEach((spec) => {
        const value = formData.get(`spec_${spec.id}`);
        if (typeof value === "string" && value.trim() !== "") {
          specs[spec.name] = value;
        }
      });

      // ==== INSERT PRODUCT ====
      const newProduct = await createProduct({
        name,
        slug: `${slugify(name)}-${Date.now()}`,
        price,
        stock,
        description: formData.get("description") as string,
        status: formData.get("status") as "active" | "inactive",
        condition: formData.get("condition") as "new" | "used",
        image_urls: imageUrls,
        discount_type: discountActive ? discountType ?? undefined : undefined,
        discount_value: discountActive ? Number(discountValue) : 0,
        discount_active: discountActive,

        category_id: formData.get("category_id") as string,
        brand_id: formData.get("brand_id") as string,
        weight: Number(formData.get("weight")),
        width: Number(formData.get("width")),
        height: Number(formData.get("height")),
        length: Number(formData.get("length")),
        category: categoryName,
        product_specs: specs,
      });

      setAlert({ message: "Product created!", type: "success" });
      form.reset();
      dispatch(resetImages());
      dispatch(addProduct(newProduct));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ message: error.message, type: "error" });
        console.error(error.message);
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* ===== ALERT ===== */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          duration={4000}
          onDismiss={() => setAlert(null)}
        />
      )}
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
            <DialogContent className="max-h-10/12 border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
              <DialogTitle className="font-extrabold font-fira-code">
                Add Product
              </DialogTitle>
              <DialogCustom onSubmit={handleSubmit}>
                {/* ==== MAIN INFO ==== */}
                <div className="grid grid-cols-1">
                  <DashboardInput
                    title="Product Name"
                    name="name"
                    type="text"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <DashboardDropdown
                    name="category_id"
                    title="Category"
                    required
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((c) => (
                      <DashboardOption key={c.id} value={c.id} text={c.name} />
                    ))}
                  </DashboardDropdown>

                  <DashboardDropdown name="brand_id" title="Brand" required>
                    {brands.map((b) => (
                      <DashboardOption key={b.id} value={b.id} text={b.name} />
                    ))}
                  </DashboardDropdown>
                </div>
                <div className="border border-zinc-700 my-3"></div>
                {/* ===== DIMENSIONS ===== */}
                <div className="grid grid-cols-4 gap-5">
                  <DashboardInput
                    title="Width (mm)"
                    name="width"
                    type="number"
                    required
                  />

                  <DashboardInput
                    title="Height (mm)"
                    name="height"
                    type="number"
                    required
                  />

                  <DashboardInput
                    title="Length (mm)"
                    name="length"
                    type="number"
                    required
                  />

                  <DashboardInput
                    title="Weight (g)"
                    name="weight"
                    type="number"
                    required
                  />
                </div>
                <div className="border border-zinc-700 my-3"></div>
                {/* ===== SPECIFICATIONS ===== */}
                {availableSpecs.length > 0 && (
                  <>
                    <div className="gap-5 grid grid-cols-2">
                      {availableSpecs.map((spec) => (
                        <div key={spec.id} className="w-full">
                          {spec.input_type === "select" ? (
                            /* RENDER DROPDOWN JIKA TIPE 'select' */
                            <DashboardDropdown
                              title={spec.name}
                              name={`spec_${spec.id}`}
                              required
                            >
                              {spec.options?.map((opt) => (
                                <DashboardOption
                                  key={opt}
                                  value={opt}
                                  text={opt}
                                />
                              ))}
                            </DashboardDropdown>
                          ) : (
                            /* RENDER INPUT BIASA JIKA TIPE 'text' ATAU 'number' */
                            <DashboardInput
                              title={spec.name}
                              name={`spec_${spec.id}`}
                              type={spec.input_type} // Bisa 'text' atau 'number'
                              step={
                                spec.input_type === "number"
                                  ? "0.01"
                                  : undefined
                              }
                              required
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="border border-zinc-700 my-3"></div>
                  </>
                )}
                {/* ===== PRICING & STOCK ===== */}
                <div className="grid grid-cols-3 gap-5">
                  <DashboardInput
                    title="Price"
                    name="price"
                    type="number"
                    required
                  />

                  <DashboardInput
                    title="Stock"
                    name="stock"
                    type="number"
                    required
                  />

                  <DashboardDropdown name="condition" title="Condition">
                    <DashboardOption value="new" text="New" />
                    <DashboardOption value="used" text="Used" />
                  </DashboardDropdown>
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
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <Loading />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="py-5">
                      <p className="text-center">No products found</p>
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
    </>
  );
}
