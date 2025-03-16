import { createSlice } from "@reduxjs/toolkit";
import {
  archiveTournament,
  getAll_TO,
  getAllUniqueTags,
  handleTournamentDecision,
} from "./tournamentActions";
import { approvalBody } from "../../Constant/tournament";

const addTournamentSteps = ["basic info", "event", "acknowledgement"];

const tournamentSlice = createSlice({
  name: "Tournament",
  initialState: {
    changingDecision: false,
    verificationError: false,
    verificationSuccess: false,
    verificationErrorMessage: "",
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
    tournament_Id: null,
    rejectionComments: "",
    isNotEditable: false,
    isConfirmed: false,
    approvalBody: { action: "APPROVE", rejectionComments: "" },
    pendingArchive: false,
    archived: false,
    archivedError: false,
    archivedErrorMessage: "",
  },

  reducers: {
    setRejectionComments(state, { payload }) {
      state.rejectionComments = payload;
    },
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
    confirmSubmission(state, { payload }) {
      state.isConfirmed = true;
    },

    setIsConfirmed(state, { payload }) {
      state.isConfirmed = payload;
    },
    setIsEditable(state, { payload }) {
      state.isNotEditable = payload;
    },
    setTournamentId(state, { payload }) {
      state.tournament_Id = payload;
    },

    setApprovalBody(state, { payload }) {
      state.approvalBody = payload;
    },

    resetVerificationState(state) {
      state.verificationSuccess = false;
      state.verificationError = false;
      state.verificationErrorMessage = "  ";
    },

    resetArchiveState(state) {
      state.archived = false;
      state.archivedError = false;
      state.archivedErrorMessage = false;
      state.archived = false;
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

    builder
      .addCase(handleTournamentDecision.pending, (state) => {
        state.changingDecision = true;
        state.verificationError = false;
        state.verificationSuccess = false;
        state.verificationErrorMessage = "";
      })
      .addCase(handleTournamentDecision.fulfilled, (state) => {
        state.verificationSuccess = true;
        state.changingDecision = false;
        state.verificationError = false;
        state.verificationErrorMessage = "";
      })
      .addCase(handleTournamentDecision.rejected, (state, { payload }) => {
        state.verificationSuccess = false;
        state.changingDecision = false;
        state.verificationError = true;
        state.verificationErrorMessage = payload.data.message;
      });

    builder
      .addCase(archiveTournament.pending, (state) => {
        state.pendingArchive = true;
        state.archived = false;
        state.archivedError = false;
        state.archivedErrorMessage = "";
      })
      .addCase(archiveTournament.fulfilled, (state) => {
        state.pendingArchive = false;
        state.archived = true;
        state.archivedError = false;
        state.archivedErrorMessage = "";
      })
      .addCase(archiveTournament.rejected, (state, { payload }) => {
        state.pendingArchive = false;
        state.archived = false;
        state.archivedError = true;
        state.archivedErrorMessage = payload?.data?.message;
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
  setRejectionComments,
  setIsEditable,
  confirmSubmission,
  setIsConfirmed,
  resetVerificationState,
  setApprovalBody,
  resetArchiveState,
} = tournamentSlice.actions;
export default tournamentSlice.reducer;
