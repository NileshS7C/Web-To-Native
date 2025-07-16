import axiosInstance from "../Services/axios";
import { API_END_POINTS } from "../Constant/routes";

export const createHybridFixture = async (
  tournamentId,
  categoryId,
  payload,
) => {
  if (!tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.createHybridFixture(
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
    const response = await axiosInstance.request(config);
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
  payload,
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.updateHybridFixture(
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
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ UpdateFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const deleteHybridFixture = async (
  tournamentId,
  categoryId,
  fixtureId,
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.deleteHybridFixture(
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
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ deleteFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const deleteChildFixture = async (
  tournamentId,
  categoryId,
  fixtureId,
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.deleteChildFixture(
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
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ deleteChildFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const updateChildFixture = async (
  tournamentId,
  categoryId,
  fixtureId,
  payload,
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/child/${fixtureId}`;

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
    console.error("🚀 ~ updateChildFixture ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getFixtureById = async ({ tournamentId, categoryId, fixtureId }) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.getFixtureById(
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
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ Get Fixture by id ~ error:", error);
    throw error.response?.data || error;
  }
};


export const getDoubleEliminationFinal = async ({
  tournamentId,
  categoryId,
  fixtureId,
}) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.fixtureDEFinal(
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
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ Get double elimination final ~ error:", error);
    throw error.response?.data || error;
  }
};