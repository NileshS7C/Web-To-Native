import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";

export const getAboutUsPageData = createAsyncThunk(
  "cms/about-us",
  async ({ type }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/about-us?section=${type}`,
        config
      );

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
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);

export const submitAboutUsForm = createAsyncThunk(
  "cms/saveAboutUsContent",
  async ({ type, body }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/about-us/${type}`,
        JSON.stringify(body),
        config
      );

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
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);
