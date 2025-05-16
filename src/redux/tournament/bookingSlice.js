import { createSlice } from "@reduxjs/toolkit";
import { createConfirmBooking } from "./tournamentActions";

const initialState = {
  isBookingConfirm: false,
  isBookingCreating: false,
  bookingCreationError: false,
  bookingErrorMessage: "",
  actionType: "",
};

const bookingSlice = createSlice({
  name: "tourBookings",
  initialState,
  reducers: {
    resetActionType(state) {
      state.actionType = "";
    },
    setAction(state, action) {
      state.actionType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConfirmBooking.pending, (state) => {
        state.isBookingCreating = true;
        state.isBookingConfirm = false;
        state.bookingCreationError = false;
        state.bookingErrorMessage = "";
      })
      .addCase(createConfirmBooking.fulfilled, (state, { payload }) => {
        state.isBookingCreating = false;
        state.isBookingConfirm = true;
        state.bookingCreationError = false;
        state.bookingErrorMessage = "";
      })
      .addCase(createConfirmBooking.rejected, (state, { payload }) => {
        state.isBookingCreating = false;
        state.isBookingConfirm = false;
        state.bookingCreationError = true;
        state.bookingErrorMessage = payload?.data?.message;
      });
  },
});

export const { resetActionType, setAction } = bookingSlice.actions;

export default bookingSlice.reducer;
