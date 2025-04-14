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
  venueTabs: [
    { name: "Overview", href: "#", current: true, path: "/overview" },
    { name: "Courts", href: "#", current: false, path: "/courts" },
  ],

  venueEditMode: false,
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
    resetVenueState(state) {
      state.venueDetails = {};
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = "";
      state.location = {};
      state.venueEditMode = false;
    },
    setTabs(state, { payload }) {
      state.venueTabs = payload;
    },

    setVenueEditMode(state) {
      state.venueEditMode = !state.venueEditMode;
    },

    resetVenueEditMode(state) {
      state.venueEditMode = false;
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

export const {
  showForm,
  setLocation,
  resetVenueState,
  setTabs,
  setVenueEditMode,
  resetVenueEditMode,
} = venueSlice.actions;

export default venueSlice.reducer;
