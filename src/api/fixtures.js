import { checkRoles } from "../utils/roleCheck";
import { ADMIN_ROLES } from "../Constant/Roles";
import axiosInstance from "../Services/axios";

export const updateGroupName = async ({
  tournamentID,
  categoryId,
  fixtureId,
  groupObj,
}) => {
  if (!tournamentID || !categoryId || !fixtureId || !groupObj) return;

  const baseURl = import.meta.env.VITE_BASE_URL;
  let ENDPOINT = "";
  if (checkRoles(ADMIN_ROLES)) {
    ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-group`;
  } else {
    ENDPOINT = `${baseURl}/users/tournament-owner/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-group`;
  }

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: groupObj, // Include the payload
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateGroupName ~ error:", error);
    throw error;
  }
};

export const updateRoundName = async ({
  tournamentID,
  categoryId,
  fixtureId,
  roundObj,
}) => {
  if (!tournamentID || !categoryId || !fixtureId || !roundObj) return;

  const baseURl = import.meta.env.VITE_BASE_URL;

  let ENDPOINT = "";
  if (checkRoles(ADMIN_ROLES)) {
    ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-round`;
  } else {
    ENDPOINT = `${baseURl}/users/tournament-owner/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/update-round`;
  }

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: roundObj, // Include the payload
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateRoundName ~ error:", error);
    throw error;
  }
};

export const updateFixtureDateAndTime = async ({
  tournamentId,
  categoryId,
  fixtureId,
  data,
}) => {
  if (!tournamentId || !categoryId || !fixtureId || !data) return;

  const baseURl = import.meta.env.VITE_BASE_URL;

  let ENDPOINT = "";
  if (checkRoles(ADMIN_ROLES)) {
    ENDPOINT = `${baseURl}/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-date-time`;
  } else {
    ENDPOINT = `${baseURl}/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/update-date-time`;
  }

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    data: data,
  };

  try {
    const response = await axiosInstance.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚀 ~ updateFixtureDateAndTime ~ error:", error);
    throw error;
  }
};
