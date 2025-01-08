import { createSlice } from "@reduxjs/toolkit";
import { createCourt, deleteCourt } from "./venueActions";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  isDeleting: false,
  isDeleted: false,
};

const courtSlice = createSlice({
  name: "court",
  initialState,
  reducers: {
    resetDeleteState(state) {
      state.isDeleted = false;
    },
    resetErrorState(state) {
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCourt.fulfilled, (state, { payload }) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(createCourt.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload.data.message;
      });

    builder
      .addCase(deleteCourt.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteCourt.fulfilled, (state, { payload }) => {
        state.isDeleted = true;
        state.isDeleting = false;
      })
      .addCase(deleteCourt.rejected, (state, { payload }) => {
        state.isDeleting = false;
        state.isDeleted = false;
        state.isError = true;
        state.errorMessage = payload.data.message;
      });
  },
});
export const { resetDeleteState, resetErrorState } = courtSlice.actions;
export default courtSlice.reducer;
