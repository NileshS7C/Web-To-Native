import { useDispatch, useSelector } from "react-redux";
import { ActionButtonGroup } from "../../Constant/app";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { showConfirmation } from "../../redux/Confirmation/confirmationSlice";

const VenueActions = ({ id, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlers = {
    edit: () => {
      navigate(`/venues/${id}/edit`);
    },
    delete: () => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this venue will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Venue",
          id,
        })
      );
    },
    view: (id) => {
      navigate(`/venues/${id}`);
    },
  };

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
