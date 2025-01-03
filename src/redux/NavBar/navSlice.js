import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: "Overview",
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setNavigation(state, action) {
      state.selected = action.payload;
    },
  },
});
export const { setNavigation } = navSlice.actions;

export default navSlice.reducer;
