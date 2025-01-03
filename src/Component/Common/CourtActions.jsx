import { useDispatch } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";

const CourtActions = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlers = {
    edit: (team) => {},
    delete: (team) => {
      console.log("Deleting team:", team);
    },
    view: (id) => {
      console.log("Edit court", id);
    },
  };

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
    />
  );
};

export default CourtActions;
