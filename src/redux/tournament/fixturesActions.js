import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../../Constant/routes";

const cookies = new Cookies();
export const createFixture = createAsyncThunk(
  "fixture/createFixture",
  async ({ type,tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.createFixture(
        type,
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
  async ({ type,tour_Id, eventId }, { rejectWithValue }) => {
    try {
      
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureByTour_IdAndCategoryId(
          type,
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
  async ({type, tour_Id, eventId }, { rejectWithValue }) => {
    try {
      

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureByTour_IdAndCategoryId(
          type,
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
  async ({ type,tour_Id, eventId, fixtureId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getFixtureById(
          type,
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
  async ({matchData,type}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.fixtureMatchUpdate(
        type,
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
  async ({ matchData ,type}, { rejectWithValue }) => {
    try {
      c

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetCount(
          type,
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

export const getStandings = createAsyncThunk(
  "fixture/getStandings",
  async ({ matchData ,type}, { rejectWithValue }) => {
    try {

      const userAPIEndPoint = API_END_POINTS.tournament.GET.getMatchStandings(
        type,
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
  async ({ matchData ,type}, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.updatePlayerSeeding(
          type,
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
  async ({ matchData ,type}, { rejectWithValue }) => {
    try {
     

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.fixtureMatchSetUpdated(
          type,
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

export const publishFixture = createAsyncThunk(
  "fixture/publishFixture",
  async ({ matchData ,type}, { rejectWithValue }) => {
    try {
   

      const userAPIEndPoint = API_END_POINTS.tournament.POST.publishFixture(
        type,
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