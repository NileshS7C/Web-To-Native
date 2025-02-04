import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import PropTypes from "prop-types";
import { IoCloseSharp } from "react-icons/io5";

export const PlayerSelectionModal = ({ isOpen, onCancel, players }) => {
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[40%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col justify-between flex-1 items-start gap-3 w-full">
              <PlayerSwipeTitle onCancel={onCancel} />
              <MatchList />
              <PlayerList players={players} />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const MatchList = () => {
  return (
    <div className="flex flex-col items-start justify-between gap-2 text-[#718EBF]">
      <label className="text-base leading-[19.36px]" htmlFor="matches">
        Choose the match to swipe the players
      </label>
      <select
        name="matches"
        className="w-full px-[19px] border-[1px]
          border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none
          focus:ring-2 focus:ring-blue-500"
        id="matches"
      ></select>
    </div>
  );
};

const PlayerList = ({ players }) => {
  return (
    <div className="flex items-center justify-between w-full text-[#718EBF]">
      <div className="flex flex-col justify-between items-start gap-2">
        <label className="text-base leading-[19.36px]" htmlFor="opponent1">
          Choose the match to swipe the players
        </label>
        <select
          name="opponent1"
          className="w-full px-[19px] border-[1px]
          border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none
          focus:ring-2 focus:ring-blue-500"
          id="opponent1"
        >
          {players.map((player) => {
            return <option key={player}>{player}</option>;
          })}
        </select>
      </div>

      <div className="flex flex-col justify-between items-start gap-2">
        <label className="text-base leading-[19.36px]" htmlFor="opponent2">
          Choose the match to swipe the players
        </label>
        <select
          name="opponent2"
          className="w-full px-[19px] border-[1px]
          border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none
          focus:ring-2 focus:ring-blue-500"
          id="opponent2"
        >
          {players.map((player) => {
            return <option key={player}>{player}</option>;
          })}
        </select>
      </div>
    </div>
  );
};

const PlayerSwipeTitle = ({ onCancel }) => {
  return (
    <div className="flex justify-between items-center w-full text-[#718EBF]">
      <div className="flex gap-3">
        <p className="text-lg text-[#343C6A] font-semibold">Player Seeding</p>
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

PlayerList.propTypes = {
  players: PropTypes.array,
};

PlayerSwipeTitle.propTypes = {
  onCancel: PropTypes.func,
};

PlayerSelectionModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  players: PropTypes.array,
};
