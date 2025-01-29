import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";

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

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/login`,
        { identifier: email, password },
        config
      );

      console.log("response data", response.data);

      if (!response.code) {
        cookies.set("refreshToken", response.data.data.refreshToken, {
          path: "/",
          maxAge: 24 * 60 * 60,
          sameSite: "strict",
          secure: true,
        });

        cookies.set("userRole", response.data?.data?.user?.roleName, {
          path: "/",
          maxAge: 24 * 60 * 60,
          sameSite: "strict",
          secure: true,
        });

        cookies.set("name", response.data?.data?.user?.name, {
          path: "/",
          maxAge: 24 * 60 * 60,
          sameSite: "strict",
          secure: true,
        });
      }

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

      await axiosInstance.delete(
        "/users/auth/logout",
        config,
        JSON.stringify({ refreshToken })
      );

      return null;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
