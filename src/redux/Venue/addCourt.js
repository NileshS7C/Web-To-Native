import { createSlice } from "@reduxjs/toolkit";
import { createCourt } from "./venueActions";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const courtSlice = createSlice({
  name: "court",
  initialState,
  reducers: {},
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
        console.log(" payload", payload)
        state.errorMessage = payload.message;
      });
  },
});

export default courtSlice.reducer;
