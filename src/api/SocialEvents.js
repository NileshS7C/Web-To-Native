import axiosInstance from "../Services/axios";
import { API_END_POINTS } from "../Constant/routes";
import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from "../Constant/Roles";

export const getAllEvents = async (page = 1, limit = 10, id, filters = {}, activeSearchTerm) => {
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.socialEvents.GET.getAllEvents(id)}`;

  let config = {
    params: { 
      page, 
      limit,
      ...(filters.status && { status: filters.status }),
      ...(filters.timeline && { timeline: filters.timeline }),
      ...(activeSearchTerm?.trim() && {search: activeSearchTerm})
    },
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  console.log('Request config:', config);

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getAllEvents ~ error:", error);
    throw error.response?.data || error;
  }
};


export const searchEvents = async ({ownerId, searchTitle, page = 1, limit = 10, filters = {}}) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.searchEvents(ownerId)}`;

  const config = {
    params: { 
      search: searchTitle,
      page,
      limit,
      ...(filters.status && { status: filters.status }),
      ...(filters.timeline && { timeline: filters.timeline })
    },
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ searchEvents ~ error:", error);
    throw error.response?.data || error;
  }
};

export const createEvent = async (payload) => {
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.socialEvents.POST.createEvent()}`;

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload,
  };

  try {
    const response = await axiosInstance.request(config);
    const responseData = response.data?.data;

    console.log("🚀 ~ createEvent ~ API Response", {
      fullResponse: response.data,
      responseData,
      eventObject: responseData?.event,
      eventId: responseData?.event?._id || responseData?.event?.id
    });

    // Ensure eventId is available at the top level for easier access
    if (responseData?.event && !responseData.eventId) {
      responseData.eventId = responseData.event._id || responseData.event.id;
    }

    return responseData;
  } catch (error) {
    console.error("🚀 ~ createEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

export const updateEvent = async (payload) => {
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.socialEvents.POST.updateEvent(payload.eventId)}`;

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

// Get all event owners (Admin only)
export const getAllEventOwners = async ({ currentPage = 1, limit = 100 }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getAllEventOwners({ currentPage, limit })}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getAllEventOwners ~ error:", error);
    throw error.response?.data || error;
  }
};

// Get single event owner details (Role-based)
export const getSingleEventOwner = async () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getSingleEventOwner()}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getSingleEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventById = async (eventId, ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getEventById(eventId, ownerId)}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getEventById ~ error:", error);
    throw error.response?.data || error;
  }
};

export const verifyEvent = async (eventId, action, rejectionComments = '') => {
  try {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const endpoint = `${baseURL}${API_END_POINTS.socialEvents.POST.verifyEvent(eventId)}`;
    
    const response = await axiosInstance.post(endpoint, {
      action,
      rejectionComments
    }, {
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying event:', error);
    throw error.response?.data || error;
  }
};

export const archiveEvent = async (eventId, ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/archive`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/archive`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ archiveEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

export const publishEvent = async (eventId, ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/events/${eventId}/update`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: {
      step: 2,
      eventId,
      ownerUserId: ownerId,
      acknowledgment: true
    }
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ publishEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventBookings = async (eventId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/bookings`
    : `${baseURL}/users/event-owner/events/${eventId}/bookings`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getEventBookings ~ error:", error);
    throw error.response?.data || error;
  }
};

export const addEventPlayer = async (payload) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/owner/${payload.ownerId}`
    : `${baseURL}/users/event-owner/event-bookings/owner/${payload.ownerId}`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: {
      eventId: payload.eventId,
      phone: payload.phone,
      name: payload.name,
      playerId: payload.playerId
    }
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ addEventPlayer ~ error:", error);
    throw error.response?.data || error;
  }
};

export const searchPlayers = async (searchQuery) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/search-players?search=${searchQuery}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ searchPlayers ~ error:", error);
    throw error.response?.data || error;
  }
};

export const cancelEventBooking = async (bookingId, ownerId, cancelReason) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/${bookingId}/owner/${ownerId}/cancel`
    : `${baseURL}/users/event-owner/event-bookings/${bookingId}/owner/${ownerId}/cancel`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: {
      bookingId,
      cancelReason
    }
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ cancelEventBooking ~ error:", error);
    throw error.response?.data || error;
  }
};

export const refundEventBooking = async (bookingId, ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/${bookingId}/owner/${ownerId}/refund`
    : `${baseURL}/users/event-owner/event-bookings/${bookingId}/owner/${ownerId}/refund`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: {
      bookingId
    }
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ refundEventBooking ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventOwners = async ({ page = 1, limit = 10 }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners?page=${page}&limit=${limit}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getEventOwners ~ error:", error);
    throw error.response?.data || error;
  }
};

export const createEventOwner = async (payload) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ createEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventOwnerById = async (ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners/${ownerId}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 ~ getEventOwnerById ~ error:", error);
    throw error.response?.data || error;
  }
};

export const updateEventOwner = async (ownerId, payload) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners/${ownerId}`;

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 ~ updateEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const changeEventStatus = async (eventId, ownerId, status) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/change-status`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/change-status`;


  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: { actionType: status }
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ changeEventStatus ~ error:", error);
    throw error.response?.data || error;
  }
};

export const exportEventBookings = async (eventId, ownerId) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/export-bookings`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/export-bookings`;


  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    responseType: 'blob', // Important for downloading files
  };

  try {
    const response = await axiosInstance.request(config);
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    // Get filename from content-disposition header or use default
    const filename = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'event-bookings.xlsx';
    link.setAttribute('download', filename);
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Clean up the URL
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("🚀 ~ exportEventBookings ~ error:", error);
    throw error.response?.data || error;
  }
};


