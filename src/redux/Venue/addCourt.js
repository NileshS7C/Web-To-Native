import { createSlice } from "@reduxjs/toolkit";
import {
  createCourt,
  deleteCourt,
  getCourt,
  updateCourt,
} from "./venueActions";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  isDeleting: false,
  isDeleted: false,
  isGettingCourt: false,
  court: {},
  courtName: "",
  isCourtEditOrUpdated: false,
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
    resetCourtState(state) {
      state.court = {};
      state.isGettingCourt = false;
      state.errorMessage = "";
      state.isDeleted = false;
      state.isSuccess = false;
      state.isLoading = false;
    },

    setCourtName(state, { payload }) {
      state.courtName = payload;
    },
    setCourtStatus(state, { payload }) {
      state.isCourtEditOrUpdated = payload;
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
        state.errorMessage = payload?.data?.message;
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
        state.errorMessage = payload?.data?.message;
      });

    builder
      .addCase(getCourt.pending, (state) => {
        state.isGettingCourt = true;
      })
      .addCase(getCourt.fulfilled, (state, { payload }) => {
        state.isSuccess = true;
        state.isGettingCourt = false;
        state.court = payload.data;
      })
      .addCase(getCourt.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isGettingCourt = false;
        state.isError = true;
        state.errorMessage = payload?.data?.message;
      });

    builder
      .addCase(updateCourt.pending, (state) => {
        state.isGettingCourt = true;
      })
      .addCase(updateCourt.fulfilled, (state, { payload }) => {
        state.isSuccess = true;
        state.isGettingCourt = false;
        state.court = payload.data;
      })
      .addCase(updateCourt.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isGettingCourt = false;
        state.isError = true;
        state.errorMessage = payload?.data?.message;
      });
  },
});
export const {
  resetDeleteState,
  resetErrorState,
  resetCourtState,
  setCourtName,
  setCourtStatus,
} = courtSlice.actions;
export default courtSlice.reducer;
