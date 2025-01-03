import { useDispatch } from "react-redux";
import { ActionButtonGroup } from "../../Constant/app";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { getSingleVenue } from "../../redux/Venue/venueActions";
const VenueActions = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlers = {
    edit: (team) => {},
    delete: (team) => {
      console.log("Deleting team:", team);
    },
    view: (id) => {
      dispatch(getSingleVenue(id));
      navigate(`/venues/${id}`);
    },
  };

  return (
    <ActionButtons
      actions={ActionButtonGroup}
      actionHandlers={handlers}
      data={id}
    />
  );
};

export default VenueActions;
