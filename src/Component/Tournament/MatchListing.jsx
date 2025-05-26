import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getFixture, getMatches } from "../../redux/tournament/fixturesActions";

import Button from "../Common/Button";
import Spinner from "../Common/Spinner";
import DataTable from "../Common/DataTable";
import EmptyBanner from "../Common/EmptyStateBanner";
import { backIcon, dummyImage, forwardIcon } from "../../Assests";
import { ScoreUpdateModal } from "../Common/ScoreUpdateModal";
import { dummmyProfileIcon } from "../../Assests";
import { useGetDEFinal } from "../../Hooks/useCatgeory";

const MatchListingHeaders = [
  {
    key: "participant1",
    header: "Opponent 1",
    render: (item) => {
      const { opponent1 = null, profilePics1 = [] } = item;
      let isWinner = false;
      if (opponent1 && opponent1.forfeit) {
        isWinner = false;
      } else if (opponent1 && opponent1.result === "win") {
        isWinner = true;
      }

      const profilePic =
        profilePics1.length > 0
          ? profilePics1[0].profilePic
          : dummmyProfileIcon;

      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={profilePic}
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
            Match <span>{index + 1}</span>
          </p>
          <span className="text-matchTextColor font-semibold">
            {`Date : ${item?.date ? item?.date : "TBD"}`}
          </span>
          {item?.time?.startTime && (
            <span className="text-matchTextColor font-semibold">
              {`Time : ${item?.time.startTime}`}
            </span>
          )}
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
      const { opponent2 = null, profilePics2 = [] } = item;
      let isWinner = false;
      if (opponent2 && opponent2.forfeit) {
        isWinner = false;
      } else if (opponent2 && opponent2.result === "win") {
        isWinner = true;
      }
      const profilePic =
        profilePics2.length > 0
          ? profilePics2[0].profilePic
          : dummmyProfileIcon;
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={profilePic}
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
  const {
    fixture,
    isFetchingFixture,
    isFixtureSuccess,
    matches,
    isFetchingMatches,
    isMatchesSuccess,
  } = useSelector((state) => state.fixture);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentGroup, setCurrentGroup] = useState(1);
  const [playerData, setPlayerData] = useState([]);
  const [totalRounds, setTotalRounds] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showScoreUpdateModal, setShowScoreUpdateModal] = useState(false);
  const [currentMatchClicked, setCurrentMatchClicked] = useState(null);

  const [bracketName, setBracketName] = useState(null);
  const [currentRoundData, setCurrentRoundData] = useState(null);
  const [currentGroupData, setCurrentGroupData] = useState(null);
  const [updateFixture, setUpdateFixture] = useState(null);
  const [players, setPlayers] = useState({});

  const { data: deEliminationFinal, refetch: fetchDEFinal } = useGetDEFinal(
    {
      tournamentId,
      categoryId: eventId,
      fixtureId: fixture?._id.toString()
    },
    {
      enabled: false,
    }
  );
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
  const handleChangeGroups = (type) => {
    if (type === "back") {
      setCurrentGroup((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setCurrentGroup((prev) => (prev !== totalGroups ? prev + 1 : 1));
    }
  };
  const handleMatchUpdateButton = (data) => {
    setShowScoreUpdateModal(true);
    setCurrentMatchClicked(data);
  };

  useEffect(() => {
    if (fixture?.format === "DE" && isFixtureSuccess) {
      fetchDEFinal();
    }
  }, [isFixtureSuccess]);

  useEffect(() => {
    if (
      matches?.format === "DE" &&
      deEliminationFinal &&
      matches &&
      !deEliminationFinal.showBothMatches
    ) {
      setTotalRounds(matches?.bracketData?.round.length - 1);
    } else if (matches?.format !== "RR") {
      setTotalRounds(matches?.bracketData?.round.length);
    } else if (matches) {
      setTotalGroups(fixture?.bracketData?.group?.length);
    }
  }, [deEliminationFinal, matches]);
  useEffect(() => {
    if (updateFixture) {
      dispatch(
        getMatches({
          tour_Id: tournamentId,
          eventId,
          fixtureId: fixture._id.toString(),
        })
      );
    }
  }, [updateFixture]);

  useEffect(() => {
    // Use fixture here
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
    // Add fixture to dependency array
  }, [currentRoundData, matches]);

  useEffect(() => {
    // Use fixture here
    if (matches && currentRound) {
      const currentRoundId = matches?.bracketData?.round.filter(
        (item) => item?.id?.toString() === (currentRound - 1)?.toString()
      );

      setCurrentRoundData(currentRoundId);

      const currentRoundMatches = currentRoundId.flatMap((round) => {
        // Use fixture here
        const match =matches.bracketData.match.filter(
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
            // Use fixture here
            const participantsById = new Map(
              matches?.bracketData?.participant.map((p) => [p.id, p])
            );

            const profilePics1 =
              opponent1?.id != null
                ? participantsById
                    .get(opponent1?.id)
                    ?.players.map((player) => ({
                      name: player.name,
                      profilePic: player.profilePic || dummmyProfileIcon,
                    })) || []
                : [];

            const profilePics2 =
              opponent2?.id != null
                ? participantsById.get(opponent2.id)?.players.map((player) => ({
                    name: player.name,
                    profilePic: player.profilePic || dummmyProfileIcon,
                  })) || []
                : [];

            // Use fixture here
            const matchGames = matches?.bracketData?.match_game.filter(
              (game) => game?.parent_id?.toString() === id?.toString()
            );

            const players = [opponent1?.id, opponent2?.id].map((id) =>
              participantsById.get(id)
            );

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
                    date: metaData?.date || "",
                    time: metaData?.time || "",
                    matchGames,
                    profilePics1,
                    profilePics2,
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
      setUpdateFixture(null);
    } else if (matches && currentGroup && matches?.format === "RR") {
      const currentGroupId = matches?.bracketData?.group.filter(
        (item) => item?.id?.toString() === (currentGroup - 1)?.toString()
      );

      setCurrentGroupData(currentGroupId);

      const currentGroupMatches = currentGroupId.flatMap((group) => {
        // Use fixture here
        const match = matches.bracketData.match.filter(
          (match) => match?.group_id?.toString() === group?.id?.toString()
        );

        return [...match];
      });
      const playerData =
        currentGroupMatches.length > 0
          ? currentGroupMatches.flatMap(
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
                // Use fixture here
                const participantsById = new Map(
                  matches?.bracketData?.participant.map((p) => [p.id, p])
                );

                const profilePics1 =
                  opponent1?.id != null
                    ? participantsById
                        .get(opponent1?.id)
                        ?.players.map((player) => ({
                          name: player.name,
                          profilePic: player.profilePic || dummmyProfileIcon,
                        })) || []
                    : [];

                const profilePics2 =
                  opponent2?.id != null
                    ? participantsById
                        .get(opponent2.id)
                        ?.players.map((player) => ({
                          name: player.name,
                          profilePic: player.profilePic || dummmyProfileIcon,
                        })) || []
                    : [];

                // Use fixture here
                const matchGames = matches?.bracketData?.match_game.filter(
                  (game) => game?.parent_id?.toString() === id?.toString()
                );

                const players = [opponent1?.id, opponent2?.id].map((id) =>
                  participantsById.get(id)
                );

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
                        date: metaData?.date || "",
                        time: metaData?.time || "",
                        matchGames,
                        profilePics1,
                        profilePics2,
                      },
                    ]
                  : [];
              }
            )
          : [];
      setPlayerData(playerData);

      setPlayers(() => {
        const currentMatchId = currentMatchClicked?.matchId;
        const currentPlayers = playerData?.find(
          (player) => String(player?.matchId) === String(currentMatchId)
        );

        return currentPlayers;
      });
      setUpdateFixture(null);
    }
  }, [matches, currentRound, currentGroup, updateFixture, currentMatchClicked]);
  useEffect(() => {
    dispatch(getFixture({ tour_Id: tournamentId, eventId }));
  }, []);
  useEffect(() => {
    if (fixture) {
      dispatch(
        getMatches({
          tour_Id: tournamentId,
          eventId,
          fixtureId: fixture?._id.toString(),
        })
      );
    }
  }, [fixture]);
  if ((isFetchingFixture || isFetchingMatches) && !showScoreUpdateModal) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  //Use fixture here
  if (!fixture || !matches) {
    return (
      <EmptyBanner message="No fixture data available for this event yet." />
    );
  }
  
  return (
    <div>
      {!matches && <NoMatchExist />}
      {matches && (
        <>
          {matches?.format === "RR" ? (
            <div className="flex items-center justify-center gap-4 basis-sm">
              <button
                onClick={() => handleChangeGroups("back")}
                className="disabled:bg-red disabled:cursor-not-allowed"
                disabled={currentGroup === 1}
              >
                <img
                  src={backIcon}
                  alt="back button for round"
                  className={`${currentGroup === 1 && "opacity-50"}`}
                />
              </button>

              <p className="text-matchTextColor font-bold text-sm sm:text-md:text-xl lg:text-2xl">
                <span>
                  {currentGroupData?.[0]?.groupName || `Group ${currentGroup}`}
                </span>
              </p>

              <button
                onClick={() => handleChangeGroups("forward")}
                className="disabled:bg-red disabled:cursor-not-allowed"
                disabled={currentGroup === totalGroups}
              >
                <img
                  src={forwardIcon}
                  alt="forward button for round"
                  className={`${currentGroup === totalGroups && "opacity-50"}`}
                />
              </button>
            </div>
          ) : (
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
                <span>
                  {currentRoundData?.[0]?.roundName || `Round ${currentRound}`}
                </span>
                {matches?.format === "DE" && (
                  <span className="inline-flex justify-center font-semibold flex-1 w-full items-center rounded-2xl  px-2 py-1 text-xs  ring-1 ring-inset">
                    {bracketName}
                  </span>
                )}
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
          )}

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

          {showScoreUpdateModal && (
            <ScoreUpdateModal
              isOpen={showScoreUpdateModal}
              onCancel={setShowScoreUpdateModal}
              players={players}
              fixtureId={fixture?._id}
              tournamentId={tournamentId}
              eventId={eventId}
              currentMatchId={currentMatchClicked?.matchId}
              handleUpdateFixture={handleUpdateFixture}
              format="Non-Hybrid"
            />
          )}
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
