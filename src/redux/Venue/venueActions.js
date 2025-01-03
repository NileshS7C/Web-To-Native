import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
export const addVenue = createAsyncThunk(
  "Venue/createVenue",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/venues`,
        JSON.stringify(formData),
        config
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getAllVenues = createAsyncThunk(
  "Venue/getAllVenues",
  async (currentPage, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/venues?page=${currentPage}`,
        config
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getSingleVenue = createAsyncThunk(
  "Venue/getSingleVenue",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/venues/${id}`,
        config
      );

      console.log(" response data", response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCourt = createAsyncThunk(
  "Venue/createCourt",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/venues/${id}/courts`,
        JSON.stringify(formData),
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
