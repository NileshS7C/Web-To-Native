import { useDispatch, useSelector } from "react-redux";
import { CourtActionButtonGroup } from "../../Constant/venue";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import { deleteCourt } from "../../redux/Venue/venueActions";
import { useEffect } from "react";

const CourtActions = ({ id, name, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlers = {
    edit: (team) => {
      navigate(`/venues/${id}/edit-court?name=${name}`);
    },
    delete: (team) => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this court will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Court",
          id,
        })
      );
    },
    view: (id) => {
      navigate(`/venues/${id}/edit-court?name=${name}`);
    },
  };

  return (
    <ActionButtons
      actions={CourtActionButtonGroup}
      actionHandlers={handlers}
      data={id}
      index={index}
    />
  );
};

export default CourtActions;
