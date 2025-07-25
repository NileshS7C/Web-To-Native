import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";
import { formatURL } from "../../utils/dateUtils";
import { API_END_POINTS } from "../../Constant/routes";
import { checkRoles } from "../../utils/roleCheck";
import { ADMIN_ROLES, TOURNAMENT_OWNER_ROLES } from "../../Constant/Roles";
export const addTournamentStepOne = createAsyncThunk(
  "Tournament/addTournamentStepOne",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.tournamentCreation();
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

export const searchTournament = createAsyncThunk(
  "Tournament/searchTournament",
  async ({ ...rest }, { rejectWithValue }) => {
    try {
      const { ownerId, ...updatedParams } = rest;
      const userAPIEndPoint = API_END_POINTS.tournament.GET.searchTournaments(
        ownerId
      );

      const formattedParams = formatURL(updatedParams);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}?${formattedParams}`
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

export const changeTournamentStatus = createAsyncThunk(
  "Tournament/changeTournamentStatus",
  async ({ tournamentId, ownerId, action }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.POST.changeTournamentStatus(
        tournamentId,
        ownerId
      );
      console.log(userAPIEndPoint);
      if (!userAPIEndPoint) {
        return rejectWithValue({
          message: "You do not have permission to access this resource",
        });
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = { actionType: action === "Archive" ? "ARCHIVED" : "COMPLETED" }
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
        JSON.stringify(data),
        config
      );
      return response.data;
    } catch (err) {
      console.log(err);
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
  async ({ formData }, { rejectWithValue }) => {
    try {
      console.log("Printing formdata", formData);
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.tournamentCreation();
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
        `${import.meta.env.VITE_BASE_URL
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
      let userEndPoint;
      if (checkRoles(ADMIN_ROLES)) {
        userEndPoint = "/users/admin/get-details";
      } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
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
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getAllTags();

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
    console.log("singletournamentId", tournamentId);
    console.log("singleownerId", ownerId);
    try {
      const userAPIEndPoint = API_END_POINTS.tournament.GET.tournamentById(
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
      const userAPIEndPoint = API_END_POINTS.tournament.POST.createCategory(
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
      const userAPIEndPoint = API_END_POINTS.tournament.POST.updateCategory(
        id,
        categoryId
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

export const getAllCategories = createAsyncThunk(
  "Tournament/getAllCategories",
  async ({ currentPage, limit, sort, id }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getAllCategoriesByTournament(
          id
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL
        }${userAPIEndPoint}?page=${currentPage}&sort=${sort}&limit=${limit}`,
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
      const userAPIEndPoint = API_END_POINTS.tournament.GET.getCategoryById(
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
      const userAPIEndPoint = API_END_POINTS.tournament.POST.deleteCategory(
        tour_Id,
        eventId
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
        rest.ownerId
      );
      if (!userAPIEndPoint) {
        return rejectWithValue({
          message: "U not write to access this resource",
        });
      }

      const { ownerId, ...updatedParams } = rest;
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
  async (
    { currentPage, limit, tour_Id, eventId, status = "" },
    { rejectWithValue }
  ) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.getBookingByCategory(
          tour_Id,
          eventId
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let url = `${import.meta.env.VITE_BASE_URL
        }${userAPIEndPoint}?page=${currentPage}&limit=${limit}`;

      if (["CONFIRMED"].includes(status)) {
        url += `&status=${status}`;
      }

      const response = await axiosInstance.get(url, config);

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

export const getSearchBookings = createAsyncThunk(
  "GET_TOUR/getSearchBookings",
  async (
    { search = "", currentPage = 1, limit = 20, tour_Id, eventId, status = "" },
    { rejectWithValue }
  ) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.searchBookingByCategory(
          tour_Id,
          eventId,
          search
        );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let url = `${import.meta.env.VITE_BASE_URL
        }${userAPIEndPoint}?page=${currentPage}&limit=${limit}`;

      if (["CONFIRMED"].includes(status)) {
        url += `&status=${status}`;
      }

      const response = await axiosInstance.get(url, config);
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
      const userAPIEndPoint = API_END_POINTS.tournament.POST.createBooking(
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
  async ({ type, data, bookingId, ownerId }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.POST.cancelAndRefundBooking(
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

export const downloadSheetOfPlayers = createAsyncThunk(
  "GET_TOUR/downloadSheetOfPLayers",
  async ({ tournamentId, ownerId, tournamentName, platform }, { rejectWithValue }) => {
    try {
      const userAPIEndPoint =
        API_END_POINTS.tournament.GET.downloadSheetOfPlayers(tournamentId, ownerId);

      if (!userAPIEndPoint) {
        return rejectWithValue({
          message: "You are not authorized to download the sheet.",
        });
      }

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}${userAPIEndPoint}`,
        { responseType: "blob" }
      );

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `${tournamentName}.xlsx`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ""));
        }
      }

      const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = new Blob([response.data], { type: mimeType });

      if (platform === "android") {
        // Convert Blob to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            const base64data = result.split(",")[1]; // remove data:...base64,
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Proper base64 downloadUrl with data: prefix
        const downloadUrl = `data:${mimeType};base64,${base64}`;

        // Send to native layer
        window.WTN?.customFileDownload?.({
          fileName:"data1.xls",
          downloadUrl:"https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls",
          mimeType,
          isBlob: false,
          openFileAfterDownload: false,
        });

        return;
      }

      // Web fallback: trigger download using Blob URL
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      if (
        err.response &&
        err.response.data instanceof Blob &&
        err.response.data.type === "application/json"
      ) {
        const errorText = await err.response.data.text();
        const errorData = JSON.parse(errorText);
        return rejectWithValue({
          message: errorData.message,
          status: errorData.status,
        });
      }

      return rejectWithValue({
        message: err.message || "An unknown error occurred",
      });
    }
  }
);


