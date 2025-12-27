"use client";

import { validateImage } from "@/utils/validateImage";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addImages,
  removeImage,
  setExistingImages,
} from "@/store/slices/imageSlice";

interface Props {
  existingImages?: string[];
}

export default function ImageUploadForm({ existingImages }: Props) {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.image.images);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= INIT EXISTING IMAGES ================= */
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      dispatch(setExistingImages(existingImages));
    }
  }, [existingImages, dispatch]);

  /* ================= FILE HANDLER ================= */
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

    if (validFiles.length > 0) {
      dispatch(addImages(validFiles));
    }
  };

  /* ================= DRAG & DROP ================= */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= RENDER ================= */
  return (
    <div>
      {/* ==== UPLOAD AREA ==== */}
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
          Drag & drop here or
          <span className="ml-1 text-teal-500 font-extrabold">
            click to upload
          </span>
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageChange}
        />
      </div>

      {/* ==== PREVIEW ==== */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3 border border-zinc-300 dark:border-zinc-700 rounded p-3">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <Image
                src={image.url}
                width={200}
                height={200}
                alt="Preview"
                className="h-32 w-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => dispatch(removeImage(image.id))}
                className="absolute top-1 right-1 bg-white p-2 rounded-full shadow"
              >
                <FaTrash className="text-sm text-rose-500" />
              </button>

              {image.type === "existing" && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                  Existing
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
