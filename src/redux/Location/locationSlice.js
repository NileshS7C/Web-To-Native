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
  },
});

export const { setGlobalLocation } = locationSlice.actions;

export default locationSlice.reducer
