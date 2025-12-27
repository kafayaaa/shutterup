import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  products: Product[];
  isLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  isLoading: true,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.isLoading = false;
    },
    clearProducts(state) {
      state.products = [];
      state.isLoading = false;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products?.unshift(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products?.filter(
        (product) => product.id !== action.payload
      ) as Product[];
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

export const {
  setProducts,
  clearProducts,
  addProduct,
  removeProduct,
  updateProduct,
} = productSlice.actions;
export default productSlice.reducer;
