import { useDispatch, useSelector } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import { deleteCourt } from "../../redux/Venue/venueActions";
import { useEffect } from "react";
const CourtActions = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isConfirmed, type } = useSelector((state) => state.confirm);
  const handlers = {
    edit: (team) => {},
    delete: (team) => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this court will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Court",
        })
      );
    },
    view: (id) => {},
  };

  useEffect(() => {
    if (isConfirmed && type === "Court") {
      dispatch(deleteCourt(id));
      dispatch(resetConfirmationState());
      navigate("/venues");
    }
  }, [isConfirmed, type]);

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
    />
  );
};

export default CourtActions;
