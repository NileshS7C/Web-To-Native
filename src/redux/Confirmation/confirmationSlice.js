import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  onClose: null,
  isConfirmed: false,
  message: "",
  type: "",
  confirmationId: "",
  withComments: false,
};

const confirmationSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showConfirmation(state, { payload }) {
      state.isOpen = true;
      state.message = payload.message;
      state.type = payload.type;
      state.isConfirmed = false;
      state.onClose = null;
      state.confirmationId = payload.id;
      state.withComments = payload.withComments;
    },
    onConfirm(state, { payload }) {
      state.isConfirmed = true;
      //  state.isOpen = false;
    },
    onCancel(state) {
      state.onClose = null;
      state.isOpen = false;
      state.isConfirmed = false;
      state.type = "";
      state.message = "";
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

export const { showConfirmation, onConfirm, onCancel, resetConfirmationState } =
  confirmationSlice.actions;

export default confirmationSlice.reducer;
