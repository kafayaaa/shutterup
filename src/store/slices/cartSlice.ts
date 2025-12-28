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
      // Gunakan filter untuk memastikan tidak ada data null/undefined yang masuk
      const validItems = action.payload.filter(
        (item) => item.slug !== undefined
      );

      return {
        ...state,
        items: validItems,
        isLoading: false,
      };
    },

    clearCart(state) {
      state.items = [];
      state.isLoading = false;
    },

    addCartItem(state, action: PayloadAction<CartItem>) {
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
    incrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
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
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
