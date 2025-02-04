import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import PropTypes from "prop-types";
import { IoCloseSharp } from "react-icons/io5";
import { TbSwipe } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

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
              <PlayerSelectionManager players={players} />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
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

const PlayerRow = ({
  players,
  rowIndex,
  allSelections,
  handlePlayerChange,
  showDelete,
  onDelete,
}) => {
  const currentRow = allSelections[rowIndex] || { player1: "", player2: "" };

  const getAvailablePlayers = (currentField) => {
    return players.filter((player) => {
      if (player === currentRow[currentField]) return true;

      return !allSelections.some(
        (row) => row.player1 === player || row.player2 === player
      );
    });
  };

  return (
    <div className="flex items-center justify-between w-full text-[#718EBF] gap-4">
      <div className="flex flex-col justify-between items-start gap-2 w-full">
        <label
          className="text-base leading-[19.36px] w-full"
          htmlFor={`player1-${rowIndex}`}
        >
          Choose the player
        </label>
        <select
          name={`player1-${rowIndex}`}
          id={`player1-${rowIndex}`}
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentRow.player1}
          onChange={(e) =>
            handlePlayerChange(rowIndex, "player1", e.target.value)
          }
        >
          <option value="">Select Player</option>
          {getAvailablePlayers("player1").map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      <TbSwipe className="w-[30px] h-[40px]" />

      <div className="flex flex-col justify-between items-start gap-2 w-full">
        <label
          className="text-base leading-[19.36px]"
          htmlFor={`player2-${rowIndex}`}
        >
          Pick an opponent to swap
        </label>
        <select
          name={`player2-${rowIndex}`}
          id={`player2-${rowIndex}`}
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentRow.player2}
          onChange={(e) =>
            handlePlayerChange(rowIndex, "player2", e.target.value)
          }
        >
          <option value="">Select Player</option>
          {getAvailablePlayers("player2").map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      {showDelete && (
        <RiDeleteBinLine
          className="w-[30px] h-[40px] cursor-pointer"
          color="red"
          onClick={() => onDelete(rowIndex)}
        />
      )}
    </div>
  );
};

const PlayerSelectionManager = ({ players }) => {
  const [selections, setSelections] = useState([{ player1: "", player2: "" }]);

  const handlePlayerChange = (rowIndex, field, value) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[rowIndex] = {
        ...newSelections[rowIndex],
        [field]: value,
      };
      return newSelections;
    });
  };

  const handleAddRow = () => {
    setSelections((prev) => [...prev, { player1: "", player2: "" }]);
  };

  const handleDeleteRow = (index) => {
    setSelections((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {selections.map((_, index) => (
        <PlayerRow
          key={index}
          rowIndex={index}
          players={players}
          allSelections={selections}
          handlePlayerChange={handlePlayerChange}
          showDelete={index > 0}
          onDelete={handleDeleteRow}
        />
      ))}

      <button
        className="flex items-center m-auto justify-between gap-1 bg-blue-600 px-10 py-2 rounded-lg text-white focus:outline-bg-blue-300 focus:ring-2 focus:ring-blue-300"
        onClick={handleAddRow}
      >
        <IoMdAdd />
        Add
      </button>
    </div>
  );
};
PlayerRow.propTypes = {
  players: PropTypes.array,
  rowIndex: PropTypes.number,
  allSelections: PropTypes.array,
  handlePlayerChange: PropTypes.func,
  showDelete: PropTypes.bool,
  onDelete: PropTypes.func,
};

PlayerSelectionManager.propTypes = {
  players: PropTypes.array,
};

PlayerSwipeTitle.propTypes = {
  onCancel: PropTypes.func,
};

PlayerSelectionModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  players: PropTypes.array,
  matches: PropTypes.array,
};
