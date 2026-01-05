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
import { categoryService } from "@/services/category.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories } from "@/store/slices/categorySlice";
import { Category } from "@/types";
import { useState } from "react";
import { FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
import Image from "next/image";

export default function CategoriesPage() {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { categories, isLoading } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();

  const resetForm = () => {
    setSelectedCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const name = formData.get("name") as string;

    setLoading(true);
    try {
      if (selectedCategory) {
        // PROSES EDIT
        const updatedCategory = await categoryService.updateCategory(
          selectedCategory.id,
          {
            name,
          }
        );

        dispatch(
          setCategories(
            categories.map((b) =>
              b.id === updatedCategory.id ? updatedCategory : b
            )
          )
        );
        setAlert({
          message: "Category updated successfully!",
          type: "success",
        });
      } else {
        // PROSES ADD
        const newCategories = await categoryService.createCategory({
          name,
        });
        dispatch(setCategories([...categories, newCategories]));
        setAlert({
          message: "Category created successfully!",
          type: "success",
        });
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
    if (!selectedCategory) return;
    setLoading(true);
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      dispatch(
        setCategories(categories.filter((b) => b.id !== selectedCategory.id))
      );
      setAlert({ message: "Category deleted successfully!", type: "success" });
      setOpenDelete(false);
      setSelectedCategory(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAlert({
          message: err.message || "Failed to delete category",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
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
              Category List
            </h1>
            <p className="text-zinc-400 text-sm">Manage Category.</p>
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
                <FaPlus /> Category
              </button>
            </DialogTrigger>
            <DialogContent className="border-none bg-zinc-800 rounded-xl">
              <DialogTitle className="font-extrabold">
                {selectedCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
              <DialogCustom onSubmit={handleSubmit}>
                <DashboardInput
                  title="Name"
                  name="name"
                  type="text"
                  defaultValue={selectedCategory?.name}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-zinc-500"
                >
                  {loading
                    ? "Processing..."
                    : selectedCategory
                    ? "Update Category"
                    : "Add Category"}
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
              Category <strong>{selectedCategory?.name}</strong>.
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-zinc-700/50 border-b border-zinc-800/50"
                  >
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded transition-all"
                        >
                          <FaPencil />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(c);
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
