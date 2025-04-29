import axios from 'axios';

export const getFixtureId = async ({ tournamentId, categoryId }) => {
  if( !tournamentId || !categoryId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`;

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
  if( !tournamentId || !categoryId || !fixtureId) return null;
  const baseURl = import.meta.env.VITE_BASE_URL;
  const ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/0/standings`;

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



