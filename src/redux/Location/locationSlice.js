import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: {},
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setGlobalLocation(state, { payload }) {
      state.location = payload;
    },
    resetGlobalLocation(state) {
      state.location = {};
    },
  },
});

export const { setGlobalLocation, resetGlobalLocation } = locationSlice.actions;

export default locationSlice.reducer;
