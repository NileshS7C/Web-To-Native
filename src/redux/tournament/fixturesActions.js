import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import Cookies from 'js-cookie'
import { API_END_POINTS } from "../../Constant/routes";

export const createFixture = createAsyncThunk(
  "fixture/createFixture",
  async ({ tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.createFixture(
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
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureByTour_IdAndCategoryId(
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
export const getHybridFixtures = createAsyncThunk(
  "fixture/getHybridFixture",
  async ({tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureByTour_IdAndCategoryId(
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
export const getFixtureById = createAsyncThunk(
  "fixture/getFixtureById",
  async ({tour_Id, eventId, fixtureId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureById(
          tour_Id,
          eventId,
          fixtureId
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

export const getMatches = createAsyncThunk(
  "fixture/getMatches",
  async ({ tour_Id, eventId, fixtureId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.GET.getMatches(
        userRole,
        tour_Id,
        eventId,
        fixtureId
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
  async ({tour_Id,eventId,fixtureId,formData}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.fixtureMatchUpdate(
        tour_Id,
        eventId,
        fixtureId
      );

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

export const updateMatchSetCount = createAsyncThunk(
  "fixture/updateMatchSetCount",
  async ({ tour_Id,eventId,fixtureId ,formData}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetCount(
          tour_Id,
          eventId,
          fixtureId
        );

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

export const getStandings = createAsyncThunk(
  "fixture/getStandings",
  async ({ tour_Id,eventId,fixtureId,stageId}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.GET.getMatchStandings(
        tour_Id,
        eventId,
        fixtureId,
        stageId
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

export const updateSeeding = createAsyncThunk(
  "fixture/updateSeeding",
  async ({formData,tour_Id,eventId,fixtureId,stageId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.updatePlayerSeeding(
          tour_Id,
          eventId,
          fixtureId,
          stageId
        );
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

export const updateMatchSet = createAsyncThunk(
  "fixture/updateMatchSet",
  async ({ formData,tour_Id,eventId,fixtureId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetUpdated(
          tour_Id,
          eventId,
          fixtureId
        );
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

export const publishFixture = createAsyncThunk(
  "fixture/publishFixture",
  async ({  tour_Id,eventId,fixtureId}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.publishFixture(
        tour_Id,
        eventId,
        fixtureId
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

export const unPublishFixture = createAsyncThunk(
  "fixture/unPublishFixture",
  async (matchData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.unPublishFixture(
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