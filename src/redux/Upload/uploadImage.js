import { createSlice } from "@reduxjs/toolkit";
import { uploadImage, deleteImages } from "./uploadActions";

const initialState = {
  isUploading: false,
  isUploded: false,
  isErrorInUploading: false,
  uploadErrorMessage: "",
  uplodedData: {},
  deleteImageDetails: [],
  deleteImageSuccess: false,
  deletedImages: [],
  isDeleting: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    cleanUpUpload(state) {
      state.isUploading = false;
      state.isUploded = false;
      state.isErrorInUploading = false;
      state.uploadErrorMessage = "";
      state.uplodedData = {};
    },

    setDeleteImageSuccess(state) {
      state.deleteImageSuccess = true;
    },
    resetDeleteImageSuccess(state) {
      state.deleteImageSuccess = false;
    },

    setDeleteImageDetails(state, { payload }) {
      state.deleteImageDetails = payload;
    },

    setIsUploaded(state) {
      state.isUploded = true;
    },
    resetDeleteImageDetails(state) {
      state.deleteImageDetails = [];
    },
    setDeletedImages(state, { payload }) {
      state.deletedImages = payload;
    },
    resetDeletedImages(state) {
      state.deletedImages = [];
      state.isDeleting = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadImage.fulfilled, (state, { payload }) => {
        state.isUploading = false;
        state.isUploded = true;
        state.uplodedData = payload.data;
      })
      .addCase(uploadImage.rejected, (state, { payload }) => {
        state.isUploading = false;
        state.isUploded = false;
        state.uploadErrorMessage = payload.message;
      });
    builder
      .addCase(deleteImages.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteImages.fulfilled, (state, { payload }) => {
        state.isDeleting = false;
      })
      .addCase(deleteImages.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const {
  cleanUpUpload,
  setIsUploaded,
  setDeleteImageSuccess,
  resetDeleteImageSuccess,
  setDeleteImageDetails,
  resetDeleteImageDetails,
  setDeletedImages,
  resetDeletedImages,
} = uploadSlice.actions;

export default uploadSlice.reducer;
