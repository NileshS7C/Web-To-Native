import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  message: "",
  onClose: null,
};

export const successSlice = createSlice({
  name: "success",
  initialState,
  reducers: {
    showSuccess(state, action) {
      state.isOpen = true;
      state.message = action.payload.data.message;
      state.onClose = action.payload.onClose;
    },
    hideSuccess(state) {
      state.isOpen = false;
      state.message = "";
      state.onClose = null;
    },
  },
});

export const { showSuccess, hideSuccess } = successSlice.actions;

export default successSlice.reducer;
