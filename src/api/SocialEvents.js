import axios from "axios";
import { API_END_POINTS } from "../Constant/routes";
import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from "../Constant/Roles";

export const getAllEvents = async (page = 1, limit = 10, id, filters = {}) => {
  console.log(`🚀 || SocialEvents.js:8 || getAllEvents || page:`, page, 'filters:', filters);
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.socialEvents.GET.getAllEvents(id)}`;
  console.log(`🚀 || SocialEvents.js:8 || getAllEvents || ENDPOINT:`, ENDPOINT);

  let config = {
    params: { 
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

  console.log('Request config:', config);

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getAllEvents ~ error:", error);
    throw error.response?.data || error;
  }
};


export const searchEvents = async ({ownerId, searchTitle, page = 1, limit = 10}) => {
  console.log("🚀 ~ searchEvents ~ searchTitle:", searchTitle);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.searchEvents(ownerId)}`;
  console.log("🚀 ~ searchEvents ENDPOINT:", ENDPOINT);

  const config = {
    params: { 
      search: searchTitle,
      page,
      limit
    },
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ searchEvents ~ error:", error);
    throw error.response?.data || error;
  }
};

export const createEvent = async (payload) => {
  console.log("🚀 ~ createEvent ~ payload:", payload);
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
    const response = await axios.request(config);
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
  console.log("🚀 ~ updateEvent ~ payload:", payload);
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
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

// Get all event owners (Admin only)
export const getAllEventOwners = async ({ currentPage = 1, limit = 100 }) => {
  console.log(`🚀 || SocialEvents.js || getAllEventOwners || page: ${currentPage}, limit: ${limit}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getAllEventOwners({ currentPage, limit })}`;
  console.log(`🚀 || SocialEvents.js || getAllEventOwners || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getAllEventOwners ~ error:", error);
    throw error.response?.data || error;
  }
};

// Get single event owner details (Role-based)
export const getSingleEventOwner = async () => {
  console.log(`🚀 || SocialEvents.js || getSingleEventOwner`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getSingleEventOwner()}`;
  console.log(`🚀 || SocialEvents.js || getSingleEventOwner || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getSingleEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventById = async (eventId, ownerId) => {
  console.log(`🚀 || SocialEvents.js || getEventById || eventId: ${eventId}, ownerId: ${ownerId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.getEventById(eventId, ownerId)}`;
  console.log(`🚀 || SocialEvents.js || getEventById || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
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
    console.log('Verifying event with endpoint:', endpoint);
    
    const response = await axios.post(endpoint, {
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
  console.log(`🚀 || SocialEvents.js || archiveEvent || eventId: ${eventId}, ownerId: ${ownerId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/archive`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/archive`;

  console.log(`🚀 || SocialEvents.js || archiveEvent || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ archiveEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

export const publishEvent = async (eventId, ownerId) => {
  console.log(`🚀 || SocialEvents.js || publishEvent || eventId: ${eventId}, ownerId: ${ownerId}`);

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
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ publishEvent ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventBookings = async (eventId) => {
  console.log(`🚀 || SocialEvents.js || getEventBookings || eventId: ${eventId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event/${eventId}/bookings`
    : `${baseURL}/users/event-owner/event/${eventId}/bookings`;

  console.log(`🚀 || SocialEvents.js || getEventBookings || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getEventBookings ~ error:", error);
    throw error.response?.data || error;
  }
};

export const addEventPlayer = async (payload) => {
  console.log(`🚀 || SocialEvents.js || addEventPlayer || payload:`, payload);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/owner/${payload.ownerId}`
    : `${baseURL}/users/event-owner/event-bookings/owner/${payload.ownerId}`;

  console.log(`🚀 || SocialEvents.js || addEventPlayer || ENDPOINT:`, ENDPOINT);

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
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ addEventPlayer ~ error:", error);
    throw error.response?.data || error;
  }
};

export const searchPlayers = async (searchQuery) => {
  console.log(`🚀 || SocialEvents.js || searchPlayers || searchQuery:`, searchQuery);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/search-players?search=${searchQuery}`;

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ searchPlayers ~ error:", error);
    throw error.response?.data || error;
  }
};

export const cancelEventBooking = async (bookingId, ownerId, cancelReason) => {
  console.log(`🚀 || SocialEvents.js || cancelEventBooking || bookingId: ${bookingId}, ownerId: ${ownerId}, cancelReason: ${cancelReason}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/${bookingId}/owner/${ownerId}/cancel`
    : `${baseURL}/users/event-owner/event-bookings/${bookingId}/owner/${ownerId}/cancel`;

  console.log(`🚀 || SocialEvents.js || cancelEventBooking || ENDPOINT:`, ENDPOINT);

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
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ cancelEventBooking ~ error:", error);
    throw error.response?.data || error;
  }
};

export const refundEventBooking = async (bookingId, ownerId) => {
  console.log(`🚀 || SocialEvents.js || refundEventBooking || bookingId: ${bookingId}, ownerId: ${ownerId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/event-bookings/${bookingId}/owner/${ownerId}/refund`
    : `${baseURL}/users/event-owner/event-bookings/${bookingId}/owner/${ownerId}/refund`;

  console.log(`🚀 || SocialEvents.js || refundEventBooking || ENDPOINT:`, ENDPOINT);

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
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ refundEventBooking ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventOwners = async ({ page = 1, limit = 10 }) => {
  console.log(`🚀 || SocialEvents.js || getEventOwners || page: ${page}, limit: ${limit}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners?page=${page}&limit=${limit}`;
  console.log(`🚀 || SocialEvents.js || getEventOwners || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getEventOwners ~ error:", error);
    throw error.response?.data || error;
  }
};

export const createEventOwner = async (payload) => {
  console.log(`🚀 || SocialEvents.js || createEventOwner || payload:`, payload);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners`;
  console.log(`🚀 || SocialEvents.js || createEventOwner || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ createEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getEventOwnerById = async (ownerId) => {
  console.log(`🚀 || SocialEvents.js || getEventOwnerById || ownerId: ${ownerId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners/${ownerId}`;
  console.log(`🚀 || SocialEvents.js || getEventOwnerById || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 ~ getEventOwnerById ~ error:", error);
    throw error.response?.data || error;
  }
};

export const updateEventOwner = async (ownerId, payload) => {
  console.log(`🚀 || SocialEvents.js || updateEventOwner || ownerId: ${ownerId}, payload:`, payload);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}/users/admin/event-owners/${ownerId}`;
  console.log(`🚀 || SocialEvents.js || updateEventOwner || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: payload
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 ~ updateEventOwner ~ error:", error);
    throw error.response?.data || error;
  }
};

export const changeEventStatus = async (eventId, ownerId, status) => {
  console.log(`🚀 || SocialEvents.js || changeEventStatus || eventId: ${eventId}, ownerId: ${ownerId}, status: ${status}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/change-status`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/change-status`;

  console.log(`🚀 || SocialEvents.js || changeEventStatus || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: { actionType: status }
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ changeEventStatus ~ error:", error);
    throw error.response?.data || error;
  }
};

export const exportEventBookings = async (eventId, ownerId) => {
  console.log(`🚀 || SocialEvents.js || exportEventBookings || eventId: ${eventId}, ownerId: ${ownerId}`);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = checkRoles(ADMIN_ROLES)
    ? `${baseURL}/users/admin/events/${eventId}/export-bookings`
    : `${baseURL}/users/event-owner/events/${eventId}/owner/${ownerId}/export-bookings`;

  console.log(`🚀 || SocialEvents.js || exportEventBookings || ENDPOINT:`, ENDPOINT);

  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    responseType: 'blob', // Important for downloading files
  };

  try {
    const response = await axios.request(config);
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


