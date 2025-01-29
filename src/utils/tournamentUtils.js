const findFormatName = (tournamentEvent, item) => {
  return tournamentEvent.format.find(
    (event) => event.shortName === item?.format
  );
};

const shouldBeDisable = (status, id, editClicked, addPath, role) => {
  const isStatusEligible = status === "DARFT" || status === "REJECTED";
  if (!role) {
    return false;
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return editClicked;
  } else {
    if (addPath) {
      return isStatusEligible;
    } else {
      return id && editClicked && isStatusEligible;
    }
  }
};
export { findFormatName, shouldBeDisable };
