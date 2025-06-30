import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";
import axios from "axios";
import { setUser, resetPlayer } from "./userInfoSlice";

const cookies = new Cookies();

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/login`,
        { identifier: email, password },
        config
      );
     const userRoles = response.data.data.user.roleNames;
      cookies.set("userRoles",userRoles, {
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      });

      // Save email in userInfo
      dispatch(setUser({ user: response.data.data.user }));

      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "Some thing went wrong!",
        });
      }
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refresh",
  async (tokens, { rejectWithValue }) => {
    try {
      return tokens;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/logout`,
        config
      );

      cookies.remove("userRoles", { path: "/" });

      // Remove email from userInfo
      dispatch(resetPlayer());

      return true;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);
