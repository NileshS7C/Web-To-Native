import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";
import { setEventId, toggleModal } from "../../redux/tournament/eventSlice";
import { updateQueryString } from "../../utils/urlModification";
import PropTypes from "prop-types";

const EventActions = ({ id, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isNotEditable } = useSelector((state) => state.Tournament);
  const handlers = {
    edit: (team) => {
      dispatch(toggleModal());
      const searchParams = updateQueryString({ category: id });
      navigate(`${window.location.pathname}?${searchParams.toString()}`);
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
    view: () => {
      dispatch(setEventId(id));
    },
  };

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
      index={index}
      isNotEditable={isNotEditable}
    />
  );
};

EventActions.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
};

export default EventActions;
