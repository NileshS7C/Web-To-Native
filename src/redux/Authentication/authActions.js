import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";
import axios from "axios";
import { resetPlayer, setUser } from "./userInfoSlice";

const cookies = new Cookies();

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
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

      const user = response.data.data?.user;

      // Save user role in cookies
      cookies.set("userRole", user?.roleName, {
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      });

      // Dispatch user email to userInfoSlice
      dispatch(setUser({ user: { email: user.email } }));

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response
          ? {
              status: err.response.status,
              data: err.response.data,
              message: err.message,
            }
          : { message: err.message || "Something went wrong!" }
      );
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
  async (_, { dispatch, rejectWithValue }) => {
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

      cookies.remove("userRole", { path: "/" });

      // Reset user state
      dispatch(resetPlayer());

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response
          ? {
              status: err.response.status,
              data: err.response.data,
              message: err.message,
            }
          : { message: err.message || "An unknown error occurred" }
      );
    }
  }
);
