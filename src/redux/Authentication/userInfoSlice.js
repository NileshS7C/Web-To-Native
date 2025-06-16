import { createSlice } from "@reduxjs/toolkit";

const defaultPlayer = {
  email: "",
  id: "",
  roleNames: [],
};

const userInfoSlice = createSlice({
  name: 'user',
  initialState: defaultPlayer,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload?.user?.email || "";
      state.id = action.payload?.user?.id || "";
      state.roleNames = action.payload?.user?.roleNames || [];
    },    
    resetPlayer: () => ({ ...defaultPlayer }),
  }
});

export const { setUser, resetPlayer } = userInfoSlice.actions;
export default userInfoSlice.reducer;
