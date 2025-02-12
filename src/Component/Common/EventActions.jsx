import PropTypes from "prop-types";
import { useEffect } from "react";
import { ActionButtons } from "./ActionButtons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionButtonCourt } from "../../Constant/venue";
import { toggleModal } from "../../redux/tournament/eventSlice";
import { updateQueryString } from "../../utils/urlModification";

import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import {
  deleteSingleCategory,
  getAllCategories,
} from "../../redux/tournament/tournamentActions";

const EventActions = ({ id, index, eventName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const { isNotEditable } = useSelector((state) => state.Tournament);
  const { tournamentEditMode } = useSelector((state) => state.GET_TOUR);
  const { isConfirmed, type } = useSelector((state) => state.confirm);
  const { currentPage } = useSelector((state) => state.event);
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
            "Deleting this category will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Event",
          withComments: false,
        })
      );
    },
    view: () => {
      navigate(`/tournaments/${tournamentId}/event/${id}?event=${eventName}`);
    },
  };

  useEffect(() => {
    if (isConfirmed && type === "Event" && tournamentId) {
      dispatch(deleteSingleCategory({ tour_Id: tournamentId, eventId: id }));
      dispatch(resetConfirmationState());
      dispatch(
        getAllCategories({
          currentPage,
          limit: 10,
          id: tournamentId,
        })
      );
    }
  }, [isConfirmed, type, tournamentId]);

  return (
    <ActionButtons
      actions={ActionButtonCourt}
      actionHandlers={handlers}
      data={id}
      index={index}
      isNotEditable={!tournamentEditMode}
    />
  );
};

EventActions.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
};

export default EventActions;
