import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  isLoading: "",
  isError: "",
  isSuccess: "",
};

const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState,
  reducers: {},
});

export default aboutUsSlice.reducer;
