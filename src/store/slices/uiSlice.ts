import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isModalOpen: boolean;
}

const initialState: UIState = {
  isModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { toggleModal, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
