import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShippingAddress } from "@/types";

interface AddressState {
  addresses: ShippingAddress[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setAddresses: (state, action: PayloadAction<ShippingAddress[]>) => {
      state.addresses = action.payload;
      state.isLoading = false;
    },
    addAddressSuccess: (state, action: PayloadAction<ShippingAddress>) => {
      // Jika alamat baru adalah default, ubah yang lain jadi false
      if (action.payload.is_default) {
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          is_default: false,
        }));
      }
      state.addresses.unshift(action.payload);
      state.isLoading = false;
    },
    updateAddressSuccess: (state, action: PayloadAction<ShippingAddress>) => {
      if (action.payload.is_default) {
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === action.payload.id,
        }));
      } else {
        const index = state.addresses.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) state.addresses[index] = action.payload;
      }
      state.isLoading = false;
    },
    deleteAddressSuccess: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
      state.isLoading = false;
    },
    setAddressError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setAddressLoading,
  setAddresses,
  addAddressSuccess,
  updateAddressSuccess,
  deleteAddressSuccess,
  setAddressError,
} = addressSlice.actions;

export default addressSlice.reducer;
