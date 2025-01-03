import { createSlice } from "@reduxjs/toolkit";
import { addVenue } from "./venueActions";
const initialState = {
  venueDetails: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: null,
  showCreateVenueForm: false,
};
const venueSlice = createSlice({
  name: "Venue",
  initialState,
  reducers: {
    showForm(state) {
      state.showCreateVenueForm = !state.showCreateVenueForm;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addVenue.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addVenue.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.venueDetails = payload.data;
    });
    builder.addCase(addVenue.rejected, (state, { payload }) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.errorMessage = payload.message;
    });
  },
});

export const { showForm } = venueSlice.actions;

export default venueSlice.reducer;
