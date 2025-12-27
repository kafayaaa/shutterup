import { CartItem } from "@/types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    clearCart(state) {
      state.items = [];
      state.isLoading = false;
    },

    addCartItem(state, action) {
      const index = state.items.findIndex(
        (item) => item.product_id === action.payload.product_id
      );

      if (index !== -1) {
        state.items[index].quantity += action.payload.quantity;
      } else {
        state.items.unshift(action.payload);
      }
    },

    removeCartItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateCartItem(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const {
  setCartItems,
  clearCart,
  addCartItem,
  removeCartItem,
  updateCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
