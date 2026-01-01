import { Review } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface ReviewState {
  productReviews: Review[]; // Ulasan untuk halaman detail produk
  pendingReviews: Review[]; // Ulasan yang belum dibalas (Admin)
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  productReviews: [],
  pendingReviews: [],
  isLoading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviewLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProductReviews: (state, action: PayloadAction<Review[]>) => {
      state.productReviews = action.payload;
      state.isLoading = false;
    },
    setPendingReviews: (state, action: PayloadAction<Review[]>) => {
      state.pendingReviews = action.payload;
      state.isLoading = false;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.productReviews.unshift(action.payload);
    },
    updateReviewReply: (
      state,
      action: PayloadAction<{ id: string; reply: string; repliedAt: string }>
    ) => {
      const { id, reply, repliedAt } = action.payload;

      // Update di daftar pending (Admin)
      state.pendingReviews = state.pendingReviews.filter((r) => r.id !== id);

      // Update di daftar produk jika review tersebut ada di sana
      const index = state.productReviews.findIndex((r) => r.id === id);
      if (index !== -1) {
        state.productReviews[index].admin_reply = reply;
        state.productReviews[index].replied_at = repliedAt;
      }
    },
    setReviewError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setReviewLoading,
  setProductReviews,
  setPendingReviews,
  addReview,
  updateReviewReply,
  setReviewError,
} = reviewSlice.actions;

export default reviewSlice.reducer;

export const selectHasReviewed = (state: RootState, orderId: string) =>
  state.review.productReviews.some((review) => review.order_id === orderId);
