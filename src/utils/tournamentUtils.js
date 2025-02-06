import { backButtonRoutes } from "../Constant/routes";

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
  const isStatusEligible = status === "DARFT" || status === "REJECTED";

  if (!role) {
    return false;
  }
  if (addPath) {
    return true;
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return editClicked;
  } else {
    return id && editClicked && isStatusEligible;
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

    return `${parentRoute.path}/${id}`;
  }

  return `${parentRoute.path}`;
};
export { findFormatName, shouldBeDisable, backRoute };
