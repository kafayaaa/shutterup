import { Brand } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BrandState {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  isLoading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrandLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBrandError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setBrandLoading, setBrandError, setBrands } = brandSlice.actions;

export default brandSlice.reducer;
