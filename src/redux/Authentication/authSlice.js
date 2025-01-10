import { createSlice } from "@reduxjs/toolkit";
import { refreshTokens, userLogout, userLogin } from "./authActions";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

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
    refreshToken: cookies.get("refreshToken") || null,
    userRole: null,
    isLoggedOut: false,
    isUserAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
      state.isUserAuthenticated = false;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.userPermissions = payload.userPermissions;
      state.accessToken = payload.data.accessToken;
      state.refreshToken = payload.data.refreshToken;
      state.userInfo = payload.user;
      state.isUserAuthenticated = true;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isAuthenticationFailed = true;
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload;
      state.isUserAuthenticated = false;
    });

    // Refresh token cases
    builder.addCase(refreshTokens.fulfilled, (state, { payload }) => {
      state.accessToken = payload.data.accessToken;
    });
    builder.addCase(refreshTokens.rejected, (state) => {
      state.isAuthenticationFailed = true;
    });

    // Logout cases
    builder
      .addCase(userLogout.pending, (state) => {
        state.isUserAuthenticated = false;
        state.isLoggedOut = false;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isAuthenticationFailed = false;
        state.userInfo = null;
        state.isLoading = false;
        state.isLoggedOut = true;
        state.errorMessage = "";
        state.userPermissions = null;
        state.accessToken = null;
        state.isUserAuthenticated = true;
        state.refreshToken = null;
      })
      .addCase(userLogout.rejected, (state, { payload }) => {
        state.errorMessage = payload;
        state.isLoggedOut = false;
        state.isLoading = false;
        state.isUserAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
