import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { MatchModalTitle } from "./MatchModal";
import PropTypes from "prop-types";
import { dummyImage } from "../../Assests";
import { CiLocationOn } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import Button from "./Button";
import { useState, useEffect } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { updateMatchSet } from "../../redux/tournament/fixturesActions";
import { showSuccess } from "../../redux/Success/successSlice";
import ErrorBanner from "./ErrorBanner";

const checkAllField = (scoreData, onValidationError, setDisableButton) => {
  if (!scoreData.length) {
    return setDisableButton(true);
  } else {
    setDisableButton(false);
  }

  const checkAllFieldsAreFilled = scoreData.every(
    (score) => score.set1 && score.set2
  );

  if (!checkAllFieldsAreFilled) {
    onValidationError(true);
  } else {
    onValidationError(false);
  }
};

const formattedMatchData = (scoreData, players) => {
  return scoreData.map((set, index) => {
    const currentMatch = players.matchGames.find(
      (game) => game?.id?.toString() === index.toString()
    );

    if (currentMatch) {
      const { status, number, ...rest } = currentMatch;
      return {
        ...rest,
        opponent1: { ...currentMatch.opponent1, score: Number(set.set1) },
        opponent2: { ...currentMatch.opponent2, score: Number(set.set2) },
      };
    }
  });
};

export const ScoreUpdateModal = ({
  isOpen,
  onCancel,
  players,
  fixtureId,
  tournamentId,
  eventId,
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

  const getScoreData = (data) => {
    setFinalScoreData(data);
  };

  const handleValidationError = (data) => {
    setValidationError(data);
  };

  useEffect(() => {
    checkAllField(finalScoreData, handleValidationError, setDisableButton);
  }, [finalScoreData]);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setValidationError(false);
      setUpdateError(false);
      setFinalScoreData([]);
    }
  }, [isOpen]);

  const handleScoreUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(false);
    setValidationError(false);
    const currentSetUpdated = formattedMatchData(finalScoreData, players);

    if (validationError) return;

    try {
      setIsUpdating(true);
      setErrorMessage("");
      const result = await dispatch(
        updateMatchSet({
          formData: currentSetUpdated[0],
          tour_Id: tournamentId,
          eventId,
          fixtureId,
        })
      ).unwrap();

      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Score updated Successfully.",
            onClose: "hideSuccess",
          })
        );
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
              {validationError && (
                <p className="text-md text-red-600">
                  Opponent 1 and Opponent 2 scores are required.
                </p>
              )}

              <PlayerDetails players={players} />
              <MatchScoreUpdateSet getScoreData={getScoreData} />
              <div className="mr-0 mt-3 flex items-end justify-end">
                <Button
                  className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2"
                  type="submit"
                  onClick={(e) => handleScoreUpdate(e)}
                  loading={isUpdating}
                  disabled={validationError || disableButton}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const InputSet = ({ index, handleScoreChange }) => {
  return (
    <div className="flex flex-col  gap-2  lg:flex-row items-center justify-between py-2">
      <input
        className="pl-2 border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
        type="number"
        onWheel={(e) => e.target.blur()}
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set1", index);
        }}
      />
      <p className="inline-flex items-center gap-1 justify-center text-md text-matchTextColor border-[1px] border-[#718EBF] w-[100px] lg:w-[80px] text-center h-[5vh]  rounded-md ">
        Set <span>{index + 1} </span>
      </p>
      <input
        className="pl-2 border-[1px] border-[#718EBF] h-[5vh] rounded-md bg-[#F7F9FC] focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="number"
        onWheel={(e) => e.target.blur()}
        onChange={(e) => {
          const value = e.target.value;
          handleScoreChange(value, "set2", index);
        }}
      />
    </div>
  );
};
const MatchScoreUpdateSet = ({ getScoreData }) => {
  const [scoreSet, setScoreSet] = useState([{ set1: "", set2: "" }]);
  const handleRow = () => {
    setScoreSet((prev) => [...prev, { set1: "", set2: "" }]);
  };

  const handleScoreChange = (value, type, index) => {
    setScoreSet((prev) => {
      const newSet = [...prev];
      newSet[index] = {
        ...newSet[index],
        [type]: value,
      };
      getScoreData(newSet);
      return newSet;
    });
  };

  const handleDeleteRow = () => {
    const updatedRows = [...scoreSet].splice(0, scoreSet.length - 1);
    setScoreSet(updatedRows);
  };
  return (
    <div>
      <div className="flex flex-col gap-4 justify-between border-[1px] border-[#696CFF29] p-6 mt-2 rounded-lg divide-y divide-[#718EBF] lg:divide-none">
        {scoreSet.map((score, index) => {
          return (
            <InputSet
              key={`score_${index}`}
              index={index}
              handleScoreChange={handleScoreChange}
            />
          );
        })}

        <div className="flex items-center justify-center gap-2 m-auto">
          {scoreSet.length > 1 && (
            <Button
              className="w-[15vh] h-[6vh] bg-red-700 text-white rounded-[1vh] flex items-center justify-center gap-2 m-auto hover:bg-red-500"
              onClick={handleDeleteRow}
            >
              <RiDeleteBin2Line />
              Delete Row
            </Button>
          )}
          {scoreSet.length < 5 && (
            <Button
              className="w-[12vh] h-[6vh] text-white rounded-[1vh] flex items-center justify-center gap-2 m-auto"
              onClick={handleRow}
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
  return (
    <div className="flex flex-col items-center gap-3 ">
      <p className="text-matchTextColor text-md font-[600]">
        Match <span>{match}</span>
      </p>

      <div className="flex items-center justify-between divide-x divide-[#232323]">
        <p className="text-matchTextColor pr-2">{time || "1:00"}</p>
        <p className="text-matchTextColor pl-2 pr-2">{date || "20 December"}</p>
        <p className="text-matchTextColor pl-2">{date || "20 December"}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <CiLocationOn color="#1570EF" className="w-[24px] h-[24px]" />
        <p className="text-md text-[#1570EF]">
          {location.name || "91 Springboard"}
        </p>
        <p className="text-md text-[#1570EF]">{court || 1}</p>
      </div>
    </div>
  );
};

InputSet.propTypes = {
  index: PropTypes.number,
  handleScoreChange: PropTypes.func,
};

MatchScoreUpdateSet.propTypes = {
  getScoreData: PropTypes.func,
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
};
