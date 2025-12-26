import { validateImage } from "@/utils/validateImage";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addImages, removeImageByIndex } from "@/store/slices/imageSlice";

export default function ImageUploadForm() {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.image.images);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(() => {
    return (images ?? []).map((file) => URL.createObjectURL(file));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      try {
        validateImage(file);
        validFiles.push(file);
      } catch (err) {
        if (err instanceof Error) alert(err.message);
      }
    }
    dispatch(addImages(validFiles));
  };

  const handleRemoveImage = (index: number) => {
    dispatch(removeImageByIndex(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    handleFiles(e.target.files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {/* ==== UPLOAD IMAGE ==== */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition
                            ${
                              isDragging
                                ? "border-teal-500 bg-teal-50"
                                : "border-zinc-300 dark:border-zinc-700"
                            }`}
      >
        <p className="text-sm">
          Drag & drop gambar di sini atau{" "}
          <span className="ml-1 text-teal-500 font-extrabold">
            klik untuk upload
          </span>
        </p>

        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageChange}
        />
      </div>

      {/* ==== PREVIEW IMAGE ==== */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2 border border-zinc-200 dark:border-zinc-800 rounded p-3">
          {previews.map((src, index) => (
            <div key={src} className="relative rounded">
              <Image
                src={src}
                width={200}
                height={200}
                alt={`Preview ${index + 1}`}
                className="h-32 w-full object-cover rounded"
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white hover:bg-rose-50 p-2 rounded-full shadow"
              >
                <FaTrash className="text-sm text-rose-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
