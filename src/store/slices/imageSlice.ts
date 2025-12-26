import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  images: File[] | null;
  isLoading: boolean;
}

const initialState: ImageState = {
  images: [],
  isLoading: true,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    addImages: (state, action: PayloadAction<File[]>) => {
      action.payload.forEach((file) => {
        state.images?.push(file as File);
      });
    },
    removeImageByIndex: (state, action: PayloadAction<number>) => {
      state.images = state.images?.filter(
        (_, i) => i !== action.payload
      ) as File[];
    },
    resetImages: (state) => {
      state.images = [];
    },
  },
});

export const { addImages, removeImageByIndex, resetImages } =
  imageSlice.actions;
export default imageSlice.reducer;
