import axiosInstance from "../Services/axios";
import Cookies from "js-cookie";
import { API_END_POINTS } from "../Constant/routes";

export const getFixtureId = async ({ tournamentId, categoryId }) => {
  if (!tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  // Use API_END_POINTS to get the correct endpoint based on role
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.createFixture(
    tournamentId,
    categoryId
  )}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data?.fixtures?.[0]?._id;
  } catch (error) {
    console.error("🚀 ~ getFixtureId ~ error:", error);
    throw error.response?.data || error;
  }
};

export const getTournamentStanding = async ({
  tournamentId,
  categoryId,
  fixtureId
}) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  // Use API_END_POINTS to get the correct endpoint based on role
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.getMatchStandings(
    tournamentId,
    categoryId,
    fixtureId,
    0
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
    console.error("🚀 ~ getTournamentStanding ~ error:", error);
    throw error.response?.data || error;
  }
};
