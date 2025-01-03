import { createSlice } from "@reduxjs/toolkit";

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
} = tournamentSlice.actions;
export default tournamentSlice.reducer;
