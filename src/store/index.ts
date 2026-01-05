import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import imageReducer from "./slices/imageSlice";
import uiReducer from "./slices/uiSlice";
import cartReducer from "./slices/cartSlice";
import addressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";
import brandReducer from "./slices/brandSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    image: imageReducer,
    ui: uiReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    review: reviewReducer,
    brand: brandReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Abaikan check serializable untuk path spesifik di state image
        ignoredActions: ["image/addImages", "image/setImages"], // Sesuaikan dengan nama action Anda
        ignoredPaths: ["image.images"], // Abaikan pengecekan pada array images di state
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
