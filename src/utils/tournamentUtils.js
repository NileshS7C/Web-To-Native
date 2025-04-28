import { backButtonRoutes } from "../Constant/routes";
import { ADMIN_ROLES,TOURNAMENT_OWNER_ROLES } from "../Constant/Roles";
const findFormatName = (tournamentEvent, item) => {
  return tournamentEvent.format.find(
    (event) => event.shortName === item?.format
  );
};

const shouldBeDisable = (
  status,
  id,
  editClicked,
  addPath,
  role,
  editTournamentId
) => {
  if (!role) {
    return false;
  }
  if (addPath) {
    return true;
  }
  if (
    (ADMIN_ROLES.includes(role) || TOURNAMENT_OWNER_ROLES.includes(role)) &&
    status === "DRAFT"
  ) {
    return true;
  } else if (
    ADMIN_ROLES.includes(role) ||
    (TOURNAMENT_OWNER_ROLES.includes(role) &&
      ["REJECTED", "ARCHIVED"].includes(status || ""))
  ) {
    return editClicked;
  } else if (
    TOURNAMENT_OWNER_ROLES.includes(role) &&
    ["PENDING_VERIFICATION", "PUBLISHED"].includes(status || "")
  ) {
    return false;
  } else {
    return false;
  }
};


const backRoute = (location, indentityData) => {
  if (!location.pathname) return;

  const parentRoute = backButtonRoutes.find((route) =>
    location.pathname.includes(route.path)
  );

  const isChildExist = parentRoute.children.some((child) =>
    location.pathname.includes(child)
  );

  if (isChildExist) {
    const id = indentityData[parentRoute.id];

    if (
      location.pathname.includes("/event") &&
      indentityData.status === "DRAFT"
    ) {
      return `${parentRoute.path}/${id}/add`;
    }

    return `${parentRoute.path}/${id}`;
  }

  return `${parentRoute.path}`;
};
export { findFormatName, shouldBeDisable, backRoute };
