import { createSlice } from "@reduxjs/toolkit";
import { getAllVenues, getSingleVenue, publishVenue } from "./venueActions";

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
  isPublishing: false,
  isPublished: true,
  isErrorInPublish: false,
  publishedErrorMessage: "",
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
    cleanPublishState(state) {
      state.isPublished = false;
      state.isErrorInPublish = false;
      state.isPublishing = false;
      state.publishedErrorMessage = "";
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
        state.errorMessage = payload.data.message;
      });

    builder
      .addCase(getSingleVenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleVenue.fulfilled, (state, { payload }) => {
        state.venue = payload.data;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(getSingleVenue.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.errorMessage = payload.message;
      });

    builder
      .addCase(publishVenue.pending, (state) => {
        state.isPublishing = true;
      })
      .addCase(publishVenue.fulfilled, (state) => {
        state.isPublished = true;
        state.isPublishing = false;
      })
      .addCase(publishVenue.rejected, (state, { payload }) => {
        state.isErrorInPublish = true;
        state.isPublished = false;
        state.isPublishing = false;
        state.publishedErrorMessage = payload.data.message;
      });
  },
});

export const { onPageChange, checkVenue, onFilterChange, cleanPublishState } =
  getVenuesSlice.actions;

export default getVenuesSlice.reducer;
