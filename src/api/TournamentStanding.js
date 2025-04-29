import axios from 'axios';
import { Cookies } from "react-cookie";
import { API_END_POINTS } from "../Constant/routes";

const cookies = new Cookies();

export const getFixtureId = async ({ tournamentId, categoryId }) => {
  if (!tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
  // Use API_END_POINTS to get the correct endpoint based on role
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.POST.createFixture(userRole, tournamentId, categoryId)}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data?._id;
  } catch (error) {
    console.error("🚀 ~ getFixtureId ~ error:", error)
    throw error.response?.data || error;
  }
}

export const getTournamentStanding = async ({ tournamentId, categoryId, fixtureId }) => {
  if (!tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const userRole = cookies.get("userRole");
  // Use API_END_POINTS to get the correct endpoint based on role
  const ENDPOINT = `${baseURl}${API_END_POINTS.tournament.GET.getMatchStandings(userRole, tournamentId, categoryId, fixtureId, 0)}`;

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
    console.error("🚀 ~ getTournamentStanding ~ error:", error)
    throw error.response?.data || error;
  }
}



