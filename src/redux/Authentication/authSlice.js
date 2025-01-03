import { createSlice } from "@reduxjs/toolkit";
import { refreshTokens, userLogout, userLogin } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticationFailed: false,
    userInfo: null,
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
    userPermissions: null,
    accessToken: null,
    refreshToken: null,
    userRole: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.userPermissions = payload.userPermissions;
      state.accessToken = payload.data.accessToken;
      state.refreshToken = payload.data.refreshToken;
      state.userInfo = payload.user;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isAuthenticationFailed = true;
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload;
    });

    // Refresh token cases
    builder.addCase(refreshTokens.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    });
    builder.addCase(refreshTokens.rejected, (state) => {
      state.isAuthenticationFailed = true;
    });

    // Logout cases
    builder.addCase(userLogout.fulfilled, (state) => {
      state.isAuthenticationFailed = false;
      state.userInfo = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = "";
      state.userPermissions = null;
      state.accessToken = null;
      state.refreshToken = null;
    });
  },
});

export default authSlice.reducer;
