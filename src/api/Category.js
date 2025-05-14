import axios from "axios";
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../Constant/routes";

const cookies = new Cookies();

export const createHybridFixture = async (
  tournamentId,
  categoryId,
  payload
) => {
  if (!tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
 
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.createHybridFixture(
    userRole,
    tournamentId,
    categoryId
  )}`;

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
    console.error("🚀 ~ CreateFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const updateHybridFixture = async (
  tournamentId,
  categoryId,
  fixtureId,
  payload
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.updateHybridFixture(
    userRole,
    tournamentId,
    categoryId,
    fixtureId
  )}`;

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
    console.error("🚀 ~ UpdateFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const deleteHybridFixture = async (
  tournamentId,
  categoryId,
  fixtureId
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.deleteHybridFixture(
    userRole,
    tournamentId,
    categoryId,
    fixtureId
  )}`;

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ deleteFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getFixtureById = async ({ tournamentId, categoryId, fixtureId }) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.getFixtureById(
    userRole,
    tournamentId,
    categoryId,
    fixtureId
  )}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ Get Fixture by id ~ error:", error);
    throw error.response?.data || error;
  }
};

