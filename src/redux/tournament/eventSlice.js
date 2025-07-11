import { createSlice } from "@reduxjs/toolkit";
import {
  addEventCategory,
  getAllCategories,
  getSingleCategory,
} from "./tournamentActions";

const initialState = {
  showModal: false,
  categoriesId: [],
  categories: [],
  isLoading: false,
  hasError: false,
  currentPage: 1,
  totalCategories: 0,
  eventId: "",
  category: {},
  loadingSingleCategory: false,
  singleCategoryError: false,
  singleCategorySuccess: false,
  showConfirmBookingModal: false,
  deleteCategoryId: "",
  errorMessage: "",
};
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    toggleModal(state, { payload }) {
      state.showModal = !state.showModal;
      // Reset event data when modal is closed
      if (!state.showModal) {
        state.eventId = "";
        state.category = {};
        state.loadingSingleCategory = false;
        state.singleCategorySuccess = false;
        state.singleCategoryError = false;
      }
    },

    toggleBookingModal(state) {
      state.showConfirmBookingModal = !state.showConfirmBookingModal;
    },
    resetCurrentPage(state){
         state.currentPage=1;
    },
    onPageChangeEvent(state, { payload }) {
      state.currentPage = Number(payload);
    },
    setEventId(state, { payload }) {
      state.eventId = payload;
    },

    resetAllCategories(state) {
      state.categories = [];
    },
    setDeleteCategoryId(state, { payload }) {
      state.deleteCategoryId = payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addEventCategory.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(addEventCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.hasError = false;
        state.categoriesId = [...state.categoriesId, payload.data.category._id];
      })
      .addCase(addEventCategory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = payload?.message || "Failed to create event";
      });

    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.hasError = false;
        state.categories = payload?.data?.categories || [];
        state.totalCategories = payload?.data?.total || 0;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      });

    builder
      .addCase(getSingleCategory.pending, (state) => {
        state.loadingSingleCategory = true;
        state.category = {};
        state.singleCategorySuccess = false;
        state.singleCategoryError = false;
      })
      .addCase(getSingleCategory.fulfilled, (state, { payload }) => {
        state.category = payload.data.category;
        state.loadingSingleCategory = false;
        state.singleCategorySuccess = true;
      })
      .addCase(getSingleCategory.rejected, (state) => {
        state.singleCategoryError = true;
        state.category = {};
        state.loadingSingleCategory = false;
        state.singleCategorySuccess = false;
      });
  },
});

export const {
  toggleModal,
  onPageChangeEvent,
  setEventId,
  toggleBookingModal,
  resetAllCategories,
  setDeleteCategoryId,
  resetCurrentPage,
} = eventSlice.actions;

export default eventSlice.reducer;
