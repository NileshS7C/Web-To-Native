import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import PropTypes from "prop-types";
import { IoCloseSharp } from "react-icons/io5";
import { TbSwipe } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import {getFixture,updateSeeding,} from "../../redux/tournament/fixturesActions";
import { showSuccess } from "../../redux/Success/successSlice";
import ErrorBanner from "./ErrorBanner";
import { useParams } from "react-router-dom";
import { setFixture } from "../../redux/tournament/fixtureSlice";

const seededPlayerData = (selections, participants) => {
  if (selections?.length > 0) {
    const updatedArray = [...participants];
    selections.forEach((selections) => {
      const indexOfTheChoosenPlayer = participants.findIndex(
        (element) => element.id === selections.player1
      );

      const swappingPlayerIndex = participants.findIndex(
        (element) => element.id === selections.player2
      );

      if (indexOfTheChoosenPlayer !== -1 && swappingPlayerIndex !== -1) {
        [
          updatedArray[indexOfTheChoosenPlayer],
          updatedArray[swappingPlayerIndex],
        ] = [
          updatedArray[swappingPlayerIndex],
          updatedArray[indexOfTheChoosenPlayer],
        ];
      }
    });

    return updatedArray;
  }
};

const formattedPlayerDataForSeeding = (
  fixture,

  seededData,
  tournamentId
) => {
  if (!fixture || !tournamentId || !seededData?.length) {
    return;
  }

  const stageId = fixture?.currentStage;
  const stageData = fixture?.bracketData?.stage;
  const currentStage =
    stageData?.length > 0 && stageData.find((stage) => stage.id === stageId);
  const type = currentStage?.type;
  const name = currentStage?.name;
  const settings = currentStage?.settings;
  const categoryId = currentStage?.tournament_id;

  const { seedOrdering, tournament_id, ...requiredKeys } = settings;

  const updatedSeedingData = seededData.map((player) => {
    const { id, tournament_id, number, ...rest } = player;
    return rest;
  });

  return {
    stageData: {
      seeding: updatedSeedingData,
      settings: requiredKeys,
      tournamentId: categoryId,
      type,
      name,
    },
  };
};

export const PlayerSelectionModal = ({
  isOpen,
  onCancel,
  players,
  participants,
  fixture,
}) => {
  const dispatch = useDispatch();
  const { eventId, tournamentId } = useParams();
  const [seededPlayers, setSeededPlayers] = useState([]);
  const [selections, setSelections] = useState([]);
  const [isSubmittings, setisSubmittings] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSeededPlayer = (value) => {
    setSelections((_) => [...value]);
  };

  useEffect(() => {
    if (selections?.length > 0) {
      const updatedArray = [...participants];
      selections.forEach((selections) => {
        const indexOfTheChoosenPlayer = participants.findIndex(
          (element) => element.id === selections.player1
        );

        const swappingPlayerIndex = participants.findIndex(
          (element) => element.id === selections.player2
        );

        if (indexOfTheChoosenPlayer !== -1 && swappingPlayerIndex !== -1) {
          [
            updatedArray[indexOfTheChoosenPlayer],
            updatedArray[swappingPlayerIndex],
          ] = [
            updatedArray[swappingPlayerIndex],
            updatedArray[indexOfTheChoosenPlayer],
          ];

          setSeededPlayers(updatedArray);
        }
      });
    }
  }, [selections]);

  const handlePlayerSeeding = async () => {
    try {
      setisSubmittings(true);
      setHasError(false);
      setErrorMessage("");

      const seededData = seededPlayerData(selections, participants);

      const formattedData = formattedPlayerDataForSeeding(
        fixture,
        seededData,
        tournamentId
      );

      const result = await dispatch(
        updateSeeding({
          tour_Id: tournamentId,
          eventId,
          formData: formattedData,
          fixtureId: fixture?._id,
          stageId: fixture?.currentStage,
        })
      ).unwrap();
      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Player seeded successfully.",
            onClose: "hideSuccess",
          })
        );

        dispatch(setFixture(result?.data?.updatedFixture));
        dispatch(getFixture({ tour_Id: tournamentId, eventId }));
      }
    } catch (err) {
      console.log(" Error occured while doing player seeding", err);
      setHasError(true);
      setErrorMessage(
        err.data.message ||
          "Oops! something went wrong while seeding the players. Please try again."
      );
    } finally {
      setisSubmittings(false);
      onCancel(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHasError(false);
      setisSubmittings(false);
      setErrorMessage("");
      setSeededPlayers([]);
    }
  }, [isOpen]);

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

      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative max-h-[90vh] transform overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[60%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col justify-between flex-1 items-start gap-3 w-full">
              <PlayerSwipeTitle onCancel={onCancel} />

              {hasError && <ErrorBanner message={errorMessage} />}

              <PlayerSelectionManager
                players={players}
                handleSeededPlayer={handleSeededPlayer}
              />

              <Button
                className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                type="submit"
                loading={isSubmittings}
                onClick={handlePlayerSeeding}
                disabled={!seededPlayers?.length}
              >
                Save
              </Button>
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
    return players?.length > 0
      ? players.filter((player) => {
          if (player.id === currentRow[currentField]) return true;

          return !allSelections.some(
            (row) => row.player1 === player.id || row.player2 === player.id
          );
        })
      : [];
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
          {getAvailablePlayers("player1").map((player, index) => (
            <option key={`${player.name}_${index}`} value={player?.id}>
              {player.name}
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
          {getAvailablePlayers("player2").map((player, index) => (
            <option key={`${player.name}_${index}`} value={player.id}>
              {player.name}
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

const PlayerSelectionManager = ({ players, handleSeededPlayer }) => {
  const [selections, setSelections] = useState([{ player1: "", player2: "" }]);

  const handlePlayerChange = (rowIndex, field, value) => {
    const playerData = players.find((player) => player.id === Number(value));
    let name;
    if (playerData) {
      name = playerData.id;
      setSelections((prev) => {
        const newSelections = [...prev];
        newSelections[rowIndex] = {
          ...newSelections[rowIndex],
          [field]: name,
        };
        handleSeededPlayer(newSelections);
        return newSelections;
      });
    }
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
  handleSeededPlayer: PropTypes.func,
};

PlayerSwipeTitle.propTypes = {
  onCancel: PropTypes.func,
};

PlayerSelectionModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  players: PropTypes.array,
  participants: PropTypes.array,
  fixture: PropTypes.object,
};
