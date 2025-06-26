import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createFixture,
  getFixture,
  publishFixture,
  unPublishFixture,
  updateSeeding,
} from "../../redux/tournament/fixturesActions";
import { showError } from "../../redux/Error/errorSlice";

import Button from "../Common/Button";
import EmptyBanner from "../Common/EmptyStateBanner";
import Spinner from "../Common/Spinner";
import { ErrorModal } from "../Common/ErrorModal";
import { MatchModal } from "../Common/MatchModal";
import PropTypes from "prop-types";
import { SuccessModal } from "../Common/SuccessModal";
import NotificationBanner from "../Common/NotificationBanner";
import { suffleIcon } from "../../Assests";
import { TbSwipe } from "react-icons/tb";
import { PlayerSelectionModal } from "../Common/PlayerSeedingModal";
import { showSuccess } from "../../redux/Success/successSlice";
import { resetFixtureSuccess } from "../../redux/tournament/fixtureSlice";
import { getFixtureById } from "../../redux/tournament/fixturesActions";
import GroupAndRoundNameModal from "./GroupAndRoundNameModal";
import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";
import DateAndTimeModal from "./DateAndTimeModal";

const formatMatchData = (fixture, suffledPlayers) => {
  if (!fixture || !suffledPlayers?.length) {
    return;
  }

  const stageId = fixture?.currentStage;
  const stageData = fixture?.bracketData?.stage;
  const stageUpdatingTheSeeding = stageData[stageId]; // to get the current stage which is doing seeding

  const updatedSeedingData = suffledPlayers.map((player) => {
    // for removing the id and tournament id from the player (API requirement)
    const { id, tournament_id, ...rest } = player;
    return rest;
  });

  return {
    stageId,
    stageData: { ...stageUpdatingTheSeeding, seeding: updatedSeedingData },
  };
};

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const playerShuffling = (participants) => {
  if (!participants?.length) return;
  const array = [...participants];
  const totalParticipants = participants?.length - 1;
  for (let i = 0; i < totalParticipants; i++) {
    const randomNumber = Math.ceil(getRandomArbitrary(i, totalParticipants));
    [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
  }

  return array;
};

export const TournamentHybridFixture = ({ tournament, fixtureId }) => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [openPlayerSeedingModal, setOpenPlayerSeedingModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [matchMetaData, setMatchMetaData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [suffledPlayers, setSuffledPlayers] = useState([]);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openDateAndTimeModal, setOpenDateAndTimeModal] = useState(false);
  const [nameModalData, setNameModalData] = useState({
    groupId: null,
    roundId: null,
    currentTitle: null,
    type: "",
    existingMetaData: {},
  });
  const [changedName, setChangedName] = useState("");

  const {
    fixture,
    isFixtureSuccess,
    isCreatingFixture,
    FixtureCreatedSuccess,
    FixtureCreationError,
    isFetchingFixture,
    ErrorMessage,
    isPublishing,
    isPublished,
    publishError,
    isUnPublishing,
    isUnPublished,
    unPublishError,
  } = useSelector((state) => state.fixture);

  const isChildFixture = fixture?.isChildFixture;

  const handleCreateFixture = useCallback(() => {
    dispatch(
      createFixture({
        tour_Id: tournamentId,
        eventId,
      })
    );
  }, []);

  const handleplayerShuffling = () => {
    const result = playerShuffling(fixture?.bracketData?.participant);
    const formattedMatchData = formatMatchData(fixture, result);

    dispatch(
      updateSeeding({
        tour_Id: tournamentId,
        eventId,
        fixtureId,
        formData: formattedMatchData,
        stageId: fixture?.bracketData.stage[0].id,
      })
    );
    setSuffledPlayers(result);
  };

  const handleMatchModal = (value) => {
    setOpenMatchModal(value);
  };
  const handleDateAndTimeModal = (value) => {
    setOpenDateAndTimeModal(value);
  };
  const handlePlayerSeddingModal = (value) => {
    setOpenPlayerSeedingModal(value);
  };

  const handlePublishFixture = () => {
    dispatch(
      publishFixture({
        tour_Id: tournamentId,
        eventId,
        fixtureId,
      })
    );
  };

  const handleUnPublishFixture = () => {
    dispatch(
      unPublishFixture({
        tour_Id: tournamentId,
        eventId,
        fixtureId,
      })
    );
  };

  useEffect(() => {
    dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
  }, []);

  useEffect(() => {
    if (FixtureCreatedSuccess || isFixtureSuccess) {
      if (fixture) {
        window?.bracketsViewer?.render(
          {
            stages: fixture?.bracketData?.stage || [],
            matches: fixture?.bracketData?.match || [],
            matchGames: fixture?.bracketData?.match_game || [],
            participants: fixture?.bracketData?.participant || [],
          },
          {
            highlightParticipantOnHover: true,
            clear: true,
            // groupTitles: fixture?.bracketData?.round?.map(r => `Round ${r.number}`),
            // matchStatusConfig: {
            //   2: { label: 'Pending', className: 'match-status-pending' },
            //   3: { label: 'Completed', className: 'match-status-completed' }
            // }
          }
        );

        const players = fixture?.bracketData?.participant?.map(
          (participant) => ({
            name: participant.name,
            id: participant.id,
          })
        );

        setPlayers(players);
      }

      dispatch(resetFixtureSuccess());
    }
  }, [fixture, isFixtureSuccess, FixtureCreatedSuccess]);

  window.bracketsViewer.onMatchClicked = (match) => {
    const { opponent1, opponent2, metaData = {} } = match;

    if (opponent1?.id?.toString() && opponent2?.id?.toString()) {
      setOpenMatchModal(true);
    }

    setMatchDetails(match);
    setMatchMetaData(metaData);
  };

  useEffect(() => {
    if (FixtureCreationError || FixtureCreatedSuccess) {
      dispatch(
        showError({
          message:
            ErrorMessage ||
            "Oops! something went wrong while creating the fixture.",
          onClose: "hideError",
        })
      );
    }

    if (publishError) {
      dispatch(
        showError({
          message:
            ErrorMessage ||
            "Oops! something went wrong while publishing the fixture.",
          onClose: "hideError",
        })
      );
    }
    if (unPublishError) {
      dispatch(
        showError({
          message:
            ErrorMessage ||
            "Oops! something went wrong while unpublishing the fixture.",
          onClose: "hideError",
        })
      );
    }
  }, [FixtureCreationError, publishError, unPublishError]);

  useEffect(() => {
    if (isPublished || FixtureCreatedSuccess || isUnPublished) {
      dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
    }
  }, [isPublished, FixtureCreatedSuccess, isUnPublished]);

  useEffect(() => {
    if (!fixture?.bracketData) return;

    // Delay to ensure DOM is fully rendered by bracketsViewer
    const timeoutId = setTimeout(() => {
      // Add Click Listener to Round Titles
      const groupTitles = document.querySelectorAll(
        ".brackets-viewer section.group h2"
      );
      groupTitles.forEach((el, index) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (el) => {
          handleGroupClick(index, el.target);
        });
      });

      const roundTitles = document.querySelectorAll(
        ".brackets-viewer article.round h3"
      );
      roundTitles.forEach((el, index) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (el) => {
          handleRoundClick(index, el.target);
        });
      });

      if (fixture?.format === "RR") {
        roundTitles.forEach((el) => {
          el.style.display = "none";
        });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fixture]);

  useEffect(() => {
    if (isPublished || FixtureCreatedSuccess || isUnPublished) {
      dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
    }
  }, [isPublished, FixtureCreatedSuccess, isUnPublished]);

  // Update the handleGroupClick function
  const handleGroupClick = (index, el) => {
    const formatName = fixture.format;
    let currentGroupName = "";
    let existingMetaData = {};

    if (formatName === "RR") {
      const matchedGroup = fixture?.bracketData?.group?.find(
        (group) => group.id === index
      );
      currentGroupName = matchedGroup?.groupName || el.innerText;
      existingMetaData = matchedGroup?.metaData || {};

      setNameModalData({
        groupId: index,
        roundId: null,
        currentTitle: el.innerText,
        type: "group",
        existingMetaData,
      });
      setOpenNameModal(true);
      setChangedName(currentGroupName);
    } else if (formatName === "SE") {
      const matchedGroup = fixture?.bracketData?.group?.find(
        (group) => group.id === 0
      );
      currentGroupName = matchedGroup?.groupName || el.innerText;
      existingMetaData = matchedGroup?.metaData || {};

      setNameModalData({
        groupId: 0,
        roundId: null,
        currentTitle: el.innerText,
        type: "group",
        existingMetaData,
      });
      setOpenNameModal(true);
      setChangedName(currentGroupName);
    }
  };

  // Update the handleRoundClick function
  const handleRoundClick = (index, el) => {
    const formatName = fixture.format;
    let currentRoundName = "";
    let existingMetaData = {};

    if (formatName === "RR") {
      const sectionGroup = el.closest("section.group");
      const groupId = parseInt(sectionGroup.getAttribute("data-group-id"));
      const matchedRound = fixture?.bracketData?.round?.find(
        (round) => round.id === index && round.group_id === groupId
      );
      currentRoundName = matchedRound?.roundName || el.innerText;
      existingMetaData = matchedRound?.metaData || {};

      setNameModalData({
        groupId: groupId,
        roundId: index,
        currentTitle: el.innerText,
        type: "round",
        existingMetaData,
      });
      setOpenNameModal(true);
      setChangedName(currentRoundName);
    } else if (formatName === "SE") {
      const matchedRound = fixture?.bracketData?.round?.find(
        (round) => round.id === index
      );
      currentRoundName = matchedRound?.roundName || el.innerText;
      existingMetaData = matchedRound?.metaData || {};

      setNameModalData({
        groupId: 0,
        roundId: index,
        currentTitle: el.innerText,
        type: "round",
        existingMetaData,
      });
      setOpenNameModal(true);
      setChangedName(currentRoundName);
    } else if (formatName === "DE") {
      if (el.innerText.includes("WB")) {
        const matchedRound = fixture?.bracketData?.round?.find(
          (round) => round.id === index && round.group_id === 0
        );
        currentRoundName = matchedRound?.roundName || el.innerText;
        existingMetaData = matchedRound?.metaData || {};

        setNameModalData({
          groupId: 0,
          roundId: index,
          currentTitle: el.innerText,
          type: "round",
          existingMetaData,
        });
        setOpenNameModal(true);
        setChangedName(currentRoundName);
      } else if (el.innerText.includes("LB")) {
        const matchedRound = fixture?.bracketData?.round?.find(
          (round) => round.id === index - 1 && round.group_id === 1
        );
        currentRoundName = matchedRound?.roundName || el.innerText;
        existingMetaData = matchedRound?.metaData || {};

        setNameModalData({
          groupId: 1,
          roundId: index - 1,
          currentTitle: el.innerText,
          type: "round",
          existingMetaData,
        });
        setOpenNameModal(true);
        setChangedName(currentRoundName);
      } else if (el.innerText.includes("Final")) {
        const roundId = parseInt(
          el.parentElement.getAttribute("data-round-id")
        );
        const matchedRound = fixture?.bracketData?.round?.find(
          (round) => round.id === roundId && round.group_id === 2
        );
        currentRoundName = matchedRound?.roundName || el.innerText;
        existingMetaData = matchedRound?.metaData || {};

        setNameModalData({
          groupId: 2,
          roundId: roundId,
          currentTitle: el.innerText,
          type: "round",
          existingMetaData,
        });
        setOpenNameModal(true);
        setChangedName(currentRoundName);
      }
    }
  };

  const handleCloseNameModal = () => {
    setOpenNameModal(false);
    // Refetch fixture data to get updated names
    dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
  };

  if (isFetchingFixture) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        {fixture?.status !== "PUBLISHED" && (
          <NotificationBanner
            message="Fill Match Details Before Publishing"
            messageStyle="text-xs sm:text-sm  text-[#E82B00]"
            wrapperStyle="flex item-center w-full p-2 bg-[#FFF0D3] border-2 border-dashed border-[#E82B00] rounded-lg"
          />
        )}
        <button
          className="bg-white border-2 border-[#CAD9FB] p-2 rounded-lg disabled:bg-slate-300"
          onClick={() => setOpenPlayerSeedingModal(true)}
          disabled={fixture?.status === "PUBLISHED" || !fixture}
        >
          <TbSwipe className="w-[20px] h-[20px]" />
        </button>
        <div className="flex gap-2">
          <Button
            className={
              "w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto disabled:bg-blue-400 disabled:cursor-not-allowed"
            }
            onClick={handleDateAndTimeModal}
          >
            Update Time
          </Button>
          {fixture?.status === "PUBLISHED" ? (
            <Button
              className={`w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto disabled:bg-blue-400 disabled:cursor-not-allowed ${
                isChildFixture ? "hidden" : ""
              }`}
              onClick={handleUnPublishFixture}
              loading={isUnPublishing}
              disabled={fixture?.status !== "PUBLISHED" || !fixture}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              className={`w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto disabled:bg-blue-400 disabled:cursor-not-allowed ${
                isChildFixture ? "hidden" : ""
              }`}
              onClick={handlePublishFixture}
              loading={isPublishing}
              disabled={fixture?.status === "PUBLISHED" || !fixture}
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="w-full flex gap-4 flex-col justify-center items-start flex-1 rounded-md overflow-x-auto">
        {/* <Button
          className="w-[200px] h-[50px] ml-auto text-white text-md rounded-lg disabled:bg-blue-400"
          onClick={handleCreateFixture}
          loading={isCreatingFixture}
          disabled={fixture?.status === "PUBLISHED"}
        >
          {fixture ? "Recreate Fixture" : "Create Fixture"}
        </Button> */}
        <div className="brackets-viewer "></div>
        <ErrorModal />
        <SuccessModal />

        <PlayerSelectionModal
          isOpen={openPlayerSeedingModal}
          onCancel={handlePlayerSeddingModal}
          players={players}
          participants={fixture?.bracketData?.participant}
          fixtureId={fixtureId}
          playersList={fixture?.playersList}
        />
        <MatchModal
          isOpen={openMatchModal}
          onCancel={handleMatchModal}
          tournament={tournament}
          matchDetails={matchDetails}
          participants={fixture?.bracketData?.participant}
          tournamentId={tournamentId}
          eventId={eventId}
          fixtureId={fixture?._id}
          metaData={matchMetaData}
        />
        {openNameModal && (
          <GroupAndRoundNameModal
            groupId={nameModalData.groupId}
            type={nameModalData.type}
            roundId={nameModalData.roundId}
            currentTitle={nameModalData.currentTitle}
            onClose={handleCloseNameModal}
            tournamentID={tournamentId}
            categoryId={eventId}
            fixtureId={fixture?._id}
            changedName={changedName}
            existingMetaData={nameModalData.existingMetaData}
            eventFormat={fixture?.format}
          />
        )}
        {openDateAndTimeModal && (
          <DateAndTimeModal
            tournamentId={tournamentId}
            categoryId={eventId}
            fixtureId={fixture?._id}
            showModal={openDateAndTimeModal}
            handleShowModal={handleDateAndTimeModal}
          />
        )}
        <div className="flex items-center justify-center w-full h-full text-lg">
          {!fixture && <NoFixtureExist />}
        </div>
      </div>
    </div>
  );
};

const NoFixtureExist = () => {
  return (
    <EmptyBanner message="No fixture has been found for this category. Please create the fixture to get started." />
  );
};

TournamentHybridFixture.propTypes = {
  tournament: PropTypes.object,
};
