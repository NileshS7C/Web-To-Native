import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";

const EventActions = ({ id, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      navigate(`/venues/${id}`);
    },
  };

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
      index={index}
    />
  );
};

export default EventActions;
