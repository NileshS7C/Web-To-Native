import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    showModal: false,
  },
  reducers: {
    toggleModal(state, { payload }) {
      state.showModal = !state.showModal;
    },
  },
});

export const { toggleModal } = eventSlice.actions;

export default eventSlice.reducer;
