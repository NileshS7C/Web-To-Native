import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { formatURL } from "../../utils/dateUtils";

export const addTournamentStepOne = createAsyncThunk(
  "Tournament/addTournamentStepOne",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments`,
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

export const submitFinalTournament = createAsyncThunk(
  "Tournament/submitFinalTournament",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments`,
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

export const getAll_TO = createAsyncThunk(
  "Tournament/getALlTO",
  async ({ currentPage, limit }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournament-owners?page=${currentPage}&limit=${limit}`,
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

export const getSingle_TO = createAsyncThunk(
  "Tournament/getSingle_TO",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/tournament-owner/get-details`,
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

export const getAllUniqueTags = createAsyncThunk(
  "Tournament/getAllUniqueTags",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/tournament-tags`,
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

export const getSingleTournament = createAsyncThunk(
  "Tournament/getSingleTournament",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments/${id}`,
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

export const updateTournament = createAsyncThunk(
  "Tournament/updateTournament",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments/${id}`,
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

export const addEventCategory = createAsyncThunk(
  "Event/createCategory",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${id}/categories`,
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

export const updateEventCategory = createAsyncThunk(
  "Event/createCategory",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${id}/categories`,
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

export const getAllCategories = createAsyncThunk(
  "Tournament/getAllCategories",
  async ({ currentPage, limit, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${id}/categories?page=${currentPage}&limit=${limit}`,
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

export const getSingleCategory = createAsyncThunk(
  "Event/getSingleCategory",
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
        }/users/admin/tournaments/${tour_Id}/categories/${eventId}`,
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

export const deleteSingleCategory = createAsyncThunk(
  "Event/deleteSingleCategory",
  async ({ tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${tour_Id}/categories/${eventId}`,
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

export const getAllTournaments = createAsyncThunk(
  "GET_TOUR/getAllTournaments",
  async ({ ...rest }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formattedURL = formatURL(rest);
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/?${formattedURL}`,
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

export const handleTournamentDecision = createAsyncThunk(
  "Tournament/handleTournamentDecision",
  async ({ actions, id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tournaments/${id}/verify`,
        JSON.stringify(actions),
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

export const getAllBookings = createAsyncThunk(
  "GET_TOUR/getAllBookings",
  async ({ currentPage, limit, tour_Id, eventId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/tournaments/${tour_Id}/categories/${eventId}/bookings?page=${currentPage}&limit=${limit}`,
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

export const createConfirmBooking = createAsyncThunk(
  "GET_TOUR/createConfirmBooking",
  async ({ data, ownerId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/bookings/owner/${ownerId}`,
        JSON.stringify(data),
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

export const cancelAndRefundBooking = createAsyncThunk(
  "GET_TOUR/cancelAndRefundBooking",
  async ({ data, type, bookingId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/bookings/${bookingId}/owner/67921bf3026dcfaa04c326f0/${type}`,
        JSON.stringify(data),
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
