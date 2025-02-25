import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getFixture } from "../../redux/tournament/fixturesActions";

import Button from "../Common/Button";
import Spinner from "../Common/Spinner";
import DataTable from "../Common/DataTable";
import EmptyBanner from "../Common/EmptyStateBanner";
import { backIcon, dummyImage, forwardIcon } from "../../Assests";
import { ScoreUpdateModal } from "../Common/ScoreUpdateModal";

const MatchListingHeaders = [
  {
    key: "participant1",
    header: "Opponent 1",
    render: (item) => {
      const { opponent1 = "" } = item;
      let isWinner;
      if (opponent1) {
        isWinner = opponent1.result === "win";
      }
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={dummyImage}
            alt="playerImage"
            className="w-[30px] h-[30px] rounded-full"
          />
          <p className="text-matchTextColor font-semibold">{item?.player1}</p>
          {isWinner && (
            <span className="inline-flex flex-1 max-w-fit font-semibold items-center rounded-2xl  px-2 py-1 text-xs ring-2 ring-inset ">
              Winner
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "match",
    header: "Match",
    render: (item, index, currentPage, handleClick) => {
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-matchTextColor font-semibold">
            Match <span>{item?.match}</span>
          </p>
          <Button
            className="px-2 py-2 w-[100px] text-white rounded-md"
            onClick={() => handleClick(item)}
          >
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
      const { opponent2 = "" } = item;
      let isWinner;
      if (opponent2) {
        isWinner = opponent2.result === "win";
      }
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={dummyImage}
            alt="playerImage"
            className="w-[30px] h-[30px]  rounded-full"
          />
          <p className="text-matchTextColor font-semibold">{item?.player2}</p>
          {isWinner && (
            <span className="inline-flex flex-1 max-w-fit font-semibold items-center rounded-2xl  px-2 py-1 text-xs ring-2 ring-inset ">
              Winner
            </span>
          )}
        </div>
      );
    },
  },
];

export const MatchesListing = () => {
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const { fixture, isFetchingFixture } = useSelector((state) => state.fixture);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerData, setPlayerData] = useState([]);
  const [totalRounds, setTotalRounds] = useState(0);
  const [showScoreUpdateModal, setShowScoreUpdateModal] = useState(false);
  const [currentMatchClicked, setCurrentMatchClicked] = useState(null);

  const [bracketName, setBracketName] = useState(null);
  const [currentRoundData, setCurrentRoundData] = useState(null);

  const [updateFixture, setUpdateFixture] = useState(null);
  const [players, setPlayers] = useState({});

  const handleUpdateFixture = (value) => {
    setUpdateFixture(value);
  };

  const handleChangeRounds = (type) => {
    if (type === "back") {
      setCurrentRound((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setCurrentRound((prev) => (prev !== totalRounds ? prev + 1 : 1));
    }
  };

  const handleMatchUpdateButton = (data) => {
    setShowScoreUpdateModal(true);
    setCurrentMatchClicked(data);
  };

  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);

  useEffect(() => {
    if (updateFixture) {
      dispatch(getFixture({ tour_Id: tournamentId, eventId }));
    }
  }, [updateFixture]);

  useEffect(() => {
    if (currentRoundData && fixture?.format === "DE") {
      const group_id = currentRoundData[0].group_id;

      switch (group_id) {
        case 0: {
          setBracketName("Winner Bracket");
          break;
        }
        case 1: {
          setBracketName("Looser Bracket");
          break;
        }

        case 2: {
          setBracketName("Grand Finale");
          break;
        }
        default: {
          setBracketName("");
        }
      }
    }
  }, [currentRoundData, fixture]);

  useEffect(() => {
    if (fixture && currentRound) {
      const currentRoundId = fixture?.bracketData?.round.filter(
        (item) => item?.id?.toString() === (currentRound - 1)?.toString()
      );

      setCurrentRoundData(currentRoundId);

      const currentRoundMatches = currentRoundId.flatMap((round) => {
        const match = fixture.bracketData.match.filter(
          (match) => match?.round_id?.toString() === round?.id?.toString()
        );

        return [...match];
      });

      const playerData =
        currentRoundMatches.length > 0 &&
        currentRoundMatches.flatMap(
          ({
            opponent1,
            opponent2,
            number,
            metaData = {},
            id,
            group_id,
            round_id,
            stage_id,
          }) => {
            const participantsById = new Map(
              fixture?.bracketData?.participant.map((p) => [p.id, p])
            );

            const matchGames = fixture?.bracketData?.match_game.filter(
              (game) => game?.parent_id?.toString() === id?.toString()
            );

            const players = [opponent1?.id, opponent2?.id]
              .map((id) => participantsById.get(id))
              .filter(Boolean);

            return players.length
              ? [
                  {
                    match: number,
                    matchId: id,
                    group_id,
                    round_id,
                    stage_id,
                    parent_id: matchGames[0]?.parent_id,
                    opponent1,
                    opponent2,
                    player1_id: players[0]?.id,
                    player2_id: players[1]?.id,
                    player1: players[0]?.name || "Unknown",
                    player2: players[1]?.name || "Unknown",
                    location: metaData.location || {},
                    date: metaData.date || "",
                    time: metaData.time || "",
                    court: metaData.court || "",
                    matchGames,
                  },
                ]
              : [];
          }
        );

      setPlayerData(playerData);

      setPlayers(() => {
        const currentMatchId = currentMatchClicked?.matchId;

        const currentPlayers = playerData?.find(
          (player) => String(player?.matchId) === String(currentMatchId)
        );

        return currentPlayers;
      });

      setTotalRounds(fixture?.bracketData?.round.length);
      setUpdateFixture(null);
    }
  }, [fixture, currentRound, updateFixture, currentMatchClicked]);

  if (isFetchingFixture && !showScoreUpdateModal) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {!fixture && <NoMatchExist />}
      {fixture && (
        <>
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
              <span className="inline-flex justify-center font-semibold flex-1 w-full items-center rounded-2xl  px-2 py-1 text-xs  ring-1 ring-inset">
                {bracketName}
              </span>
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
            oddRowColor="blue-200"
            onClick={handleMatchUpdateButton}
          />

          <ScoreUpdateModal
            isOpen={showScoreUpdateModal}
            onCancel={setShowScoreUpdateModal}
            players={players}
            fixtureId={fixture?._id}
            tournamentId={tournamentId}
            eventId={eventId}
            currentMatchId={currentMatchClicked?.matchId}
            handleUpdateFixture={handleUpdateFixture}
          />
        </>
      )}
    </div>
  );
};

const NoMatchExist = () => {
  return (
    <EmptyBanner message="No Matches has been found for this category. Please create the fixture to get started." />
  );
};
