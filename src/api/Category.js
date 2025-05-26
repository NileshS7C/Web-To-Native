import axios from "axios";
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../Constant/routes";

const cookies = new Cookies();

export const createHybridFixture = async (
  tournamentId,
  categoryId,
  payload,
  type
) => {
  if (!tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.createHybridFixture(
    type,
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
  payload,
  type
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.updateHybridFixture(
    type,
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
  fixtureId,
  type
) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.deleteHybridFixture(
    type,
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
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.getFixtureById(
    type,
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


export const getDoubleEliminationFinal = async ({
  tournamentId,
  categoryId,
  fixtureId,
  type
}) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.fixtureDEFinal(
    type,
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
    console.error("🚀 ~ Get double elimination final ~ error:", error);
    throw error.response?.data || error;
  }
};