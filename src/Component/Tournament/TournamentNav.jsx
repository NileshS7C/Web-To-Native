import { useDispatch, useSelector } from "react-redux";
import { AcknowledgementText } from "./Acknowledgement/Acknowledgement";
import { EventCreationModal } from "./Event/EventCreationModal";
import EventInfo from "./Event/EventInfo";

import { TournamentInfo } from "./TournamentInfo";

import { setFormOpen } from "../../redux/tournament/addTournament";

const TournamentNavBar = () => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((state) => state.Tournament);

  return (
    <div className="flex flex-col pl-[50px] pr-[30px]   bg-[#FFFFFF]">
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

      {currentStep === "basic info" && <TournamentInfo />}
      {currentStep === "event" && <EventInfo />}
      {currentStep === "acknowledgement" && <AcknowledgementText />}
      <EventCreationModal />
    </div>
  );
};

export default TournamentNavBar;
