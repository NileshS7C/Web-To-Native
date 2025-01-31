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
      cookies.set("userRole", response.data.data.user.roleName, {
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      });
      cookies.set("name", response.data.data.user.name, {
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
      const refreshToken = cookies.get("refreshToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken,
        },
      };

      await axiosInstance.delete("/users/auth/logout", config);
      cookies.remove("refreshToken", { path: "/" });
      cookies.remove("userRole", { path: "/" });
      cookies.remove("name", { path: "/" });
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
