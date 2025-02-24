import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../../Constant/routes";

const cookies = new Cookies();
export const createFixture = createAsyncThunk(
  "fixture/createFixture",
  async ({ tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.createFixture(
        userRole,
        tour_Id,
        eventId
      );
      const formData = { tournamentId: tour_Id, categoryId: eventId };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureByTour_IdAndCategoryId(
          userRole,
          tour_Id,
          eventId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.fixtureMatchUpdate(
        userRole,
        matchData.tour_Id,
        matchData.eventId,
        matchData.fixtureId
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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

export const updateMatchSetCount = createAsyncThunk(
  "fixture/updateMatchSetCount",
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetCount(
          userRole,
          matchData.tour_Id,
          matchData.eventId,
          matchData.fixtureId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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

export const updateSeeding = createAsyncThunk(
  "fixture/updateSeeding",
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.updatePlayerSeeding(
          userRole,
          matchData.tour_Id,
          matchData.eventId,
          matchData.fixtureId,
          matchData.stageId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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

export const updateMatchSet = createAsyncThunk(
  "fixture/updateMatchSet",
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetUpdated(
          userRole,
          matchData.tour_Id,
          matchData.eventId,
          matchData.fixtureId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments/${
          matchData.tour_Id
        }/categories/${matchData.eventId}/fixtures/${
          matchData.fixtureId
        }/update-match-set`,
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

export const publishFixture = createAsyncThunk(
  "fixture/publishFixture",
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.publishFixture(
        userRole,
        matchData.tour_Id,
        matchData.eventId,
        matchData.fixtureId
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
