import { createSlice } from "@reduxjs/toolkit";
import { createFixture, getFixture, updateMatch } from "./fixturesActions";

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
};
const fixtureSlice = createSlice({
  name: "fixture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFixture.pending, (state) => {
        state.isFetchingFixture = true;
        state.isFixtureSuccess = false;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixture.fulfilled, (state, { payload }) => {
        state.fixture = payload?.data ?? null;
        state.isFetchingFixture = false;
        state.isFixtureSuccess = true;
        state.isFetchingError = false;
        state.ErrorMessage = "";
      })
      .addCase(getFixture.rejected, (state, { payload }) => {
        state.isFetchingFixture = false;
        state.isFixtureSuccess = false;
        state.isFetchingError = true;
        state.ErrorMessage = payload.data.message;
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
  },
});

export default fixtureSlice.reducer;
