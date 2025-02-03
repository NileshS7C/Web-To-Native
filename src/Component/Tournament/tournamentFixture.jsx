import { useCallback, useEffect, useMemo } from "react";
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

export const TournamentFixture = () => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
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

  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);

  useEffect(() => {
    if (FixtureCreatedSuccess || isFixtureSuccess) {
      window?.bracketsViewer?.render({
        stages: stableFixture?.bracketData?.stage,
        matches: stableFixture?.bracketData?.match,
        matchGames: stableFixture?.bracketData?.match_game,
        participants: stableFixture?.bracketData?.participant,
      });
    }
  }, [fixture, isFixtureSuccess, FixtureCreatedSuccess]);

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
    <div className="brackets-viewer w-full flex  flex-col justify-center items-start flex-1">
      <Button
        className="w-[250px] h-[50px] ml-auto text-white text-[14px] rounded-lg"
        onClick={handleCreateFixture}
        loading={isCreatingFixture}
      >
        Create Fixture
      </Button>
      <ErrorModal />

      <div className="flex items-center justify-center w-full h-full text-lg">
        {!fixture && <NoFixtureExist />}
      </div>
    </div>
  );
};

const NoFixtureExist = () => {
  return (
    <EmptyBanner message="No fixture has been found for this category. Please create the fixture to get started." />
  );
};
