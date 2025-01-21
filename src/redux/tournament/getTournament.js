import { createSlice } from "@reduxjs/toolkit";
import { getSingleTournament } from "./tournamentActions";

const initialState = {
  isGettingTournament: false,
  hasErrorInTournament: false,
  tournament: {},
  isSuccess: false,
  errorMessage: "",
};

const getTournament = createSlice({
  name: "GET_TOUR",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleTournament.pending, (state) => {
        state.isGettingTournament = true;
        state.isSuccess = false;
        state.hasErrorInTournament = false;
        state.tournament = {};
      })
      .addCase(getSingleTournament.fulfilled, (state, { payload }) => {
        state.tournament = payload.data.tournament;
        state.isSuccess = true;
        state.hasErrorInTournament = false;
        state.isGettingTournament = false;
      })
      .addCase(getSingleTournament.rejected, (state, { payload }) => {
        state.hasErrorInTournament = true;
        state.isGettingTournament = false;
        state.isSuccess = false;
        state.errorMessage = payload.message;
      });
  },
});

export default getTournament.reducer;
