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
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/login`,
        { identifier: email, password },
        config
      );

      cookies.set("refreshToken", response.data.data.refreshToken, {
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refresh",
  async (tokens, { rejectWithValue }) => {
    try {
      return tokens;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = cookies.get("refreshToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken,
        },
      };

      await axios.delete("/users/auth/logout", config);
      cookies.remove("refreshToken", { path: "/" });
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
