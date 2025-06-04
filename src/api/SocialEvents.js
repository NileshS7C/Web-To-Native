import axios from "axios";
import { API_END_POINTS } from "../Constant/routes";

export const getAllEvents = async (page = 1, limit = 10) => {
  console.log(`🚀 || SocialEvents.js:8 || getAllEvents || page:`, page);
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.socialEvents.GET.getAllEvents()}`;
  console.log(`🚀 || SocialEvents.js:8 || getAllEvents || ENDPOINT:`, ENDPOINT);

  let config = {
    params: { page, limit },
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ getAllEvents ~ error:", error);
    throw error.response?.data || error;
  }
};


export const searchEvents = async ({ownerId, searchTitle}) => {
  console.log("🚀 ~ searchEvents ~ searchTitle:", searchTitle);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURL}${API_END_POINTS.socialEvents.GET.searchEvents(ownerId)}`;
  console.log("🚀 ~ searchEvents ENDPOINT:", ENDPOINT);

  const config = {
    params: { search: searchTitle },
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
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ createEvent ~ error:", error);
    throw error.response?.data || error;
  }
};
