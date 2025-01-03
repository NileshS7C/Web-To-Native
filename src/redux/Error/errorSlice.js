import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpen: false,
  message: "",
  onClose: null,
};
export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    showError(state, action) {
      state.isOpen = true;
      state.message = action.payload.message;
      state.onClose = action.payload.onClose;
    },
    hideError(state) {
      state.isOpen = false;
      state.message = "";
      state.onClose = null;
    },
  },
});

export const { showError, hideError } = errorSlice.actions;
export default errorSlice.reducer;
