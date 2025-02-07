import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getFixture } from "../../redux/tournament/fixturesActions";

import Button from "../Common/Button";
import Spinner from "../Common/Spinner";
import DataTable from "../Common/DataTable";
import EmptyBanner from "../Common/EmptyStateBanner";
import { backIcon, dummyImage, forwardIcon } from "../../Assests";

const MatchListingHeaders = [
  {
    key: "participant1",
    header: "Opponent 1",
    render: (item) => {
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={dummyImage}
            alt="playerImage"
            className="w-[30px] h-[30px] rounded-full"
          />
          <p className="text-matchTextColor font-semibold">{item?.player1}</p>
        </div>
      );
    },
  },
  {
    key: "match",
    header: "Match",
    render: (item) => {
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-matchTextColor font-semibold">
            Match <span>{item?.match}</span>
          </p>
          <Button className="px-2 py-2 w-[100px] text-white rounded-md">
            Edit
          </Button>
        </div>
      );
    },
  },
  {
    key: "participant2",
    header: "Opponent 2",
    render: (item) => {
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={dummyImage}
            alt="playerImage"
            className="w-[30px] h-[30px]  rounded-full"
          />
          <p className="text-matchTextColor font-semibold">{item?.player2}</p>
        </div>
      );
    },
  },
];

export const MatchesListing = () => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const { fixture, isFixtureSuccess, isFetchingFixture } = useSelector(
    (state) => state.fixture
  );
  const [currentRound, setCurrentRound] = useState(1);
  const [playerData, setPlayerData] = useState([]);
  const [totalRounds, setTotalRounds] = useState(0);

  const handleChangeRounds = (type) => {
    if (type === "back") {
      setCurrentRound((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setCurrentRound((prev) => (prev !== totalRounds ? prev + 1 : 1));
    }
  };

  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);

  useEffect(() => {
    if (fixture && currentRound) {
      const currentRoundId = fixture?.bracketData?.round.filter(
        (item) => item?.id?.toString() === (currentRound - 1)?.toString()
      );

      const currentRoundMatches = currentRoundId.flatMap((round) => {
        const match = fixture.bracketData.match.filter(
          (match) => match?.round_id?.toString() === round?.id?.toString()
        );

        return [...match];
      });

      const playerData =
        currentRoundMatches.length > 0 &&
        currentRoundMatches.flatMap(({ opponent1, opponent2, number }) => {
          const participantsById = new Map(
            fixture?.bracketData?.participant.map((p) => [p.id, p])
          );

          const players = [opponent1?.id, opponent2?.id]
            .map((id) => participantsById.get(id))
            .filter(Boolean);

          return players.length
            ? players.map(({ name }) => ({
                match: number,
                player1: name,
                player2: name,
              }))
            : [];
        });

      setPlayerData(playerData);

      setTotalRounds(fixture?.bracketData?.round.length);
    }
  }, [fixture, currentRound]);

  if (isFetchingFixture) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {!fixture && <NoMatchExist />}
      <div className="flex items-center justify-center gap-4 basis-sm">
        <button
          onClick={() => handleChangeRounds("back")}
          className="disabled:bg-red disabled:cursor-not-allowed"
          disabled={currentRound === 1}
        >
          <img
            src={backIcon}
            alt="back button for round"
            className={`${currentRound === 1 && "opacity-50"}`}
          />
        </button>

        <p className="text-matchTextColor font-bold text-sm sm:text-md:text-xl lg:text-2xl">
          Round <span>{currentRound}</span>
        </p>

        <button
          onClick={() => handleChangeRounds("forward")}
          className="disabled:bg-red disabled:cursor-not-allowed"
          disabled={currentRound === totalRounds}
        >
          <img
            src={forwardIcon}
            alt="forward button for round"
            className={`${currentRound === totalRounds && "opacity-50"}`}
          />
        </button>
      </div>

      <DataTable
        data={playerData}
        columns={MatchListingHeaders}
        className=""
        headerTextAlign="middle"
        rowPaddingY="4"
        alternateRowColors={true}
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
      />
    </div>
  );
};

const NoMatchExist = () => {
  return (
    <EmptyBanner message="No Matches has been found for this category. Please create the fixture to get started." />
  );
};
