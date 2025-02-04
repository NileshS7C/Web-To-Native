import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FaGreaterThan } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

export const MatchModal = ({
  isOpen,
  onCancel,
  tournament,
  matchDetails,
  participants = [],
}) => {
  const { category } = useSelector((state) => state.event);
  const [playersData, setPlayersData] = useState({
    opponent1: "",
    opponent2: "",
  });

  useEffect(() => {
    if (participants.length > 0 && matchDetails) {
      const { opponent1 = {}, opponent2 = {} } = matchDetails;
      setPlayersData((prev) => ({ ...prev, opponent1: "", opponent2: "" }));
      const oppenent1Data = participants.find(
        (participant) => participant.id === opponent1?.id
      );

      const oppenent2Data = participants.find(
        (participant) => participant.id === opponent2?.id
      );

      if (oppenent1Data) {
        setPlayersData((prev) => ({ ...prev, opponent1: oppenent1Data.name }));
      }
      if (oppenent2Data) {
        setPlayersData((prev) => ({
          ...prev,
          opponent2: oppenent2Data.name,
        }));
      }
    }
  }, [matchDetails]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel(false)}
      className="relative z-10 "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[50%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="w-full">
              <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-center">
                <MatchModalTitle
                  tournamentName={tournament?.tournamentName}
                  eventName={category?.categoryName}
                  onCancel={onCancel}
                />
                <MatchRound />
                <PlayersDetails playersData={playersData} />
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const MatchModalTitle = ({ tournamentName, eventName, onCancel }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-3">
        <p className="text-lg text-[#343C6A] font-semibold">{tournamentName}</p>
        <FaGreaterThan color="#343C6A" className="w-[24px] h-[24px]" />
        <p className="text-lg text-[#343C6A] font-semibold">{eventName}</p>
      </div>
      <IoCloseSharp
        className="w-[24px] h-[24px] shadow-md cursor-pointer"
        onClick={() => {
          onCancel(false);
        }}
      />
    </div>
  );
};

const MatchRound = ({ round = 1 }) => {
  return (
    <div className="flex justify-center w-full items-center py-3 rounded-lg bg-[#343C6A]">
      <p className="text-white text-lg font-semibold">
        Round <span>{round}</span>
      </p>
    </div>
  );
};

const PlayersDetails = ({ playersData }) => {
  return (
    <div className="flex items-center justify-center gap-3 w-full text-[#718EBF]">
      <div>
        <input
          placeholder="Enter Venue Handle"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={playersData.opponent1}
          disabled
        />
      </div>
      <div>
        <span className="text-md text-[#343C6A]">VS</span>
      </div>
      <div>
        <input
          placeholder="Enter Venue Handle"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={playersData.opponent2}
          disabled
        />
      </div>
    </div>
  );
};

MatchModalTitle.propTypes = {
  tournamentName: PropTypes.string,
  eventName: PropTypes.string,
  onCancel: PropTypes.func,
};

MatchRound.propTypes = {
  round: PropTypes.number,
};

PlayersDetails.propTypes = {
  playersData: PropTypes.object,
};

MatchModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  tournament: PropTypes.object,
  matchDetails: PropTypes.object,
  participants: PropTypes.array,
};
