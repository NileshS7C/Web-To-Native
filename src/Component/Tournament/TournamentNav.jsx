import { useDispatch, useSelector } from "react-redux";
import { AcknowledgementText } from "./Acknowledgement/Acknowledgement";
import { EventCreationModal } from "./Event/EventCreationModal";
import EventInfo from "./Event/EventInfo";
import { TournamentInfo } from "./TournamentInfo";
import {
  setFormOpen,
  setIsEditable,
} from "../../redux/tournament/addTournament";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSingleTournament } from "../../redux/tournament/tournamentActions";
import { useCookies } from "react-cookie";
import { shouldBeDisable } from "../../utils/tournamentUtils";

const TournamentCreationForm = () => {
  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const { currentStep, isNotEditable } = useSelector(
    (state) => state.Tournament
  );
  const { tournament, tournamentEditMode } = useSelector(
    (state) => state.GET_TOUR
  );
  const [cookies] = useCookies(["name", "userRole"]);
  const isAddInThePath = window.location.pathname.includes("add");

  useEffect(() => {
    const isDisable = shouldBeDisable(
      tournament?.status,
      tournamentId,
      tournamentEditMode,
      isAddInThePath,
      cookies?.userRole
    );

    dispatch(setIsEditable(isDisable));

    if (tournament?.status === "DRAFT") {
      dispatch(setFormOpen("event"));
    } else {
      dispatch(setFormOpen("basic info"));
    }
  }, [
    tournament?.status,
    tournamentId,
    tournamentEditMode,
    isAddInThePath,
    cookies,
  ]);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getSingleTournament(tournamentId));
    }
  }, [tournamentId]);

  return (
    <div className="flex flex-col pl-[50px] pr-[30px]  bg-[#FFFFFF] rounded-3xl">
      <div className="py-[50px] ">
        <div className="flex items-center  border-b-[1px] border-[#EDEDED] gap-[67px] ">
          <button
            className={`tab-button ${
              currentStep === "basic info" ? "active" : ""
            } `}
            onClick={() => dispatch(setFormOpen("basic info"))}
          >
            Basic Info
          </button>
          <button
            className={`tab-button ${currentStep === "event" ? "active" : ""} `}
            onClick={() => dispatch(setFormOpen("event"))}
          >
            Events
          </button>
          <button
            className={`tab-button ${
              currentStep === "acknowledgement" ? "active" : ""
            } `}
            onClick={() => dispatch(setFormOpen("acknowledgement"))}
          >
            Acknowledgement
          </button>
        </div>
      </div>

      {currentStep === "basic info" && (
        <TournamentInfo
          tournament={tournament}
          status={tournament?.status}
          isDisable={isNotEditable}
        />
      )}
      {currentStep === "event" && <EventInfo isDisable={isNotEditable} />}
      {currentStep === "acknowledgement" && (
        <AcknowledgementText ownerUserId={tournament?.ownerUserId} />
      )}
      <EventCreationModal />
    </div>
  );
};

export default TournamentCreationForm;
