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
export { findFormatName, shouldBeDisable };
