import { Order, OrderStatus } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.isLoading = false;
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) => {
      const { id, status } = action.payload;

      // Update di list orders
      state.orders = state.orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
              cancel_reason: status === "canceled" ? null : order.cancel_reason,
            }
          : order
      );

      // Update currentOrder jika sedang dibuka
      if (state.currentOrder?.id === id) {
        state.currentOrder.status = status;
      }
    },
    setCancelReason: (
      state,
      action: PayloadAction<{ id: string; reason: string }>
    ) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index].cancel_reason = action.payload.reason;
      }
    },
    clearCancelReason: (state, action: PayloadAction<string>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload);
      if (index !== -1) {
        state.orders[index].cancel_reason = null;
      }
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  setOrderLoading,
  setOrderError,
  addOrder,
  updateStatus,
  setCancelReason,
  clearCancelReason,
} = orderSlice.actions;

export default orderSlice.reducer;
