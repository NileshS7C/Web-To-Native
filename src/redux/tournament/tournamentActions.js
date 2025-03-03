import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { formatURL } from "../../utils/dateUtils";
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../../Constant/routes";

const cookies = new Cookies();

export const addTournamentStepOne = createAsyncThunk(
  "Tournament/addTournamentStepOne",
  async (formData, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.tournamentCreation(userRole);
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.tournamentCreation(userRole);
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
  async (type, { rejectWithValue }) => {
    try {
      let userEndPoint;
      if (type === "ADMIN") {
        userEndPoint = "/users/admin/get-details";
      } else {
        userEndPoint = "/users/tournament-owner/get-details";
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}${userEndPoint}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getAllTags(userRole);

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
  async ({ tournamentId, ownerId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.GET.tournamentById(
        userRole,
        tournamentId,
        ownerId
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.createCategory(
        userRole,
        id
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

// come here after confirmation
export const updateEventCategory = createAsyncThunk(
  "Event/createCategory",
  async ({ formData, id, categoryId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.PATCH.updateCategory(
        userRole,
        id,
        categoryId
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getAllCategoriesByTournament(
          userRole,
          id
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }${userAPIEndPoint}?page=${currentPage}&limit=${limit}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.GET.getCategoryById(
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.DELETE.deleteCategory(
        userRole,
        tour_Id,
        eventId
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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

// will come later has to change the url in the constant

export const getAllTournaments = createAsyncThunk(
  "GET_TOUR/getAllTournaments",
  async ({ ...rest }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.GET.getAllTouranaments(
        rest.ownerId,
        rest.type
      );

      const { type, ownerId, ...updatedParams } = rest;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formattedURL = formatURL(updatedParams);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}?${formattedURL}`,
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
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.verifyTournament(id);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getBookingByCategory(
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
        `${
          import.meta.env.VITE_BASE_URL
        }${userAPIEndPoint}?page=${currentPage}&limit=${limit}`,
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
      const userRole = cookies.get("userRole");

      const userAPIEndPoint = API_END_POINTS.tournament.POST.createBooking(
        userRole,
        ownerId
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
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
  async ({ data, type, bookingId, ownerId }, { rejectWithValue }) => {
    try {
      const userRole = cookies.get("userRole");

      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.cancelAndRefundBooking(
          userRole,
          ownerId,
          bookingId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}/${type}`,
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
