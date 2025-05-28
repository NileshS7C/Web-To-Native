import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import PropTypes from "prop-types";
import { IoCloseSharp } from "react-icons/io5";
import { TbSwipe } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { getFixture, getFixtureById, updateSeeding, } from "../../redux/tournament/fixturesActions";
import { showSuccess } from "../../redux/Success/successSlice";
import ErrorBanner from "./ErrorBanner";
import { useParams } from "react-router-dom";
import { setFixture } from "../../redux/tournament/fixtureSlice";

// Helper function to create players with IDs for internal use
const createPlayersWithIds = (playersList) => {
  return playersList?.map((player, index) => ({
    id: index,
    name: player.name,
  })) || [];
};

const seededPlayerData = (selections, playersList) => {
  if (selections?.length > 0) {
    const playersWithIds = createPlayersWithIds(playersList);
    const updatedArray = [...playersWithIds];
    
    selections.forEach((selection) => {
      const indexOfTheChoosenPlayer = playersWithIds.findIndex(
        (element) => element.id === selection.player1
      );

      const swappingPlayerIndex = playersWithIds.findIndex(
        (element) => element.id === selection.player2
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
  return createPlayersWithIds(playersList);
};

const formattedPlayerDataForSeeding = (
  fixture,
  seededData,
  tournamentId
) => {
  if (!fixture || !tournamentId || !seededData?.length) {
    return;
  }

  const stageId = fixture?.bracketData?.stage[0].id;
  const stageData = fixture?.bracketData?.stage[0];
  const currentStage = stageData?.length > 0 && stageData.find((stage) => stage.id === stageId);
  const type = stageData?.type;
  const name = stageData?.name;
  const settings = stageData?.settings;
  const categoryId = stageData?.tournament_id;

  const { seedOrdering, tournament_id, ...requiredKeys } = settings;

  const updatedSeedingData = seededData.map((player) => {
    const { id, tournament_id, number, bookingId, ...rest } = player;
    return rest;
  });
  console.log("stageData", updatedSeedingData);

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
  players, // This is now playersList from the parent
  participants, // Keep for backward compatibility if needed
  fixtureId,
  playersList // New prop for the playersList array
}) => {
  const dispatch = useDispatch();
  const { eventId, tournamentId } = useParams();
  const [seededPlayers, setSeededPlayers] = useState([]);
  const [selections, setSelections] = useState([]);
  const [isSubmittings, setisSubmittings] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [updatedFixture, setUpdatedFixture] = useState(null);

  const isSaveEnabled = selections.length > 0 && selections.every(
    s =>
      typeof s.player1 === "number" &&
      typeof s.player2 === "number" &&
      s.player1 !== s.player2
  );
  
  const {
    fixture
  } = useSelector((state) => state.fixture);

  // Use playersList if provided, otherwise fall back to players
  const currentPlayersList = playersList || players || [];

  useEffect(() => {
    if (fixture) {
      setUpdatedFixture(fixture);
    }
  }, [fixture]);

  const handleSeededPlayer = (value) => {
    setSelections([...value]);
  };

  useEffect(() => {
    if (selections?.length > 0) {
      const playersWithIds = createPlayersWithIds(currentPlayersList);
      const updatedArray = [...playersWithIds];
      
      selections.forEach((selection) => {
        const indexOfTheChoosenPlayer = playersWithIds.findIndex(
          (element) => element.id === selection.player1
        );

        const swappingPlayerIndex = playersWithIds.findIndex(
          (element) => element.id === selection.player2
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
  }, [selections, currentPlayersList]);

  const handlePlayerSeeding = async () => {
    try {
      setisSubmittings(true);
      setHasError(false);
      setErrorMessage("");

      const seededData = seededPlayerData(selections, currentPlayersList);

      const formattedData = formattedPlayerDataForSeeding(
        updatedFixture,
        seededData,
        tournamentId
      );

      const result = await dispatch(
        updateSeeding({
          tour_Id: tournamentId,
          eventId,
          formData: formattedData,
          fixtureId: updatedFixture?._id,
          stageId: updatedFixture?.bracketData.stage[0].id,
        })
      ).unwrap();
      
      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Player seeded successfully.",
            onClose: "hideSuccess",
          })
        );

        dispatch(setFixture(result?.data?.fixture));
        if (fixtureId) {
          dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
        } else {
          dispatch(getFixture({ tour_Id: tournamentId, eventId }));
        }
      }
    } catch (err) {
      console.log("Error occurred while doing player seeding", err);
      setHasError(true);
      setErrorMessage(
        err.data?.message ||
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
      setSelections([]);
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
                players={currentPlayersList}
                handleSeededPlayer={handleSeededPlayer}
              />

              <Button
                className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                type="submit"
                loading={isSubmittings}
                onClick={handlePlayerSeeding}
                disabled={!isSaveEnabled}
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
  const playersWithIds = createPlayersWithIds(players);

  const getAvailablePlayers = (currentField) => {
    return playersWithIds?.length > 0
      ? playersWithIds.filter((player) => {
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
          className="w-full px-[19px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    const playersWithIds = createPlayersWithIds(players);
    const playerData = playersWithIds.find((player) => player.id === Number(value));
    
    if (playerData) {
      setSelections((prev) => {
        const newSelections = [...prev];
        newSelections[rowIndex] = {
          ...newSelections[rowIndex],
          [field]: playerData.id,
        };
        handleSeededPlayer(newSelections);
        return newSelections;
      });
    }
  };

  const handleAddRow = () => {
    setSelections((prev) => {
      const newSelections = [...prev, { player1: "", player2: "" }];
      handleSeededPlayer(newSelections);
      return newSelections;
    });
  };

  const handleDeleteRow = (index) => {
    setSelections((prev) => {
      const newSelections = prev.filter((_, i) => i !== index);
      handleSeededPlayer(newSelections);
      return newSelections;
    });
  };

  // Update parent when selections change
  useEffect(() => {
    handleSeededPlayer(selections);
  }, [selections]);

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
  fixtureId: PropTypes.string,
  playersList: PropTypes.array,
};