import { createSlice } from "@reduxjs/toolkit";
import { deleteCourt, deleteVenue } from "./venueActions";
const initialState = {
  isDeleting: false,
  isDeleted: false,
  isError: false,
  errorMessage: "",
};

const deleteVenueSlice = createSlice({
  name: "deleteVenue",
  initialState,
 
  extraReducers: (builder) => {
    builder
      .addCase(deleteVenue.pending, (state) => {
        state.isDeleting = true;
        state.isDeleted = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteVenue.fulfilled, (state, { payload }) => {
        state.isDeleting = false;
        state.isDeleted = true;
      })
      .addCase(deleteVenue.rejected, (state, { payload }) => {
        state.isDeleting = false;
        state.isDeleted = false;
        state.isError = true;
        state.errorMessage = payload.data.message;
      });
  },
});

export default deleteVenueSlice.reducer;
