import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createFixture,
  getFixture,
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

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const playerSuffling = (participants) => {
  if (!participants?.length) return;
  const array = [...participants];
  const totalParticipants = participants?.length - 1;
  for (let i = 0; i < totalParticipants; i++) {
    const randomNumber = Math.ceil(getRandomArbitrary(i, totalParticipants));
    [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
  }

  return array;
};

export const TournamentFixture = ({ tournament }) => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [openPlayerSeedingModal, setOpenPlayerSeedingModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [players, setPlayers] = useState([]);
  const [suffledPlayers, setSuffledPlayers] = useState([]);
  const {
    fixture,
    isFixtureSuccess,
    isCreatingFixture,
    FixtureCreatedSuccess,
    FixtureCreationError,
    isFetchingFixture,
    ErrorMessage,
  } = useSelector((state) => state.fixture);

  const stableFixture = useMemo(() => fixture, [fixture]);

  const handleCreateFixture = useCallback(() => {
    dispatch(createFixture({ tour_Id: tournamentId, eventId }));
  }, []);

  const handlePlayerSuffling = useCallback(() => {
    const result = playerSuffling(stableFixture?.bracketData?.participant);
    setSuffledPlayers(result);
  }, []);

  const handleMatchModal = (value) => {
    setOpenMatchModal(value);
  };

  const handlePlayerSeddingModal = (value) => {
    setOpenPlayerSeedingModal(value);
  };

  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);

  useEffect(() => {
    if (FixtureCreatedSuccess || isFixtureSuccess) {
      window?.bracketsViewer?.render(
        {
          stages: stableFixture?.bracketData?.stage,
          matches: stableFixture?.bracketData?.match,
          matchGames: stableFixture?.bracketData?.match_game,
          participants: stableFixture?.bracketData?.participant,
        },
        { highlightParticipantOnHover: true }
      );
      const players = stableFixture?.bracketData?.participant.map(
        (participant) => ({
          name: participant.name,
          id: participant.id,
        })
      );

      setPlayers(players);
    }
  }, [fixture, isFixtureSuccess, FixtureCreatedSuccess]);

  window.bracketsViewer.onMatchClicked = useCallback((match) => {
    const { opponent1, opponent2 } = match;
    if (opponent1?.id && opponent2?.id) {
      setOpenMatchModal(true);
    }

    setMatchDetails(match);
  }, []);

  useEffect(() => {
    if (FixtureCreationError) {
      dispatch(
        showError({
          message:
            ErrorMessage ||
            "Oops! something went wrong while creating the fixture.",
          onClose: "hideError",
        })
      );
    }
  }, [FixtureCreationError]);

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
        <NotificationBanner
          message="Fill Match Details Before Publishing"
          messageStyle="text-sm text-[#E82B00]"
          wrapperStyle="flex item-center w-full p-2 bg-[#FFF0D3] border-2 border-dashed border-[#E82B00] rounded-lg"
        />
        <button
          className="bg-[#CAD9FB] border-2 border-[#CAD9FB] p-2 rounded-lg"
          onClick={() => setOpenPlayerSeedingModal(true)}
        >
          <TbSwipe className="w-[20px] h-[20px]" />
        </button>
        <button
          className="bg-[#CAD9FB] border-2 border-[#CAD9FB] p-2 rounded-lg"
          onClick={handlePlayerSuffling}
        >
          <img src={suffleIcon} alt="suffle button" />
        </button>
        <Button className="w-[148px]  h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto">
          Publish
        </Button>
      </div>

      <div className="brackets-viewer  w-full flex  flex-col justify-center items-start flex-1">
        <Button
          className="w-[250px] h-[50px] ml-auto text-white text-[14px] rounded-lg"
          onClick={handleCreateFixture}
          loading={isCreatingFixture}
        >
          Create Fixture
        </Button>
        <ErrorModal />
        <SuccessModal />

        <PlayerSelectionModal
          isOpen={openPlayerSeedingModal}
          onCancel={handlePlayerSeddingModal}
          players={players}
          participants={stableFixture?.bracketData?.participant}
        />
        <MatchModal
          isOpen={openMatchModal}
          onCancel={handleMatchModal}
          tournament={tournament}
          matchDetails={matchDetails}
          participants={stableFixture?.bracketData?.participant}
          tournamentId={tournamentId}
          eventId={eventId}
          fixtureId={fixture?._id}
        />

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

TournamentFixture.propTypes = {
  tournament: PropTypes.object,
};
