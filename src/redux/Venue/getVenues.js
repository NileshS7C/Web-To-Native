import { createSlice } from "@reduxjs/toolkit";
import { getAllVenues, getSingleVenue } from "./venueActions";

const initialState = {
  venues: [],
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  totalVenues: 0,
  currentPage: 1,
  venueWithNoCourt: false,
  selectedFilter: "published",
  venue: {},
};

const getVenuesSlice = createSlice({
  name: "getVenue",
  initialState,
  reducers: {
    onPageChange(state, { payload }) {
      state.currentPage = payload;
    },
    checkVenue(state, { payload }) {
      state.venueWithNoCourt = payload;
    },
    onFilterChange(state, { payload }) {
      state.selectedFilter = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVenues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVenues.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.venues = payload.data.venues;
        state.totalVenues = payload.data.total;
      })
      .addCase(getAllVenues.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.errorMessage = payload.message;
      });

    builder
      .addCase(getSingleVenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleVenue.fulfilled, (state, { payload }) => {
        state.venue = payload.data[0];
        state.isSuccess = true;
      })
      .addCase(getSingleVenue.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.errorMessage = payload.message;
      });
  },
});

export const { onPageChange, checkVenue, onFilterChange } =
  getVenuesSlice.actions;

export default getVenuesSlice.reducer;
