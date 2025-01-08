import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  onClose: null,
  isConfirmed: false,
  message: "",
  type: "",
};

const confirmationSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showConfirmation(state, { payload }) {
      state.isOpen = true;
      state.message = payload.message;
      state.type = payload.type;
    },
    onCofirm(state) {
      state.isConfirmed = true;
    },
    onCancel(state) {
      state.onClose = null;
      state.isOpen = false;
    },
    resetConfirmationState(state) {
      state.onClose = null;
      state.isOpen = false;
      state.isConfirmed = false;
      state.type = "";
      state.message = "";
    },
  },
});

export const { showConfirmation, onCofirm, onCancel, resetConfirmationState } =
  confirmationSlice.actions;

export default confirmationSlice.reducer;
