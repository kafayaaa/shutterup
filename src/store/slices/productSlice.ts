import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  products: Product[] | null;
  isLoading: boolean;
}

const initialState: ProductState = {
  products: null,
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
      state.products = null;
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
  },
});

export const { setProducts, clearProducts, addProduct, removeProduct } =
  productSlice.actions;
export default productSlice.reducer;
