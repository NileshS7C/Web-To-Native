import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  updateMatchSet,
  updateMatch,
  updateMatchSetCount,
  getFixture,
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

const checkAllField = (scoreData, onValidationError, setDisableButton) => {
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

      if (currentMatch) {
        const score1 = Number(set?.set1);
        const score2 = Number(set?.set2);

        // Determine result based on scores
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
      }
    })
    .filter((player) => player?.opponent1?.score && player?.opponent2?.score);

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

export const ScoreUpdateModal = ({
  isOpen,
  onCancel,
  players,
  fixtureId,
  tournamentId,
  eventId,
  currentMatchId,
  handleUpdateFixture,
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

  useEffect(() => {
    const scoreUpdates = players?.matchGames?.map((game) => {
      if (game.opponent1?.score && game.opponent2?.score) {
        return {
          set1: game?.opponent1?.score,
          set2: game?.opponent2?.score,
        };
      }
    });
    setScoreUpdateArray(scoreUpdates);
  }, [players]);

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

  useEffect(() => {
    checkAllField(scoreUpdateArray, handleValidationError, setDisableButton);
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

    try {
      setIsUpdating(true);
      setErrorMessage("");
      let result;
      if (!showPlayerSelections) {
        result = await dispatch(
          updateMatchSet({
            formData: currentSetUpdated,
            tour_Id: tournamentId,
            eventId,
            fixtureId,
          })
        ).unwrap();
      } else {
        result = await dispatch(
          updateMatch({
            formData: currentSetUpdated,
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
        dispatch(getFixture({ tour_Id: tournamentId, eventId }));
        onCancel(false);
      }
    } catch (err) {
      console.log(" error in updating the score", err);
      setUpdateError(true);
      setErrorMessage(
        err.data.message ||
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[40%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col gap-2">
              <MatchModalTitle
                tournamentName={tournament?.tournamentName}
                eventName={category?.categoryName}
                onCancel={onCancel}
              />

              {updateError && <ErrorBanner message={errorMessage} />}

              {(players?.player1_id == null || players?.player2_id == null) && (
                <NotificationBanner
                  message="Both opponents are required to update the match score."
                  messageStyle="text-sm text-[#E82B00]"
                  wrapperStyle="flex item-center w-full p-2 bg-[#FFF0D3] border-2 border-dashed border-[#E82B00] rounded-lg"
                />
              )}
              {validationError && (
                <p className="text-md text-red-600">
                  Opponent 1 and Opponent 2 scores are required.
                </p>
              )}

              {players?.player1_id != null && players?.player2_id != null && (
                <>
                  <PlayerDetails players={players} />

                  <ForfietCheckBox
                    handlePlayerSelection={handlePlayerSelection}
                  />

                  {showPlayerSelections && (
                    <PlayerSelector
                      players={players}
                      handleSelectedPlayer={handleSelectedPlayer}
                    />
                  )}
                  <MatchScoreUpdateSet
                    getScoreData={getScoreData}
                    players={players}
                    scoreUpdateArray={scoreUpdateArray}
                    tournamentId={tournamentId}
                    eventId={eventId}
                    fixtureId={fixtureId}
                    matchId={players?.matchId}
                    handleUpdateFixture={handleUpdateFixture}
                  />
                  <div className="mr-0 mt-3 flex items-end justify-between">
                    <Button
                      className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2"
                      type="submit"
                      onClick={(e) => handleScoreUpdate(e)}
                      disabled={!showPlayerSelections}
                    >
                      Forfiet
                    </Button>
                    {!showPlayerSelections && (
                      <Button
                        className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2"
                        type="submit"
                        onClick={(e) => handleScoreUpdate(e)}
                        loading={isUpdating}
                        disabled={validationError || disableButton}
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

const ForfietCheckBox = ({ handlePlayerSelection }) => {
  return (
    <div className="flex flex-1 gap-2">
      <input
        type="checkbox"
        name="forfiet"
        id="forfiet"
        onChange={(e) => {
          handlePlayerSelection(e.target.checked);
        }}
      />
      <label htmlFor="forfiet">Do you want to forfiet any player?</label>
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
      onChange={(e) => handleSelectedPlayer(e.target.value)}
      defaultValue=""
    >
      <option value="">Select Player</option>
      <option value={player1_id}>{player1}</option>
      <option value={player2_id}>{player2}</option>
    </select>
  );
};

const InputSet = ({ index, handleScoreChange, scoreUpdateArray }) => {
  return (
    <div className="flex flex-col gap-2  xl:flex-row  items-center justify-between py-2">
      <input
        className="pl-2 w-full  border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
        type="number"
        onWheel={(e) => e.target.blur()}
        value={(scoreUpdateArray && scoreUpdateArray[index]?.set1) || ""}
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set1", index);
        }}
      />
      <p className="inline-flex items-center gap-1 justify-center text-md text-matchTextColor border-[1px] border-[#718EBF] w-[100px] lg:w-[80px] text-center h-[5vh]  rounded-md p-2">
        Set <span>{index + 1} </span>
      </p>
      <input
        className="pl-2  w-full border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="number"
        onWheel={(e) => e.target.blur()}
        value={(scoreUpdateArray && scoreUpdateArray[index]?.set2) || ""}
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set2", index);
        }}
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
}) => {
  const dispatch = useDispatch();
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const [scoreSet, setScoreSet] = useState([{ set1: "", set2: "" }]);
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
        handleUpdateFixture(null);
        setActionPending(true);
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
            return newSet;
          });

          handleUpdateFixture(true);

          setFixture(result?.data?.fixture ?? null);
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

          setScoreSet((prev) => {
            const newSet = [...prev, { set1: "", set2: "" }];
            getScoreData(newSet);
            return newSet;
          });
          setFixture(result?.data?.fixture ?? null);

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
      <div className="flex flex-col gap-4 justify-between border-[1px] border-[#696CFF29] p-6 mt-2 rounded-lg divide-y divide-[#718EBF] lg:divide-none">
        {scoreSet.map((score, index) => {
          return (
            <InputSet
              key={`score_${index}`}
              index={index}
              handleScoreChange={handleScoreChange}
              scoreUpdateArray={scoreUpdateArray}
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
  } = players;

  return (
    <div className="flex items-center justify-center md:justify-between flex-wrap  p-2 mt-2 rounded-md bg-[#5B8DFF1A]">
      <div className="flex flex-col items-center gap-2">
        <img
          src={dummyImage}
          alt="opponent 1"
          className="w-[100px] h-[100px] object-cover"
        />
        <p className="text-matchModalTextColor">{player1}</p>
      </div>
      <MatchLocationDetails
        match={match}
        location={location}
        date={date}
        time={time}
        court={court}
      />
      <div className="flex flex-col items-center gap-2">
        <img
          src={dummyImage}
          alt="opponent 1"
          className="w-[100px] h-[100px] object-cover"
        />
        <p className="text-matchModalTextColor">{player2}</p>
      </div>
    </div>
  );
};

const MatchLocationDetails = ({ match, location, date, time, court }) => {
  const formattedMonth = dateAndMonth(date);

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

      <div className="flex items-center justify-between gap-2">
        <CiLocationOn color="#1570EF" className="w-[24px] h-[24px]" />
        <p className="text-md text-[#1570EF]">{location?.name || ""}</p>
        <p className="text-md text-[#1570EF]">{court || 1}</p>
      </div>
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
};

MatchScoreUpdateSet.propTypes = {
  getScoreData: PropTypes.func,
  scoreUpdateArray: PropTypes.array,
  tournamentId: PropTypes.string,
  eventId: PropTypes.string,
  fixtureId: PropTypes.string,
  matchId: PropTypes.string,
  handleUpdateFixture: PropTypes.func,
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
