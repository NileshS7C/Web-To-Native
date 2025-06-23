import PropTypes from "prop-types";
import { ActionButtons } from "./ActionButtons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";
import { toggleModal, setDeleteCategoryId, setEventId } from "../../redux/tournament/eventSlice";
import { updateQueryString } from "../../utils/urlModification";
import { showConfirmation } from "../../redux/Confirmation/confirmationSlice";

const EventActions = ({ id, index, eventName }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const { isNotEditable } = useSelector((state) => state.Tournament);
  const { isConfirmed, type } = useSelector((state) => state.confirm);
  const { currentPage } = useSelector((state) => state.event);

  const handlers = {
    edit: (team) => {
      dispatch(setEventId(id));
      dispatch(toggleModal());
      const searchParams = updateQueryString({ category: id });
      navigate(`${window.location.pathname}?${searchParams.toString()}`);
    },
    delete: (team) => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this category will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Event",
          withComments: false,
        })
      );
      dispatch(setDeleteCategoryId(id));
    },
    view: () => {
      navigate(`/tournaments/${tournamentId}/event/${id}?event=${eventName}`);
    },
  };

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
      index={index}
      isNotEditable={!isNotEditable}
    />
  );
};

EventActions.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  eventName: PropTypes.string,
};

export default EventActions;
