import { createSlice } from "@reduxjs/toolkit";
import { getAllTournaments, getSingleTournament } from "./tournamentActions";

const initialState = {
  isGettingTournament: false,
  hasErrorInTournament: false,
  tournament: {},
  isSuccess: false,
  errorMessage: "",
  tournaments: [],
  totalTournaments: 0,
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

    builder
      .addCase(getAllTournaments.pending, (state) => {
        state.isGettingTournament = true;
        state.isSuccess = false;
        state.hasErrorInTournament = false;
        state.tournaments = [];
      })
      .addCase(getAllTournaments.fulfilled, (state, { payload }) => {
        state.isGettingTournament = false;
        state.isSuccess = true;
        state.hasErrorInTournament = false;
        state.tournaments = payload.data.tournaments;
        state.totalTournaments = payload.data.total;
      })
      .addCase(getAllTournaments.rejected, (state, { payload }) => {
        state.isGettingTournament = false;
        state.isSuccess = false;
        state.hasErrorInTournament = true;
        state.tournaments = [];
      });
  },
});

export default getTournament.reducer;
