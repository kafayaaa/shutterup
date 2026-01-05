"use client";

import Alert from "@/components/Alert";
import DashboardInput from "@/components/DashboardInput";
import DialogCustom from "@/components/DialogCustom";
import GlassContainer from "@/components/GlassContainer";
import ImageUploadForm from "@/components/ImageUploadForm";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { brandService } from "@/services/brand.service";
import { deleteStorageFile, uploadBrandImage } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBrands } from "@/store/slices/brandSlice";
import { resetImages, setExistingImages } from "@/store/slices/imageSlice";
import { Brand } from "@/types"; // Pastikan Anda mengimport interface Brand
import Image from "next/image";
import { useState } from "react";
import { FaPlus, FaPencil, FaTrash } from "react-icons/fa6";

export default function BrandsPage() {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan data yang sedang di-edit atau akan di-delete
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const { brands, isLoading } = useAppSelector((state) => state.brand);
  const { images } = useAppSelector((state) => state.image);
  const dispatch = useAppDispatch();

  // FUNGSI HANDLE ADD & EDIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const name = formData.get("name") as string;

    setLoading(true);
    try {
      let finalImageUrl = selectedBrand?.logo_url || "";

      // 1. Logika Upload Gambar Tunggal
      // Cek apakah ada file baru yang diunggah di state Redux
      if (images.length > 0 && images[0].file) {
        // Jika ini proses EDIT, hapus gambar lama dari storage terlebih dahulu
        if (selectedBrand?.logo_url) {
          await deleteStorageFile(selectedBrand.logo_url);
        }

        // Upload gambar baru (hanya dilakukan SEKALI di sini)
        console.log("Uploading new image...");
        finalImageUrl = await uploadBrandImage(images[0].file);
      } else if (!selectedBrand && images.length === 0) {
        // Jika ADD tapi tidak ada gambar
        throw new Error("Logo image is required");
      }

      // 2. Logika Database
      if (selectedBrand) {
        // PROSES EDIT
        const updatedBrand = await brandService.updateBrand(selectedBrand.id, {
          name,
          logo_url: finalImageUrl, // Menggunakan URL hasil upload di atas (atau URL lama jika tidak ganti)
        });

        dispatch(
          setBrands(
            brands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
          )
        );
        setAlert({ message: "Brand updated successfully!", type: "success" });
      } else {
        // PROSES ADD
        const newBrand = await brandService.createBrand({
          name,
          logo_url: finalImageUrl,
        });
        dispatch(setBrands([...brands, newBrand]));
        setAlert({ message: "Brand created successfully!", type: "success" });
      }

      setOpen(false);
      resetForm();
    } catch (err: unknown) {
      console.error("SUBMIT ERROR:", err);
      if (err instanceof Error) {
        setAlert({ message: err.message || "Operation failed", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI HANDLE DELETE
  const handleDelete = async () => {
    if (!selectedBrand) return;
    setLoading(true);
    try {
      await deleteStorageFile(selectedBrand.logo_url || "");
      await brandService.deleteBrand(selectedBrand.id);
      dispatch(setBrands(brands.filter((b) => b.id !== selectedBrand.id)));
      setAlert({ message: "Brand deleted successfully!", type: "success" });
      setOpenDelete(false);
      setSelectedBrand(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAlert({
          message: err.message || "Failed to delete brand",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedBrand(null);
    dispatch(resetImages());
  };

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    // Masukkan gambar existing ke imageSlice agar muncul di preview ImageUploadForm
    dispatch(setExistingImages([brand.logo_url ?? ""]));
    setOpen(true);
  };

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onDismiss={() => setAlert(null)}
        />
      )}

      <div className="w-full min-h-screen p-5 flex flex-col gap-5">
        <div className="w-full flex justify-between items-center gap-5">
          <div>
            <h1 className="text-2xl font-bold font-heading font-fira-code">
              Brand List
            </h1>
            <p className="text-zinc-400 text-sm">Manage brand.</p>
          </div>

          {/* DIALOG ADD / EDIT */}
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <button className="px-4 py-2 flex items-center gap-2 text-sm text-zinc-50 font-bold bg-teal-600 hover:bg-teal-500 rounded">
                <FaPlus /> Brand
              </button>
            </DialogTrigger>
            <DialogContent className="border-none bg-zinc-800 rounded-xl">
              <DialogTitle className="font-extrabold">
                {selectedBrand ? "Edit Brand" : "Add Brand"}
              </DialogTitle>
              <DialogCustom onSubmit={handleSubmit}>
                <DashboardInput
                  title="Name"
                  name="name"
                  type="text"
                  defaultValue={selectedBrand?.name}
                  required
                />
                <ImageUploadForm />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-zinc-500"
                >
                  {loading
                    ? "Processing..."
                    : selectedBrand
                    ? "Update Brand"
                    : "Add Brand"}
                </button>
              </DialogCustom>
            </DialogContent>
          </Dialog>
        </div>

        {/* DIALOG DELETE CONFIRMATION */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="bg-zinc-800 border-none text-white">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete the
              brand <strong>{selectedBrand?.name}</strong>.
            </DialogDescription>
            <DialogFooter className="flex gap-2">
              <button
                onClick={() => setOpenDelete(false)}
                className="px-4 py-2 bg-zinc-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 rounded disabled:bg-red-800"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <GlassContainer>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-300 uppercase text-xs font-fira-code">
                <th className="px-6 py-4">Logo</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3}>
                    <Loading />
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10">
                    No brand found
                  </td>
                </tr>
              ) : (
                brands.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-zinc-700/50 border-b border-zinc-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={b.logo_url || ""}
                          alt={b.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">{b.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(b)}
                          className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded transition-all"
                        >
                          <FaPencil />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBrand(b);
                            setOpenDelete(true);
                          }}
                          className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition-all"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </GlassContainer>
      </div>
    </>
  );
}
