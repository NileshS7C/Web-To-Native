import { createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "./uploadActions";

const initialState = {
  isUploading: false,
  isUploded: false,
  isErrorInUploading: false,
  uploadErrorMessage: "",
  uplodedData: {},
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
  },
});

export const { cleanUpUpload } = uploadSlice.actions;

export default uploadSlice.reducer;
