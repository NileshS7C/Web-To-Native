import { useDispatch, useSelector } from "react-redux";
import { ActionButtonGroup } from "../../Constant/app";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { deleteVenue, getSingleVenue } from "../../redux/Venue/venueActions";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import { useEffect } from "react";
const VenueActions = ({ id, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isConfirmed, type } = useSelector((state) => state.confirm);
  const handlers = {
    edit: (team) => {
      navigate(`/venues/${id}/edit`);
    },
    delete: (team) => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this venue will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Venue",
        })
      );
    },
    view: (id) => {
      dispatch(getSingleVenue(id));
      navigate(`/venues/${id}`);
    },
  };

  useEffect(() => {
    if (isConfirmed && type === "Venue") {
      dispatch(deleteVenue(id));
      dispatch(resetConfirmationState());
    }
  }, [isConfirmed, type]);
  return (
    <ActionButtons
      actions={ActionButtonGroup}
      actionHandlers={handlers}
      data={id}
      index={index}
    />
  );
};

export default VenueActions;
