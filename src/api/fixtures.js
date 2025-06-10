import axios from "axios";
import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES } from "../Constant/Roles";


export const updateGroupName = async ({ tournamentID, categoryId, fixtureId, groupObj }) => {
  if (!tournamentID || !categoryId || !fixtureId || !groupObj) return;

  const baseURl = import.meta.env.VITE_BASE_URL;
  let ENDPOINT = "";
  if (checkRoles(ADMIN_ROLES)) {
    ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-group-name`;
  } else {
    ENDPOINT = `${baseURl}/users/tournament-owner/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-group-name`;
  }

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: groupObj, // Include the payload
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateGroupName ~ error:", error);
    throw error;
  }
};

export const updateRoundName = async ({ tournamentID, categoryId, fixtureId, roundObj }) => {
  if (!tournamentID || !categoryId || !fixtureId || !roundObj) return;

  const baseURl = import.meta.env.VITE_BASE_URL;

  let ENDPOINT = "";
  if (checkRoles(ADMIN_ROLES)) {
    ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-round-name`;
  } else {
    ENDPOINT = `${baseURl}/users/tournament-owner/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-round-name`;
  }

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: roundObj, // Include the payload
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateRoundName ~ error:", error);
    throw error;
  }
};
