"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { FaPenToSquare, FaStar, FaTrash } from "react-icons/fa6";
import useEmblaCarousel from "embla-carousel-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteProduct, updateProduct } from "@/services/product.service";
import { removeProduct } from "@/store/slices/productSlice";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import DialogCustom from "./DialogCustom";
import DiscountForm from "./DiscountForm";
import ImageUploadForm from "./ImageUploadForm";
import DashboardTextarea from "./DashboardTextarea";
import DashboardDropdown from "./DashboardDropdown";
import DashboardOption from "./DashboardOption";
import DashboardInput from "./DashboardInput";
import { UpdateProductPayload } from "@/types";
import { resetImages } from "@/store/slices/imageSlice";
import { updateProduct as updateProductSlice } from "@/store/slices/productSlice";
import { store } from "@/store";
import { uploadProductImage } from "@/services/upload.service";

type Status = "active" | "inactive";
type ProductCategory = "body" | "lens" | "fullset" | "accessories";
type ProductCondition = "new" | "used";
type Discount_Type = "fixed" | "percentage" | null;

interface Props {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number | string;
  stock: number | string;
  image_urls: string[];
  description: string;
  status: Status;
  condition: ProductCondition;
  rating_avg: number;
  rating_count: number;
  discount_type: Discount_Type;
  discount_value: number | string;
  discount_active: boolean;
  final_price: number;
}

interface ProductForm {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: string;
  stock: string;
  image_urls: string[];
  description: string;
  status: Status;
  condition: ProductCondition;
  rating_avg: number;
  rating_count: number;
  discount_type: Discount_Type;
  discount_value: string;
  discount_active: boolean;
  final_price: number;
}

export default function DashboardProductCard({
  id,
  name,
  slug,
  category,
  price,
  stock,
  image_urls,
  description,
  status,
  condition,
  rating_avg,
  rating_count,
  discount_type,
  discount_value,
  discount_active,
  final_price,
}: Props) {
  const profile = useAppSelector((state) => state.user.profile);

  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<ProductForm>({
    id,
    user_id: profile?.id || "",
    name,
    slug,
    category,
    price: String(price),
    stock: String(stock),
    image_urls,
    description,
    status,
    condition,
    rating_avg,
    rating_count,
    discount_type: discount_type || null,
    discount_value: discount_value ? String(discount_value) : "",
    discount_active,
    final_price,
  });

  const handleDetail = () => setDetail(!detail);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    const confirm = window.confirm(`Yakin ingin menghapus produk "${name}"?`);

    if (!confirm) return;

    try {
      await deleteProduct(id, image_urls);
      dispatch(removeProduct(id));
      alert("Produk berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imagesState = store.getState().image.images;

      // 1. Pisahkan existing & new images
      const existingUrls = imagesState
        .filter((img) => img.type === "existing")
        .map((img) => img.url);

      const newFiles = imagesState
        .filter((img) => img.type === "new" && img.file)
        .map((img) => img.file as File);

      // 2. Upload image baru (jika ada)
      let uploadedUrls: string[] = [];

      if (newFiles.length > 0) {
        uploadedUrls = await Promise.all(
          newFiles.map((file) => uploadProductImage(file))
        );
      }

      const finalImageUrls = [...existingUrls, ...uploadedUrls];

      // 3. Hitung final price
      const priceNumber = Number(formData.price);
      const discountNumber = Number(formData.discount_value || 0);

      let calculatedFinalPrice = priceNumber;

      if (formData.discount_active) {
        if (formData.discount_type === "percentage") {
          calculatedFinalPrice =
            priceNumber - (priceNumber * discountNumber) / 100;
        } else if (formData.discount_type === "fixed") {
          calculatedFinalPrice = priceNumber - discountNumber;
        }
      }

      // 4. Payload update
      const { user_id, ...safeFormData } = formData;

      const payload: UpdateProductPayload = {
        ...safeFormData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount_type: formData.discount_active ? formData.discount_type : null,
        discount_value: Number(formData.discount_value),
        image_urls: finalImageUrls,
        final_price: Math.max(calculatedFinalPrice, 0),
      };

      // 5. Update ke backend
      const updatedProduct = await updateProduct(payload);

      // 6. Update redux product list
      dispatch(updateProductSlice(updatedProduct));

      // 7. Cleanup
      dispatch(resetImages());
      setOpen(false);

      alert("Produk berhasil diperbarui");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr
        onClick={handleDetail}
        className="hover:bg-zinc-300/20 dark:hover:bg-zinc-700/20 transition-colors group cursor-pointer"
      >
        {/* Name & Image */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Image
              src={image_urls[0]}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
            />
            <div className="w-full">
              <div className="font-bold truncate">{name}</div>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4">
          <span className="px-2 py-1 bg-teal-500 text-zinc-50 rounded text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </td>

        {/* Stock */}
        <td className="px-6 py-4 font-fira-code text-sm">
          {Number(stock) <= 5 ? (
            <span className="text-rose-400 font-bold">{stock} (Low)</span>
          ) : (
            <span>{stock}</span>
          )}
        </td>

        {/* Price & Discount */}
        <td className="px-6 py-4">
          <div className="flex flex-col font-fira-code">
            <span className="text-sm font-bold">
              Rp{final_price.toLocaleString()}
            </span>
          </div>
        </td>

        {/* Rating */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1">
            <FaStar size={14} fill="currentColor" className="text-amber-400" />
            <span className="text-sm font-bold">{rating_avg}</span>
          </div>
        </td>
      </tr>
      <tr className={`${detail ? "table-row" : "hidden"}`}>
        <td colSpan={6} className="px-6 py-4">
          <div className="w-full flex gap-6 border border-zinc-200 dark:border-zinc-700 rounded p-5">
            <div className="self-center relative w-96 max-h-96 overflow-hidden rounded">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {image_urls.map((image, index) => (
                    <div key={index} className="h-full flex-[0_0_100%]">
                      <Image
                        src={image}
                        alt={name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover object-center rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow cursor-pointer"
              >
                <IoIosArrowBack className="text-base dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
              </button>

              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow cursor-pointer"
              >
                <IoIosArrowForward className="text-base dark:text-zinc-950 hover:text-teal-500 transition-colors duration-200 ease-out" />
              </button>
            </div>
            <div className="relative w-full flex gap-6">
              {/* Text Description */}
              <div className="w-full max-w-1/3 space-y-5">
                <div className="overflow-hidden">
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Description
                  </h1>
                  <p className="max-w-80 text-zinc-500 leading-relaxed text-sm text-clip text-wrap">
                    {description}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Condition
                  </h1>
                  <p className="text-zinc-500 leading-relaxed text-sm">
                    {condition === "new" ? "New" : "Second"}
                  </p>
                </div>
                <div>
                  <h1 className="text-base font-bold mb-1 font-heading">
                    Product Status
                  </h1>
                  <p className="text-zinc-500 leading-relaxed text-sm">
                    {status === "active" ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              {/* Price Detail */}
              <div className="w-full">
                <h1 className="text-base font-bold mb-1 font-heading">
                  Price Detail
                </h1>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Original Price: Rp {price.toLocaleString()}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Status: {discount_active ? "Active" : "Inactive"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Type:{" "}
                  {discount_type === "percentage"
                    ? "Percentage"
                    : discount_type === "fixed"
                    ? "Nominal"
                    : "-"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Discount Value:{" "}
                  {discount_type === "percentage"
                    ? `${discount_value}%`
                    : discount_type === "fixed"
                    ? `Rp ${discount_value.toLocaleString()}`
                    : "-"}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Final Price: Rp {final_price.toLocaleString()}
                </p>
              </div>
              {/* Rating Detail */}
              <div className="w-full">
                <h1 className="text-base font-bold mb-1 font-heading">
                  Rating Detail
                </h1>
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <p>Overall Rating:</p>
                  <FaStar
                    size={14}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                  <span className="text-sm font-bold">{rating_avg}</span>
                </div>
                <div className="text-sm text-zinc-500">
                  <p>Rating Count: {rating_count}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-fit flex items-center gap-3 text-base text-zinc-50">
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
                      className="p-2 rounded-full shadow bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 transition-colors duration-200 ease-out"
                    >
                      <FaPenToSquare />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
                    <DialogTitle className="font-extrabold font-fira-code">
                      Edit Product
                    </DialogTitle>
                    <DialogCustom onSubmit={handleSubmit}>
                      <div className="flex gap-3 items-center">
                        <div className="w-2/3">
                          <DashboardInput
                            title="Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(v) =>
                              setFormData({ ...formData, name: v })
                            }
                            required
                          />
                        </div>
                        <div className="w-1/3">
                          <DashboardDropdown<ProductCategory>
                            name="category"
                            title="Category"
                            value={formData.category}
                            onChange={(v) =>
                              setFormData({ ...formData, category: v })
                            }
                            required
                          >
                            <DashboardOption value="body" text="Body" />
                            <DashboardOption value="lens" text="Lens" />
                            <DashboardOption value="fullset" text="Full Set" />
                            <DashboardOption
                              value="accessories"
                              text="Accessories"
                            />
                          </DashboardDropdown>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="w-1/3">
                          <DashboardInput
                            title="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={(v) =>
                              setFormData({ ...formData, price: String(v) })
                            }
                            required
                          />
                        </div>
                        <div className="w-1/3">
                          <DashboardInput
                            title="Stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(v) =>
                              setFormData({ ...formData, stock: String(v) })
                            }
                            required
                          />
                        </div>
                        <div className="w-1/3">
                          <DashboardDropdown
                            name="condition"
                            title="Condition"
                            value={formData.condition}
                            onChange={(v) =>
                              setFormData({ ...formData, condition: v })
                            }
                            required
                          >
                            <DashboardOption value="new" text="New" />
                            <DashboardOption value="used" text="Used" />
                          </DashboardDropdown>
                        </div>
                      </div>

                      <DashboardTextarea
                        name="description"
                        title="Description"
                        value={formData.description}
                        onChange={(v) =>
                          setFormData({ ...formData, description: v })
                        }
                        required
                      />

                      <ImageUploadForm existingImages={image_urls} />

                      <select
                        name="status"
                        defaultValue="active"
                        className="hidden"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                      </select>

                      {/* ==== DISCOUNT ==== */}
                      <DiscountForm
                        discountActive={formData.discount_active}
                        onDiscountActiveChange={(v) =>
                          setFormData((prev) => ({
                            ...prev,
                            discount_active: v,
                            discount_type: v
                              ? prev.discount_type ?? "percentage"
                              : null,
                            discount_value: v ? prev.discount_value : "",
                          }))
                        }
                        discountType={formData.discount_type ?? "percentage"}
                        discountTypeOnChange={(v) =>
                          setFormData((prev) => ({ ...prev, discount_type: v }))
                        }
                        discountValue={formData.discount_value}
                        discountValueOnChange={(v) =>
                          setFormData((prev) => ({
                            ...prev,
                            discount_value: String(v),
                          }))
                        }
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-bold font-fira-code text-zinc-50 bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 rounded ${
                          loading && "bg-zinc-400 cursor-not-allowed"
                        }`}
                      >
                        {loading ? "Updating..." : "Update Product"}
                      </button>
                    </DialogCustom>
                  </DialogContent>
                </Dialog>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full shadow bg-rose-400 dark:bg-rose-700 hover:bg-rose-500 transition-colors duration-200 ease-out"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
