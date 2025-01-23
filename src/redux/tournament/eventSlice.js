import { createSlice } from "@reduxjs/toolkit";
import { addEventCategory, getAllCategories } from "./tournamentActions";

const initialState = {
  showModal: false,
  categoriesId: [],
  categories: [],
  isLoading: false,
  hasError: false,
  currentPage: 1,
  totalCategories: 0,
};
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    toggleModal(state, { payload }) {
      state.showModal = !state.showModal;
    },
    onPageChangeEvent(state, { payload }) {
      state.currentPage = payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addEventCategory.fulfilled, (state, { payload }) => {
      state.categoriesId = [...state.categoriesId, payload.data.category._id];
    });

    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.hasError = false;
        state.categories = payload.data.categories;
        state.totalCategories = payload.total;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      });
  },
});

export const { toggleModal, onPageChangeEvent } = eventSlice.actions;

export default eventSlice.reducer;
