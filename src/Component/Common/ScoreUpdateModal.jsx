import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  updateMatchSet,
  updateMatch,
  updateMatchSetCount,
  getFixture,
  getMatches,
} from "../../redux/tournament/fixturesActions";

import { setFixture } from "../../redux/tournament/fixtureSlice";
import { showSuccess } from "../../redux/Success/successSlice";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { MatchModalTitle } from "./MatchModal";
import { dummyImage } from "../../Assests";
import Button from "./Button";
import ErrorBanner from "./ErrorBanner";

import { RiDeleteBin2Line } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import NotificationBanner from "./NotificationBanner";
import { dateAndMonth } from "../../utils/dateUtils";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { showError } from "../../redux/Error/errorSlice";
import { getFixtureById } from "../../redux/tournament/fixturesActions";

const checkAllField = (scoreData, onValidationError, setDisableButton,handleErrorMessage) => {
  if (!scoreData?.length) {
    return setDisableButton(true);
  } else {
    setDisableButton(false);
  }

  const checkAllFieldsAreFilled = scoreData?.some(
    (score) => score?.set1 && score?.set2
  );

  if (!checkAllFieldsAreFilled) {
    onValidationError(true);
    handleErrorMessage("Both opponent scores must be filled");
  } else {
    onValidationError(false);
  }
};

const formattedMatchData = (scoreData, players) => {
  const {
    stage_id = "",
    parent_id = "",
    opponent1 = {},
    opponent2 = {},
  } = players;
  if (!stage_id?.toString() || !parent_id?.toString()) {
    return;
  }

  const playersData = scoreData
    .map((set, index) => {
      const currentMatch = players.matchGames.find(
        (game) => game?.number === index + 1
      );

      if (!currentMatch) return null;
      if(!set?.set1 || !set?.set2)
        return null;
      const score1 = Number(set?.set1);
      const score2 = Number(set?.set2);

      if (isNaN(score1) || isNaN(score2)) return null;

      const result1 = score1 > score2 ? "win" : "loss";
      const result2 = score2 > score1 ? "win" : "loss";

      return {
        id: currentMatch.id,
        opponent1: {
          id: opponent1.id,
          score: score1,
          result: result1,
        },
        opponent2: {
          id: opponent2.id,
          score: score2,
          result: result2,
        },
      };
    })
    .filter(Boolean); 

  return {
    stage_id,
    parent_id,
    matchSets: playersData,
  };

};

const formattedMatchDataForForfiet = (forfietPlayerId, players) => {
  const { player1_id, player2_id, stage_id, group_id, round_id, matchId } =
    players;

  // Ensure forfietPlayerId is compared as the same type (string or number)
  const selectedId = Number(forfietPlayerId);
  const p1Id = Number(player1_id);
  const p2Id = Number(player2_id);

  return {
    id: matchId,
    stage_id,
    group_id,
    round_id,
    opponent1: {
      id: p1Id,
      forfeit: selectedId === p1Id, // Will be true if this player was selected
    },
    opponent2: {
      id: p2Id,
      forfeit: selectedId === p2Id, // Will be true if this player was selected
    },
  };
};

// Now we need to update the ScoreUpdateModal component to pass the players prop to MatchScoreUpdateSet
export const ScoreUpdateModal = ({
  isOpen,
  onCancel,
  players,
  fixtureId,
  tournamentId,
  eventId,
  currentMatchId,
  handleUpdateFixture,
  format,
}) => {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.event);
  const { tournament } = useSelector((state) => state.GET_TOUR);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [finalScoreData, setFinalScoreData] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [showPlayerSelections, setShowPlayerSelections] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scoreUpdateArray, setScoreUpdateArray] = useState([]);
  // Check if any player has forfeited
  const isForfeited =
    (players?.opponent1 && players.opponent1.forfeit) ||
    (players?.opponent2 && players.opponent2.forfeit);

  useEffect(() => {
    
    const scoreUpdates = players?.matchGames?.map((game) => {
     
      if (
        (game.opponent1?.score || game.opponent1.score === 0) &&
        (game.opponent2.score || game?.opponent2.score === 0)
      ) {
        return {
          set1: game?.opponent1.score,
          set2: game?.opponent2.score,
        };
      }
    });
    setScoreUpdateArray(scoreUpdates || []);
  }, [players?.match, currentMatchId]);
  const getScoreData = (data, index, type, value) => {
    setFinalScoreData(data);
    setScoreUpdateArray((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [type]: value };
      return updated;
    });
  };

  const handlePlayerSelection = (checked) => {
    setShowPlayerSelections(checked);
  };

  const handleSelectedPlayer = (value) => {
    setSelectedPlayerId(value ? Number(value) : "");
  };

  const handleValidationError = (data) => {
    setValidationError(data);
  };

  const handleAddAndDeleteRow=(data)=>{
    setScoreUpdateArray(data);
  }
  const handleErrorMessage=(message)=>{
    setErrorMessage(message);
  }
  useEffect(() => {
    if (finalScoreData?.length > 0) {
      checkAllField(scoreUpdateArray, handleValidationError, setDisableButton,handleErrorMessage);
    }
  }, [finalScoreData]);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");

      setValidationError(false);
      setUpdateError(false);
      setFinalScoreData([]);
      setShowPlayerSelections(false);
    }
  }, [isOpen]);
  const getMatchSetsUntilVictory = (matchset) => {
    const winCount = new Map();
    winCount.set("player1", 0);
    winCount.set("player2", 0);

    const majority = Math.floor(scoreUpdateArray?.length / 2) + 1;
    let lastIndex = matchset?.length;

    for (let index = 0; index < matchset?.length; index++) {
      const set = matchset[index];

      if (set?.opponent1?.result === "win") {
        winCount.set("player1", winCount.get("player1") + 1);
      } else if (set?.opponent2?.result === "win") {
        winCount.set("player2", winCount.get("player2") + 1);
      }

      if (winCount.get("player1") === majority) {
        lastIndex = index;
        break;
      } else if (winCount.get("player2") === majority) {
        lastIndex = index;
        break;
      }
    }

    return matchset?.slice(0, lastIndex + 1);
  };
  const checkForTie = (matchSets) => {
    return matchSets.some(
      (match) => match?.opponent1?.score === match?.opponent2?.score
    );
  };
  const handleScoreUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(false);
    setValidationError(false);
    let currentSetUpdated;
    if (!showPlayerSelections) {
      currentSetUpdated = formattedMatchData(scoreUpdateArray, players);
    } else {
      currentSetUpdated = formattedMatchDataForForfiet(
        selectedPlayerId,
        players
      );
    }
    if (validationError) return;

    if (scoreUpdateArray?.length % 2 === 0) {
      dispatch(
        showError({
          message: "Set must always be an odd number like 1, 3, or 5.",
          onClose: "hideError",
        })
      );
      return;
    }
   const hasTiedMatch = checkForTie(currentSetUpdated?.matchSets || []);
  
   if (hasTiedMatch) {
     setValidationError(true);
     setErrorMessage("A set cannot contain tied scores.");
     return;
   }

    const updatedMatchSets = getMatchSetsUntilVictory(
      currentSetUpdated?.matchSets
    );
    try {
      setIsUpdating(true);
      setErrorMessage("");
      let result;
      if (!showPlayerSelections) {
        result = await dispatch(
          updateMatchSet({
            formData: {
              ...currentSetUpdated,
              matchSets: updatedMatchSets,
            },
            tour_Id: tournamentId,
            eventId,
            fixtureId,
          })
        ).unwrap();
      } else {
        result = await dispatch(
          updateMatch({
            formData: {
              ...currentSetUpdated,
              matchSets: updatedMatchSets,
            },
            tour_Id: tournamentId,
            eventId,
            fixtureId,
          })
        ).unwrap();
      }

      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Score updated Successfully.",
            onClose: "hideSuccess",
          })
        );
        onCancel(false);
        dispatch(getMatches({ tour_Id: tournamentId, eventId, fixtureId }));
      }
    } catch (err) {
      console.log(" error in updating the score", err);
      setUpdateError(true);
      setErrorMessage(
        err?.data?.message ||
          "Opps, something went wrong while updating the match score."
      );
    } finally {
      setIsUpdating(false);
    }
  };
 
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
            className="relative max-h-[90vh] transform overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col gap-2">
              <MatchModalTitle
                tournamentName={tournament?.tournamentName}
                eventName={category?.categoryName}
                onCancel={onCancel}
              />
              <NotificationBanner
                message="Matches cannot end in a tie. Please ensure a clear winner and loser."
                messageStyle="text-xs sm:text-sm md:text-md lg:text-lg text-[#E82B00]"
                wrapperStyle="flex item-center w-full p-2 bg-[#FFF0D3] border-2 border-dashed border-[#E82B00] rounded-lg"
              />
              {(updateError || validationError) && (
                <ErrorBanner message={errorMessage} />
              )}
              {(players?.player1_id == null || players?.player2_id == null) && (
                <NotificationBanner
                  message="Both opponents are required to update the match score."
                  messageStyle="text-xs sm:text-sm md:text-md lg:text-lg text-[#E82B00]"
                  wrapperStyle="flex item-center w-full p-2 bg-[#FFF0D3] border-2 border-dashed border-[#E82B00] rounded-lg"
                />
              )}

              {validationError && (
                <p className="text-xs sm:text-sm md:text-md lg:text-lg text-red-600">
                  Opponent 1 and Opponent 2 scores are required.
                </p>
              )}
              {players?.player1_id != null && players?.player2_id != null && (
                <>
                  <PlayerDetails players={players} />

                  {/* Show notification if a player has already forfeited */}
                  {isForfeited && (
                    <NotificationBanner
                      message="A player has forfeited this match. Score editing is disabled."
                      messageStyle="text-sm text-[#1570EF]"
                      wrapperStyle="flex items-center w-full p-2 bg-[#E0F2FE] border-2 border-dashed border-[#1570EF] rounded-lg"
                    />
                  )}

                  <ForfietCheckBox
                    handlePlayerSelection={handlePlayerSelection}
                    opponent1={players.opponent1}
                    opponent2={players.opponent2}
                  />

                  {showPlayerSelections && (
                    <PlayerSelector
                      players={players}
                      handleSelectedPlayer={handleSelectedPlayer}
                    />
                  )}
                  <MatchScoreUpdateSet
                    getScoreData={getScoreData}
                    players={players} // Pass the entire players object
                    scoreUpdateArray={scoreUpdateArray}
                    tournamentId={tournamentId}
                    eventId={eventId}
                    fixtureId={fixtureId}
                    matchId={players?.matchId}
                    handleUpdateFixture={handleUpdateFixture}
                    handleAddAndDeleteRow={handleAddAndDeleteRow}
                  />
                  <div className="mr-0 mt-3 flex items-end justify-between">
                    <Button
                      className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2"
                      type="submit"
                      onClick={(e) => {
                        handleScoreUpdate(e);
                      }}
                      disabled={!showPlayerSelections || isForfeited} // Disable forfeit button if already forfeited
                    >
                      Forfeit
                    </Button>
                    {!showPlayerSelections && (
                      <Button
                        className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2"
                        type="submit"
                        onClick={(e) => handleScoreUpdate(e)}
                        loading={isUpdating}
                        disabled={
                          validationError || disableButton || isForfeited
                        } // Disable update button if already forfeited
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const ForfietCheckBox = ({ handlePlayerSelection, opponent1, opponent2 }) => {
  const forfeited =
    (opponent1 && opponent1.forfeit) || (opponent2 && opponent2.forfeit);
  let forfeitedName = "";
  if (opponent1 && opponent1.forfeit) forfeitedName = "Player 1";
  if (opponent2 && opponent2.forfeit) forfeitedName = "Player 2";

  return (
    <div className="flex flex-1 gap-2 items-center">
      <input
        type="checkbox"
        name="forfiet"
        id="forfiet"
        onChange={(e) => {
          handlePlayerSelection(e.target.checked);
        }}
        disabled={forfeited}
      />
      <label htmlFor="forfiet text-xs sm:text-sm md:text-md lg:text-lg">
        Do you want to forfeit any player?
      </label>
    </div>
  );
};

const PlayerSelector = ({ players, handleSelectedPlayer }) => {
  const {
    player1 = "",
    player2 = "",
    player1_id = "",
    player2_id = "",
  } = players;
  return (
    <select
      className="h-[5vh] min-w-full border-[1px] px-[10px] border-[#DFEAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => {
        handleSelectedPlayer(e.target.value);
      }}
      defaultValue=""
    >
      <option value="">Select Player</option>
      <option value={player1_id}>{player1}</option>
      <option value={player2_id}>{player2}</option>
    </select>
  );
};

const InputSet = ({
  index,
  handleScoreChange,
  scoreUpdateArray,
  isForfeited,
}) => {
  return (
    <div className="flex  gap-2  items-center justify-between py-2">
      <input
        className="pl-2 w-full  border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
        type="number"
        onWheel={(e) => e.target.blur()}
        value={
          scoreUpdateArray && scoreUpdateArray[index]?.set1 !== undefined
            ? scoreUpdateArray[index].set1
            : ""
        }
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set1", index);
        }}
        disabled={isForfeited}
      />
      <p className="inline-flex items-center gap-1 justify-center text-md text-matchTextColor border-[1px] border-[#718EBF] w-[100px] lg:w-[80px] text-center h-[5vh]  rounded-md p-2">
        Set <span>{index + 1} </span>
      </p>
      <input
        className="pl-2  w-full border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="number"
        onWheel={(e) => e.target.blur()}
        value={
          scoreUpdateArray && scoreUpdateArray[index]?.set2 !== undefined
            ? scoreUpdateArray[index].set2
            : ""
        }
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set2", index);
        }}
        disabled={isForfeited}
      />
    </div>
  );
};

const MatchScoreUpdateSet = ({
  getScoreData,
  scoreUpdateArray,
  tournamentId,
  eventId,
  fixtureId,
  matchId,
  handleUpdateFixture,
  players, // Add players prop to access forfeit status
  handleAddAndDeleteRow
}) => {
  const dispatch = useDispatch();
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const [scoreSet, setScoreSet] = useState([{ set1: "", set2: "" }]);

  // Check if any player has forfeited
  const isForfeited =
    (players?.opponent1 && players.opponent1.forfeit) ||
    (players?.opponent2 && players.opponent2.forfeit);

  const handleRow = () => {
    setAddButtonClicked(true);
  };

  const handleScoreChange = (value, type, index) => {
    setScoreSet((prev) => {
      const newSet = [...prev];
      newSet[index] = {
        ...newSet[index],
        [type]: value,
      };
      getScoreData(newSet, index, type, value);
      return newSet;
    });
  };

  const handleDeleteRow = (index) => {
    setDeleteButtonClicked(true);
  };

  useEffect(() => {
    const deleteSets = async () => {
      try {
        setSuccess(false);
        setActionPending(true);
        handleUpdateFixture(false);
        setErrorMessage("");
        setError(false);
   
        const result = await dispatch(
          updateMatchSetCount({
            formData: {
              level: "match",
              id: matchId,
              childCount: scoreSet.length - 1,
            },
            tour_Id: tournamentId,
            eventId,
            fixtureId,
          })
        ).unwrap();
        if (!result.responseCode) {
          setSuccess(true);
          setScoreSet((prev) => {
            if (prev.length === 0) return prev;
            const newSet = prev.slice(0, -1);
            getScoreData(newSet);
            handleAddAndDeleteRow(newSet);
            return newSet;
          });
          handleUpdateFixture(true);
        }
      } catch (err) {
        console.log("Error in deleting the match set", err);
        setError(true);
        setErrorMessage(
          err?.data?.message ||
            "Oops! Something went wrong while deleting the set. Please try again."
        );
      } finally {
        setActionPending(false);
        setDeleteButtonClicked(false);
      }
    };
    if (deleteButtonClicked) {
      deleteSets();
    }
  }, [deleteButtonClicked]);
  useEffect(() => {
    const addMatchSet = async () => {
      try {
        setSuccess(false);
        setActionPending(true);
        handleUpdateFixture(false);
        setErrorMessage("");
        setError(false);

        const result = await dispatch(
          updateMatchSetCount({
            formData: {
              level: "match",
              id: matchId,
              childCount: scoreSet.length + 1,
            },
            tour_Id: tournamentId,
            eventId,
            fixtureId,
          })
        ).unwrap();
        if (!result.responseCode) {
          setSuccess(true);
          const newSet = [...scoreSet, { set1: "", set2: "" }];
          setScoreSet(newSet);
          getScoreData(newSet);
          handleAddAndDeleteRow(newSet || []);
           handleUpdateFixture(true);
        }
      } catch (err) {
        console.log(" Error in Adding the match set", err);
        setError(true);
        setErrorMessage(
          err?.data?.message ||
            "Oops! Something went wrong while deleting the set. Please try again."
        );
      } finally {
        setActionPending(false);
        setAddButtonClicked(false);
      }
    };
    if (addButtonClicked) {
      addMatchSet();
    }
  }, [addButtonClicked]);

  useEffect(() => {
    if (scoreUpdateArray?.length > 0) {
      setScoreSet(scoreUpdateArray);
    } else {
      setScoreSet([{ set1: "", set2: "" }]);
    }
  }, [scoreUpdateArray]);
  return (
    <div>
      <div className="flex flex-col gap-4 justify-between border-[1px] border-[#696CFF29] p-2 sm:p-6 mt-2 rounded-lg divide-y divide-[#718EBF] lg:divide-none">
        {scoreSet.map((score, index) => {
          return (
            <InputSet
              key={`score_${index}`}
              index={index}
              handleScoreChange={handleScoreChange}
              scoreUpdateArray={scoreUpdateArray}
              isForfeited={isForfeited} // Pass the forfeit status to InputSet
            />
          );
        })}

        {error && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="flex items-center justify-center gap-2 m-auto">
          {scoreSet.length > 1 && (
            <Button
              className="min-w-fit  lg:w-[170px] p-2 h-[6vh] bg-red-700 text-white rounded-[1vh] flex items-center justify-center gap-2 m-auto hover:bg-red-500"
              onClick={handleDeleteRow}
              loading={deleteButtonClicked && actionPending}
              disabled={isForfeited} // Disable the delete button when forfeited
            >
              <RiDeleteBin2Line />
              Delete Row
            </Button>
          )}
          {scoreSet.length < 5 && (
            <Button
              className="min-w-fit lg:w-[180px] p-2 h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2 m-auto"
              onClick={handleRow}
              loading={addButtonClicked && actionPending}
              disabled={isForfeited} // Disable the add button when forfeited
            >
              <IoMdAdd />
              Add Set
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const PlayerDetails = ({ players }) => {
  const {
    player1 = "",
    player2 = "",
    match = "",
    location,
    date,
    time,
    court,
    opponent1,
    opponent2,
    profilePics1 = [],
    profilePics2 = [],
  } = players;

  const player1ProfilePic =
    profilePics1?.length > 0 ? profilePics1[0].profilePic : dummyImage;
  const player2ProfilePic =
    profilePics2?.length > 0 ? profilePics2[0].profilePic : dummyImage;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-3 mt-3 rounded-lg bg-[#5B8DFF1A] shadow-sm gap-2">
      <div className="flex flex-col items-center gap-3 w-full md:w-[40%] py-2">
        <div className="relative">
          <img
            src={player1ProfilePic}
            alt={`${player1 || "Player 1"}`}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-blue-200"
          />
          {opponent1?.forfeit && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Forfeited
            </div>
          )}
        </div>
        <p className="text-matchModalTextColor font-semibold text-center mt-1 max-w-full">
          {player1 || "TBD"}
        </p>
      </div>

      <div className="w-full md:w-[20%] py-4">
        <MatchLocationDetails
          match={match}
          location={location}
          date={date}
          time={time}
          court={court}
        />
      </div>

      <div className="flex flex-col items-center gap-3 w-full  md:w-[40%] py-2">
        <div className="relative">
          <img
            src={player2ProfilePic}
            alt={`${player2 || "Player 2"}`}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-blue-200"
          />
          {opponent2?.forfeit && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Forfeited
            </div>
          )}
        </div>
        <p className="text-matchModalTextColor font-semibold text-center mt-1 max-w-full">
          {player2 || "TBD"}
        </p>
      </div>
    </div>
  );
};

const MatchLocationDetails = ({ match, location, date, time, court }) => {
  const formattedMonth = dateAndMonth(date);
  console.log(formattedMonth);
  return (
    <div className="flex flex-col items-center gap-3 ">
      <p className="text-matchTextColor text-md font-[600]">
        Match <span>{match}</span>
      </p>

      <div className="flex items-center justify-between divide-x divide-[#232323]">
        <p className="text-matchTextColor pr-2">{time?.startTime || "1:00"}</p>
        <p className="text-matchTextColor pl-2 pr-2">
          {formattedMonth.day || ""} <span>{formattedMonth.month || ""}</span>
        </p>
      </div>

      {/* <div className="flex items-center justify-between gap-2">
        <CiLocationOn color="#1570EF" className="w-[24px] h-[24px]" />
        <p className="text-md text-[#1570EF]">{location?.name || ""}</p>
        <p className="text-md text-[#1570EF]">{court || 1}</p>
      </div> */}
    </div>
  );
};

ForfietCheckBox.propTypes = {
  handlePlayerSelection: PropTypes.func,
};

PlayerSelector.propTypes = {
  players: PropTypes.object,
  handleSelectedPlayer: PropTypes.func,
};

InputSet.propTypes = {
  index: PropTypes.number,
  handleScoreChange: PropTypes.func,
  isForfeited: PropTypes.bool,
};

MatchScoreUpdateSet.propTypes = {
  getScoreData: PropTypes.func,
  scoreUpdateArray: PropTypes.array,
  tournamentId: PropTypes.string,
  eventId: PropTypes.string,
  fixtureId: PropTypes.string,
  matchId: PropTypes.string,
  handleUpdateFixture: PropTypes.func,
  players: PropTypes.object,
};

PlayerDetails.propTypes = {
  players: PropTypes.object,
};
MatchLocationDetails.propTypes = {
  match: PropTypes.number,
  location: PropTypes.object,
  date: PropTypes.string,
  time: PropTypes.string,
  court: PropTypes.number,
};

ScoreUpdateModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  players: PropTypes.object,
  fixtureId: PropTypes.string,
  tournamentId: PropTypes.string,
  eventId: PropTypes.string,
  currentMatchId: PropTypes.string,
  handleUpdateFixture: PropTypes.func,
};
