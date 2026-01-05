"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
import { Product, SpecKey, UpdateProductPayload } from "@/types";
import { resetImages } from "@/store/slices/imageSlice";
import { updateProduct as updateProductSlice } from "@/store/slices/productSlice";
import { store } from "@/store";
import {
  deleteProductImages,
  uploadProductImage,
} from "@/services/upload.service";
import Alert from "./Alert";
import { PiWarningCircle } from "react-icons/pi";
import slugify from "@/utils/slugify";

type Props = Product;

interface ProductForm
  extends Omit<
    Product,
    | "price"
    | "stock"
    | "weight"
    | "width"
    | "height"
    | "length"
    | "discount_value"
  > {
  price: string;
  stock: string;
  weight: string;
  width: string;
  height: string;
  length: string;
  discount_value: string;
}

export default function DashboardProductCard(props: Props) {
  const { categories: categoriesData } = useAppSelector(
    (state) => state.category
  );
  const { brands } = useAppSelector((state) => state.brand);

  const {
    id,
    name,
    slug,
    image_urls,
    description,
    status,
    condition,
    price,
    final_price,
    stock,
    sold,
    category_id,
    categories,
    average_rating,
    review_count,
    discount_type,
    discount_value,
    discount_active,
    weight,
    width,
    height,
    length,
    product_specs,
  } = props;

  const profile = useAppSelector((state) => state.user.profile);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [availableSpecs, setAvailableSpecs] = useState<SpecKey[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [formData, setFormData] = useState<ProductForm>({
    ...props,
    price: String(price),
    stock: String(stock),
    weight: String(weight),
    width: String(width),
    height: String(height),
    length: String(length),
    discount_value: String(discount_value),
  });

  const handleDetail = () => setDetail(!detail);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (formData.category_id) {
      const category = categoriesData.find(
        (c) => c.id === formData.category_id
      );
      if (category && Array.isArray(category.spec_keys)) {
        setAvailableSpecs(category.spec_keys);
      } else {
        setAvailableSpecs([]);
      }
    }
  }, [formData.category_id, categoriesData]);

  const handleNameChange = (val: string) => {
    setFormData({
      ...formData,
      name: val,
      slug: slugify(val), // Otomatis generate slug setiap nama berubah
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setFormData({
      ...formData,
      category_id: newId,
      product_specs: {}, // Reset spek jika kategori berubah agar tidak campur aduk
    });
  };

  const handleSpecChange = (specName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      product_specs: {
        ...(prev.product_specs || {}),
        [specName]: value,
      },
    }));
  };

  const handleDelete = async () => {
    try {
      if (image_urls && image_urls.length > 0) {
        await deleteProductImages(image_urls);
      }
      await deleteProduct(id, image_urls);
      dispatch(removeProduct(id));
      setAlertMessage(`Successfully deleted product "${name}"`);
      setAlertType("info");
      setShowAlert(true);
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
      setAlertMessage(`Failed to delete product "${name}"`);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imagesState = store.getState().image.images;
      const existingUrls = imagesState
        .filter((img) => img.type === "existing")
        .map((img) => img.url);
      const deletedUrls = image_urls.filter(
        (url) => !existingUrls.includes(url)
      );

      if (deletedUrls.length > 0) await deleteProductImages(deletedUrls);

      const newFiles = imagesState
        .filter((img) => img.type === "new" && img.file)
        .map((img) => img.file as File);
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        uploadedUrls = await Promise.all(
          newFiles.map((file) => uploadProductImage(file))
        );
      }

      const finalImageUrls = [...existingUrls, ...uploadedUrls];

      // Kalkulasi Harga
      const priceNum = Number(formData.price);
      const discNum = Number(formData.discount_value || 0);
      let calcFinalPrice = priceNum;

      if (formData.discount_active) {
        if (formData.discount_type === "percentage") {
          calcFinalPrice = priceNum - (priceNum * discNum) / 100;
        } else if (formData.discount_type === "fixed") {
          calcFinalPrice = priceNum - discNum;
        }
      }

      const { brands: _b, categories: _c, ...cleanFormData } = formData;

      // Payload Mapping sesuai Interface Product Baru
      const payload: UpdateProductPayload = {
        ...cleanFormData,
        slug: formData.slug,
        price: priceNum,
        stock: Number(formData.stock),
        weight: Number(formData.weight),
        width: Number(formData.width),
        height: Number(formData.height),
        length: Number(formData.length),
        discount_type: formData.discount_active ? formData.discount_type : null,
        discount_value: discNum,
        product_specs: formData.product_specs,
        image_urls: finalImageUrls,
        final_price: Math.max(calcFinalPrice, 0),
      };

      const updatedProduct = await updateProduct(payload);
      dispatch(updateProductSlice(updatedProduct));
      dispatch(resetImages());
      setFormData({
        ...formData,
        name: "",
        slug: "",
        category_id: "",
        brand_id: "",
        product_specs: {},
        image_urls: [],
        discount_active: false,
        discount_type: null,
        discount_value: "",
        final_price: 0,
        price: "",
        stock: "",
        weight: "",
        width: "",
        height: "",
        length: "",
      });
      setOpen(false);
      setAlertMessage(`Successfully updated "${name}"`);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update product");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-10 z-40">
          <Alert
            message={alertMessage}
            type={alertType}
            onDismiss={() => setShowAlert(false)}
          />
        </div>
      )}

      <tr
        onClick={handleDetail}
        className="hover:bg-zinc-300/20 dark:hover:bg-zinc-700/20 transition-colors group cursor-pointer border-b border-zinc-100 dark:border-zinc-800"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Image
              src={image_urls[0]}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
            />
            <div className="font-bold truncate max-w-50">{name}</div>
          </div>
        </td>
        <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-teal-500">
          {categories?.name}
        </td>
        <td className="px-6 py-4 font-fira-code text-sm">{stock}</td>
        <td className="px-6 py-4 font-fira-code text-sm">{sold}</td>
        <td className="px-6 py-4 font-bold">
          Rp{final_price.toLocaleString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-1">
            <FaStar size={14} className="text-amber-400" />
            <span className="text-sm font-bold">
              {average_rating} ({review_count})
            </span>
          </div>
        </td>
      </tr>

      <tr className={`${detail ? "table-row" : "hidden"}`}>
        <td colSpan={6} className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="flex flex-col md:flex-row gap-6 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
            {/* Carousel Area */}
            <div className="relative w-full md:w-80 h-80 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
              <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {image_urls.map((image, index) => (
                    <div key={index} className="flex-[0_0_100%] h-full">
                      <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
              >
                <IoIosArrowForward />
              </button>
            </div>

            {/* Info Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              <section>
                <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">
                  Dimensions & Weight
                </h3>
                <div className="text-sm space-y-1">
                  <p>Weight: {weight}g</p>
                  <p>
                    Size: {length} x {width} x {height} cm
                  </p>
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">
                  Status & Condition
                </h3>
                <div className="text-sm space-y-1">
                  <p>Condition: {condition === "new" ? "New" : "Used"}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        status === "active" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {status}
                    </span>
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">
                  Pricing Detail
                </h3>
                <div className="text-sm space-y-1">
                  <p className="line-through text-zinc-400">
                    Rp {price.toLocaleString()}
                  </p>
                  <p className="font-bold text-teal-500">
                    Rp {final_price.toLocaleString()}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">
                  Description
                </h3>
                <div className="text-sm space-y-1">
                  <p>{description}</p>
                </div>
              </section>

              <section className="col-span-2">
                <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {product_specs && Object.keys(product_specs).length > 0 ? (
                    Object.entries(product_specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-zinc-700/50 pb-1"
                      >
                        <span className="text-zinc-400 text-xs uppercase">
                          {key}
                        </span>
                        <span className="text-zinc-200 font-medium text-sm">
                          {String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 italic text-xs">
                      No specifications available
                    </p>
                  )}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="md:absolute md:top-0 md:right-0 flex gap-2">
                {/* ===== EDIT BUTTON ===== */}
                <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) dispatch(resetImages());
                  }}
                >
                  <DialogTrigger asChild>
                    <button className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-700 hover:scale-110 transition-transform">
                      <FaPenToSquare />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-10/12 border-none bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-y-auto hide-scrollbar">
                    <DialogTitle className="font-extrabold font-fira-code">
                      Edit {name}
                    </DialogTitle>
                    <DialogCustom onSubmit={handleSubmit}>
                      <div className="grid grid-cols-3 gap-5">
                        {/* ===== NAME ===== */}
                        <div className="col-span-2">
                          <DashboardInput
                            title="Product Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                          />
                        </div>
                        {/* ===== STATUS ===== */}
                        <div className="col-span-1">
                          <DashboardDropdown
                            name="status"
                            title="Status"
                            required
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value as "active" | "inactive",
                              })
                            }
                          >
                            <DashboardOption value="active" text="Active" />
                            <DashboardOption value="inactive" text="Inactive" />
                          </DashboardDropdown>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        {/* ===== CATEGORY ===== */}
                        <DashboardDropdown
                          name="category_id"
                          title="Category"
                          required
                          value={formData.category_id}
                          onChange={handleCategoryChange}
                        >
                          {categoriesData.map((c) => (
                            <DashboardOption
                              key={c.id}
                              value={c.id}
                              text={c.name}
                            />
                          ))}
                        </DashboardDropdown>
                        {/* ===== BRAND ===== */}
                        <DashboardDropdown
                          name="brand_id"
                          title="Brand"
                          required
                          value={formData.brand_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_id: e.target.value,
                            })
                          }
                        >
                          {brands.map((b) => (
                            <DashboardOption
                              key={b.id}
                              value={b.id}
                              text={b.name}
                            />
                          ))}
                        </DashboardDropdown>
                      </div>
                      <div className="border border-zinc-700 my-3"></div>
                      {/* ===== DIMENSIONS ===== */}
                      <div className="grid grid-cols-4 gap-5">
                        <DashboardInput
                          title="Weight (g)"
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(v) =>
                            setFormData({ ...formData, weight: String(v) })
                          }
                        />
                        <DashboardInput
                          title="Length (mm)"
                          name="length"
                          type="number"
                          value={formData.length}
                          onChange={(v) =>
                            setFormData({ ...formData, length: String(v) })
                          }
                        />
                        <DashboardInput
                          title="Width (mm)"
                          name="width"
                          type="number"
                          value={formData.width}
                          onChange={(v) =>
                            setFormData({ ...formData, width: String(v) })
                          }
                        />
                        <DashboardInput
                          title="Height (mm)"
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={(v) =>
                            setFormData({ ...formData, height: String(v) })
                          }
                        />
                      </div>
                      <div className="border border-zinc-700 my-3"></div>
                      {/* ===== SPECIFICATIONS ===== */}
                      {availableSpecs.length > 0 && (
                        <>
                          <div className="gap-5 grid grid-cols-2">
                            {availableSpecs.map((spec) => {
                              // Ambil value dari formData berdasarkan nama spesifikasi
                              const currentValue =
                                formData.product_specs?.[spec.name] || "";

                              return (
                                <div key={spec.id} className="w-full">
                                  {spec.input_type === "select" ? (
                                    <DashboardDropdown
                                      title={spec.name}
                                      name={`spec_${spec.id}`}
                                      required
                                      value={String(currentValue)}
                                      onChange={(e) =>
                                        handleSpecChange(
                                          spec.name,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {/* Fallback empty option */}
                                      <DashboardOption
                                        value=""
                                        text={`Select ${spec.name}`}
                                      />
                                      {spec.options?.map((opt) => (
                                        <DashboardOption
                                          key={opt}
                                          value={opt}
                                          text={opt}
                                        />
                                      ))}
                                    </DashboardDropdown>
                                  ) : (
                                    <DashboardInput
                                      title={spec.name}
                                      name={`spec_${spec.id}`}
                                      type={spec.input_type}
                                      required
                                      value={String(currentValue)}
                                      onChange={(val) =>
                                        handleSpecChange(spec.name, String(val))
                                      }
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="border border-zinc-700 my-3"></div>
                        </>
                      )}
                      {/* ===== PRICING DETAIL ===== */}
                      <div className="grid grid-cols-3 gap-5">
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
                        <DashboardDropdown
                          title="Condition"
                          name="condition"
                          value={formData.condition}
                          onChange={(v) =>
                            setFormData({
                              ...formData,
                              condition: v.target.value as "new" | "used",
                            })
                          }
                          required
                        >
                          <DashboardOption value="new" text="New" />
                          <DashboardOption value="used" text="Used" />
                        </DashboardDropdown>
                      </div>

                      <DashboardTextarea
                        title="Description"
                        name="description"
                        value={formData.description}
                        onChange={(v) =>
                          setFormData({ ...formData, description: v })
                        }
                        required
                      />

                      <ImageUploadForm existingImages={image_urls} />

                      <DiscountForm
                        discountActive={formData.discount_active}
                        onDiscountActiveChange={(v) =>
                          setFormData((p) => ({ ...p, discount_active: v }))
                        }
                        discountType={formData.discount_type || "percentage"}
                        discountTypeOnChange={(v) =>
                          setFormData((p) => ({ ...p, discount_type: v }))
                        }
                        discountValue={formData.discount_value}
                        discountValueOnChange={(v) =>
                          setFormData((p) => ({
                            ...p,
                            discount_value: String(v),
                          }))
                        }
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors"
                      >
                        {loading ? "Saving Changes..." : "Save Product"}
                      </button>
                    </DialogCustom>
                  </DialogContent>
                </Dialog>

                <button
                  onClick={() => setOpenDelete(true)}
                  className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 hover:scale-110 transition-transform"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-xs text-center p-8 border-none dark:bg-zinc-800 rounded-2xl">
          <PiWarningCircle className="text-6xl text-rose-500 mx-auto mb-4" />
          <DialogTitle className="text-lg font-bold">
            Remove Product?
          </DialogTitle>
          <p className="text-sm text-zinc-400 mt-2 mb-6">
            This action cannot be undone. <b>{name}</b> will be permanently
            deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenDelete(false)}
              className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 rounded-lg bg-rose-500 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
