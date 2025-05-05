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
import {dummmyProfileIcon} from "../../Assests";

const MatchListingHeaders = [
  {
    key: "participant1",
    header: "Opponent 1",
    render: (item) => {
      // const { opponent1 = "" } = item;
      const { opponent1 = "", profilePics1 = [] } = item;
      let isWinner;
      if (opponent1) {
        isWinner = opponent1.result === "win";
      }

      const profilePic = profilePics1.length > 0 ? profilePics1[0].profilePic : dummmyProfileIcon;
      
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
      // const { opponent2 = "" } = item;
      const { opponent2 = "", profilePics2 = [] } = item;
      let isWinner;
      if (opponent2) {
        isWinner = opponent2.result === "win";
      }
      const profilePic = profilePics2.length > 0 ? profilePics2[0].profilePic : dummmyProfileIcon; 
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

  // Access the first fixture from the array
  const currentFixture = fixture?.fixtures?.[0];

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
    // Use currentFixture here
    if (currentRoundData && currentFixture?.format === "DE") {
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
    // Add currentFixture to dependency array
  }, [currentRoundData, currentFixture]);

  useEffect(() => {
    // Use currentFixture here
    if (currentFixture && currentRound) {
      const currentRoundId = currentFixture?.bracketData?.round.filter(
        (item) => item?.id?.toString() === (currentRound - 1)?.toString()
      );

      setCurrentRoundData(currentRoundId);

      const currentRoundMatches = currentRoundId.flatMap((round) => {
        // Use currentFixture here
        const match = currentFixture.bracketData.match.filter(
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
            // Use currentFixture here
            const participantsById = new Map(
              currentFixture?.bracketData?.participant.map((p) => [p.id, p])
            );

            const profilePics1 =
            opponent1?.id != null
              ? participantsById.get(opponent1?.id)?.players.map((player) => ({
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

            // Use currentFixture here
            const matchGames = currentFixture?.bracketData?.match_game.filter(
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
                    profilePics1,
                    profilePics2,
                  },
                ]
              : [];
          }
        );

      setPlayerData(playerData);
      // Use currentFixture here
      setTotalRounds(currentFixture?.bracketData?.round?.length || 0);
    }
    // Add currentFixture to dependency array
  }, [currentFixture, currentRound]);

  if (isFetchingFixture) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  // Use currentFixture here
  if (!currentFixture) {
    return (
      <EmptyBanner message="No fixture data available for this event yet." />
    );
  }

  return (
    <div className="flex flex-col gap-5">
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
            onCancel={() => setShowScoreUpdateModal(false)}
            players={currentMatchClicked}
            // Pass the correct fixtureId from currentFixture
            fixtureId={currentFixture?._id}
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
