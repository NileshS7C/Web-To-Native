import { createSlice } from "@reduxjs/toolkit";
import {
  getAllVenues,
  getSingleVenue,
  getUniqueVenueTags,
  publishVenue,
} from "./venueActions";

const initialState = {
  venues: [],
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  totalVenues: 0,
  currentPage: 1,
  venueWithNoCourt: false,
  selectedFilter: "draft",
  venue: {},
  isPublishing: false,
  isPublished: true,
  isErrorInPublish: false,
  publishedErrorMessage: "",
  isGettingTags: "",
  uniqueTags: [],
  tagError: false,
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
      state.currentPage = 1;
    },
    cleanPublishState(state) {
      state.isPublished = false;
      state.isErrorInPublish = false;
      state.isPublishing = false;
      state.publishedErrorMessage = "";
    },
    setPublish(state) {
      state.isPublished = false;
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
        state.isErrorInPublish = false;
        state.isSuccess = false;
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

    builder
      .addCase(getUniqueVenueTags.pending, (state) => {
        state.isGettingTags = true;
        state.uniqueTags = [];
        state.tagError = false;
      })
      .addCase(getUniqueVenueTags.fulfilled, (state, { payload }) => {
        state.uniqueTags = payload.data;
        state.isGettingTags = false;
      })
      .addCase(getUniqueVenueTags.rejected, (state) => {
        state.isGettingTags = false;
        state.tagError = true;
      });
  },
});

export const { onPageChange, checkVenue, onFilterChange, cleanPublishState, setPublish } =
  getVenuesSlice.actions;

export default getVenuesSlice.reducer;
