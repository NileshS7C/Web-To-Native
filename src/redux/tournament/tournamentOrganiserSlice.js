import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openOrganiserModal: false,
};

const tour_organiser_slice = createSlice({
  name: "tour_Org",
  initialState,
  reducers: {
    toggleOrganiserModal: (state, action) => {
      state.openOrganiserModal = action.payload !== undefined ? action.payload : !state.openOrganiserModal;
    },
  },
});

export const { toggleOrganiserModal } = tour_organiser_slice.actions;
export default tour_organiser_slice.reducer;
