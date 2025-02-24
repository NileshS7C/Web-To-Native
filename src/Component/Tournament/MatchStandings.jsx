import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStandings } from "../../redux/tournament/fixturesActions";

import EmptyBanner from "../Common/EmptyStateBanner";
import Spinner from "../Common/Spinner";
import ErrorBanner from "../Common/ErrorBanner";
import DataTable from "../Common/DataTable";

const standingHeaders = [
  {
    key: "serial number",
    header: "S.No.",
    render: (_, index, currentPage) => (currentPage - 1) * 10 + (index + 1),
  },
  {
    key: "playerId",
    header: "Player Id",
    render: (item) => {
      return <p>{item?.id}</p>;
    },
  },
  {
    key: "playerName",
    header: "Player Name",
    render: (item) => {
      return <p>{item?.name}</p>;
    },
  },
  {
    key: "playerRank",
    header: "Player Rank",
    render: (item) => {
      return <p>{item?.rank}</p>;
    },
  },
];

export const MatchStandings = ({ tournamentId, eventId }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [standings, setStandings] = useState([]);
  const { fixture } = useSelector((state) => state.fixture);

  useEffect(() => {
    const getMatchStandings = async () => {
      try {
        setIsLoading(true);
        setSuccess(false);
        setError(false);
        setErrorMessage("");
        const result = await dispatch(
          getStandings({
            tour_Id: tournamentId,
            eventId,
            fixtureId: fixture?._id,
            stageId: fixture?.currentStage,
          })
        ).unwrap();
        if (!result.responseCode) {
          setStandings(result?.data.standings);
          setSuccess(true);
        }
      } catch (err) {
        console.log(" Error in getting the match Standings", err);
        setError(true);
        setErrorMessage(
          err?.data?.message ||
            "Oops!, something went wrong while getting the standings."
        );
      }
    };

    getMatchStandings();
  }, []);

  if (error) {
    return <ErrorBanner message={errorMessage} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (!standings?.length) {
    return <EmptyBanner message="Currently No standings has been found." />;
  }

  return (
    <div>
      <DataTable
        columns={standingHeaders}
        data={standings}
        currentPage={1}
        rowTextAlignment="middle"
        headerTextAlign="middle"
        alternateRowColors={true}
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
      />
    </div>
  );
};

MatchStandings.propTypes = {
  tournamentId: PropTypes.string,
  eventId: PropTypes.string,
};
