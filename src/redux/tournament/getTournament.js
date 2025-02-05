import { createSlice } from "@reduxjs/toolkit";
import {
  getAllBookings,
  getAllTournaments,
  getSingleTournament,
} from "./tournamentActions";

const initialState = {
  isGettingTournament: false,
  hasErrorInTournament: false,
  tournament: {},
  isSuccess: false,
  errorMessage: "",
  tournaments: [],
  totalTournaments: 0,
  tournamentEditMode: false,
  isGettingBookings: false,
  bookingError: false,
  bookings: [],
  selectedFilter: "all",
};

const getTournament = createSlice({
  name: "GET_TOUR",
  initialState,
  reducers: {
    setTournamentEditMode(state) {
      state.tournamentEditMode = !state.tournamentEditMode;
    },
    onTour_FilterChange(state, { payload }) {
      state.selectedFilter = payload;
    },

    resetEditMode(state) {
      state.tournamentEditMode = false;
    },
  },
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

    builder
      .addCase(getAllBookings.pending, (state) => {
        state.isGettingBookings = true;
        state.bookingError = false;
        state.bookings = [];
      })
      .addCase(getAllBookings.fulfilled, (state, { payload }) => {
        state.isGettingBookings = false;
        state.bookings = payload.data;
        state.bookingError = false;
      })
      .addCase(getAllBookings.rejected, (state) => {
        state.isGettingBookings = false;
        state.bookings = [];
        state.bookingError = true;
      });
  },
});

export const { setTournamentEditMode, onTour_FilterChange, resetEditMode } =
  getTournament.actions;

export default getTournament.reducer;
