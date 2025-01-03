import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    formData: {},
  },
  reducers: {
    saveFormData(state, { payload }) {
      state.formData = { ...state.formData, ...payload };
    },
  },
});

export const { saveFormData } = formSlice.actions;

export default formSlice.reducer;
