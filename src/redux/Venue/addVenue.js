import { createSlice } from "@reduxjs/toolkit";
import { addVenue } from "./venueActions";
const initialState = {
  venueDetails: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: null,
  showCreateVenueForm: false,
  location: {},
};
const venueSlice = createSlice({
  name: "Venue",
  initialState,
  reducers: {
    showForm(state) {
      state.showCreateVenueForm = !state.showCreateVenueForm;
    },
    setLocation(state, { payload }) {
      state.location = payload;
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
      state.errorMessage = payload.data.message;
    });
  },
});

export const { showForm, setLocation } = venueSlice.actions;

export default venueSlice.reducer;
