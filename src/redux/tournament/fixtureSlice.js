import { createSlice } from "@reduxjs/toolkit";
import {
  createFixture,
  getFixture,
  publishFixture,
  updateMatch,
  getFixtureById,
  getHybridFixtures,
} from "./fixturesActions";

const initialState = {
  status: "",
  isFetchingError: false,
  isFetchingFixture: false,
  isFixtureSuccess: false,
  fixture: null,
  isCreatingFixture: false,
  FixtureCreationError: false,
  FixtureCreatedSuccess: false,
  ErrorMessage: "",
  isUpdatingMatch: false,
  matchUpateSuccess: false,
  matchUpdateError: false,
  isPublishing: false,
  isPublished: false,
  publishError: false,
  fixtures: [],
  isFetchingHybridFixtures: false,
  isHybridFixtureSuccess: true,
  isHybridFetchingError: false,
};
const fixtureSlice = createSlice({
  name: "fixture",
  initialState,
  reducers: {
    resetFixtureSuccess(state) {
      state.isFixtureSuccess = false;
    },

    setFixture(state, { payload }) {
      state.fixture = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFixture.pending, (state) => {
        state.isFetchingFixture = true;
        state.isFixtureSuccess = false;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixture.fulfilled, (state, { payload }) => {
        state.fixture = payload?.data?.fixtures[0] ?? null;
        state.isFetchingFixture = false;
        state.isFixtureSuccess = true;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixture.rejected, (state, { payload }) => {
        state.isFetchingFixture = false;
        state.isFixtureSuccess = false;
        state.isFetchingError = true;
        state.ErrorMessage = payload?.data?.message;
      });
    builder
      .addCase(getHybridFixtures.pending, (state) => {
        state.isFetchingHybridFixtures = true;
        state.isHybridFixtureSuccess = false;
        state.isHybridFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getHybridFixtures.fulfilled, (state, { payload }) => {
        state.fixtures = payload?.data?.fixtures || [];
        state.isFetchingHybridFixtures = false;
        state.isHybridFixtureSuccess = true;
        state.isHybridFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getHybridFixtures.rejected, (state, { payload }) => {
        state.isFetchingHybridFixtures = false;
        state.isHybridFixtureSuccess = false;
        state.isHybridFetchingError = true;
        state.ErrorMessage = payload?.data?.message;
      });
    builder
      .addCase(getFixtureById.pending, (state) => {
        state.isFetchingFixture = true;
        state.isFixtureSuccess = false;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixtureById.fulfilled, (state, { payload }) => {
        state.fixture = payload?.data?.fixture;
        state.isFetchingFixture = false;
        state.isFixtureSuccess = true;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixtureById.rejected, (state, { payload }) => {
        state.isFetchingFixture = false;
        state.isFixtureSuccess = false;
        state.isFetchingError = true;
        state.ErrorMessage = payload?.data?.message;
      });
    builder
      .addCase(createFixture.pending, (state) => {
        state.isCreatingFixture = true;
        state.FixtureCreationError = false;
        state.FixtureCreatedSuccess = false;
        state.ErrorMessage = "";
      })
      .addCase(createFixture.fulfilled, (state, { payload }) => {
        state.isCreatingFixture = false;
        state.FixtureCreationError = false;
        state.fixture = payload?.data ?? null;
        state.FixtureCreatedSuccess = true;
        state.ErrorMessage = "";
      })
      .addCase(createFixture.rejected, (state, { payload }) => {
        state.isCreatingFixture = false;
        state.FixtureCreationError = true;
        state.FixtureCreatedSuccess = false;
        state.ErrorMessage = payload?.data?.message;
      });

    builder
      .addCase(updateMatch.pending, (state) => {
        state.isUpdatingMatch = true;
        state.matchUpateSuccess = false;
        state.matchUpdateError = false;
        state.ErrorMessage = "";
      })
      .addCase(updateMatch.fulfilled, (state, { payload }) => {
        state.isUpdatingMatch = false;
        state.matchUpateSuccess = true;
        state.matchUpdateError = false;
        state.ErrorMessage = "";
      })
      .addCase(updateMatch.rejected, (state, { payload }) => {
        state.isUpdatingMatch = false;
        state.matchUpateSuccess = false;
        state.matchUpdateError = true;
        state.ErrorMessage = payload?.data?.message;
      });

    builder
      .addCase(publishFixture.pending, (state) => {
        state.isPublishing = true;
        state.isPublished = false;
        state.publishError = false;
        state.ErrorMessage = "";
      })
      .addCase(publishFixture.fulfilled, (state) => {
        state.isPublishing = false;
        state.isPublished = true;
        state.publishError = false;
        state.ErrorMessage = "";
      })
      .addCase(publishFixture.rejected, (state, { payload }) => {
        state.isPublishing = false;
        state.isPublished = false;
        state.publishError = true;
        state.ErrorMessage = payload?.data?.message;
      });
  },
});

export const { resetFixtureSuccess, setFixture } = fixtureSlice.actions;

export default fixtureSlice.reducer;
