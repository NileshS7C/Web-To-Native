import { createSlice } from "@reduxjs/toolkit";
import {
  getAllBookings,
  getAllTournaments,
  getSingle_TO,
  getSingleTournament,
  searchTournament,
  getSearchBookings
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
  wasCancelled: false,
  isGettingBookings: false,
  bookingError: false,
  bookings: [],
  selectedFilter: "all",
  GettingSingleOwner: false,
  SingleOwnerError: false,
  singleTournamentOwner: null,
};

const getTournament = createSlice({
  name: "GET_TOUR",
  initialState,
  reducers: {
    setWasCancelled(state) {
      state.wasCancelled = !state.tournamentEditMode;
    },
    setTournamentEditMode(state) {
      state.tournamentEditMode = !state.tournamentEditMode;
    },
    onTour_FilterChange(state, { payload }) {
      state.selectedFilter = payload;
    },

    resetEditMode(state) {
      state.tournamentEditMode = false;
      state.wasCancelled = false;
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
      .addCase(searchTournament.pending, (state) => {
        state.isGettingTournament = true;
        state.isSuccess = false;
        state.hasErrorInTournament = false;
        state.tournaments = [];
      })
      .addCase(searchTournament.fulfilled, (state, { payload }) => {
        state.isGettingTournament = false;
        state.isSuccess = true;
        state.hasErrorInTournament = false;
        state.tournaments = payload.data.tournaments;
        state.totalTournaments = payload.data.total;
      })
      .addCase(searchTournament.rejected, (state, { payload }) => {
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
     builder
       .addCase(getSearchBookings.pending, (state) => {
         state.isGettingBookings = true;
         state.bookingError = false;
         state.bookings = [];
       })
       .addCase(getSearchBookings.fulfilled, (state, { payload }) => {
         state.isGettingBookings = false;
         state.bookings = payload.data;
         state.bookingError = false;
       })
       .addCase(getSearchBookings.rejected, (state) => {
         state.isGettingBookings = false;
         state.bookings = [];
         state.bookingError = true;
       });
    builder
      .addCase(getSingle_TO.pending, (state) => {
        state.GettingSingleOwner = true;
        state.singleTournamentOwner = null;
        state.SingleOwnerError = false;
      })
      .addCase(getSingle_TO.fulfilled, (state, { payload }) => {
        state.GettingSingleOwner = false;
        state.singleTournamentOwner = payload.data;
        state.SingleOwnerError = false;
      })
      .addCase(getSingle_TO.rejected, (state) => {
        state.GettingSingleOwner = false;
        state.singleTournamentOwner = null;
        state.SingleOwnerError = true;
      });
  },
});

export const {
  setTournamentEditMode,
  setWasCancelled,
  onTour_FilterChange,
  resetEditMode,
} = getTournament.actions;

export default getTournament.reducer;
