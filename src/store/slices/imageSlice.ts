import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageItem {
  id: string;
  type: "existing" | "new";
  url: string;
  file?: File;
}

interface ImageState {
  images: ImageItem[];
  isLoading: boolean;
}

const initialState: ImageState = {
  images: [],
  isLoading: false,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setExistingImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload.map((url) => ({
        id: crypto.randomUUID(),
        type: "existing",
        url,
      }));
    },

    addImages: (state, action: PayloadAction<File[]>) => {
      const newImages: ImageItem[] = action.payload.map((file) => ({
        id: crypto.randomUUID(),
        type: "new",
        file,
        url: URL.createObjectURL(file),
      }));

      state.images.push(...newImages);
    },

    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(
        (image) => image.id !== action.payload
      );
    },

    resetImages: () => initialState,
  },
});

export const { setExistingImages, addImages, removeImage, resetImages } =
  imageSlice.actions;
export default imageSlice.reducer;
