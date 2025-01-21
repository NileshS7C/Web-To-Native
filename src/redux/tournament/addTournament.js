import { createSlice } from "@reduxjs/toolkit";
import { getAll_TO, getAllUniqueTags } from "./tournamentActions";

const addTournamentSteps = ["basic info", "event", "acknowledgement"];

const tournamentSlice = createSlice({
  name: "Tournament",
  initialState: {
    tounrnaments: [],
    error: null,
    isLoading: false,
    currentStep: addTournamentSteps[0],
    selectedFiles: [],
    bannerMobileFiles: [],
    sponserFiles: [],
    spnonserTable: [],
    spnoserName: "",
    isRowAdded: false,
    isEditClicked: false,
    editRowIndex: "",
    location: {},
    isGettingALLTO: false,
    err_IN_TO: false,
    tournamentOwners: [],
    isGettingTags: false,
    tags: [],
    hasTagError: false,
    tournamentId: null,
  },
  reducers: {
    setFormOpen(state, action) {
      state.currentStep = action.payload;
    },
    updateFiles(state, action) {
      if (action.payload.source === "desktop") {
        state.selectedFiles = [action.payload.name];
      } else if (action.payload.source === "mobile") {
        state.bannerMobileFiles = [action.payload.name];
      } else if (action.payload.source === "sponsor") {
        state.sponserFiles = [action.payload.name];
      } else {
        return;
      }
    },

    setTournamentId(state, { payload }) {
      state.tournamentId = payload;
    },

    removeFiles: {
      reducer(state, action) {
        const { file, source } = action.payload;

        if (source === "mobile") {
          state.bannerMobileFiles.pop(file);
        } else if (source === "desktop") {
          state.selectedFiles.pop(file);
        } else if (source === "sponsor") {
          state.sponserFiles.pop(file);
        } else {
          return;
        }
      },
      prepare(file, source) {
        return {
          payload: { file, source },
        };
      },
    },

    addSponserRow(state, action) {
      state.spnonserTable = !state.spnonserTable.some(
        (row) => row.name === action.payload.trim()
      )
        ? [
            ...state.spnonserTable,
            { url: state.sponserFiles[0], name: state.spnoserName },
          ]
        : state.spnonserTable;
      state.sponserFiles = [];
      state.isRowAdded = true;
    },
    setSponserName(state, action) {
      state.spnoserName = action.payload;
    },

    deleteRow(state, action) {
      state.spnonserTable = state.spnonserTable.filter(
        (row) => row.name !== action.payload
      );
    },

    editRow(state, action) {
      state.isEditClicked = true;
      state.editRowIndex = action.payload;
    },

    stepReducer(state, { payload }) {
      const currentStep = addTournamentSteps.findIndex(
        (el) => el === payload.trim()
      );

      if (currentStep !== -1) {
        state.currentStep = addTournamentSteps[currentStep + 1];
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAll_TO.pending, (state) => {
        state.isGettingALLTO = true;
        state.err_IN_TO = false;
        state.tournamentOwners = [];
      })
      .addCase(getAll_TO.fulfilled, (state, { payload }) => {
        state.isGettingALLTO = false;
        state.err_IN_TO = false;
        state.tournamentOwners = payload.data;
      })
      .addCase(getAll_TO.rejected, (state) => {
        state.getAll_TO = false;
        state.err_IN_TO = true;
        state.tournamentOwners = [];
      });

    builder
      .addCase(getAllUniqueTags.pending, (state) => {
        state.isGettingTags = true;
        state.hasTagError = false;
        state.tags = [];
      })
      .addCase(getAllUniqueTags.fulfilled, (state, { payload }) => {
        state.isGettingTags = false;
        state.tags = payload.data;
        state.hasTagError = false;
      })
      .addCase(getAllUniqueTags.rejected, (state) => {
        state.hasTagError = true;
        state.tags = [];
        state.isGettingTags = false;
      });
  },
});
export const {
  setFormOpen,
  updateFiles,
  removeFiles,
  addSponserRow,
  setSponserName,
  deleteRow,
  editRow,
  stepReducer,
  setLocation,
  setTournamentId,
} = tournamentSlice.actions;
export default tournamentSlice.reducer;
