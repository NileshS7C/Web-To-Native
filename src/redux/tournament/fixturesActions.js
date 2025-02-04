import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";

export const createFixture = createAsyncThunk(
  "fixture/createFixture",
  async ({ tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const formData = { tournamentId: tour_Id, categoryId: eventId };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${tour_Id}/categories/${eventId}/fixtures`,
        JSON.stringify(formData),

        config
      );

      return response.data;
    } catch (err) {
      if (err?.response) {
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

export const getFixture = createAsyncThunk(
  "fixture/getFixture",
  async ({ tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${tour_Id}/categories/${eventId}/fixtures`,
        config
      );

      return response.data;
    } catch (err) {
      if (err?.response) {
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

export const updateMatch = createAsyncThunk(
  "fixture/updateMatch",
  async (matchData  , { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments/${
          matchData.tour_Id
        }/categories/${matchData.eventId}/fixtures/${
          matchData.fixtureId
        }/update-Match`,
        JSON.stringify(matchData?.formData),
        config
      );

      return response.data;
    } catch (err) {
      if (err?.response) {
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
