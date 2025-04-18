import { createSlice } from "@reduxjs/toolkit";

const defaultPlayer = {
  email: ""
}

const userInfoSlice = createSlice({
  name: 'user',
  initialState: defaultPlayer,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload?.user?.email || "";
    },    
    resetPlayer: () => ({ ...defaultPlayer }),
  }
});

export const { setUser, resetPlayer } = userInfoSlice.actions;

export default userInfoSlice.reducer;