import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";
import axios from "axios";

const cookies = new Cookies();

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
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

      cookies.set("userRole", response.data.data.user.roleName, {
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      });

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
  async (_, { rejectWithValue }) => {
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

      return null;
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
