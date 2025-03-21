import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getAll_TO } from "../redux/tournament/tournamentActions";

import NotCreated from "../Component/Common/NotCreated";
import Spinner from "../Component/Common/Spinner";
import { TournamentOrganisersListing } from "../Component/Tournament/TournamentOrganiserListing";
import { rowsInOnePage } from "../Constant/app";

function TournamentOrganisersPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const { isGettingALLTO, err_IN_TO, tournamentOwners } = useSelector(
    (state) => state.Tournament
  );

  useEffect(() => {
    dispatch(
      getAll_TO({
        currentPage: currentPage || 1,
        limit: rowsInOnePage,
      })
    );
  }, [currentPage]);

  if (isGettingALLTO) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (!tournamentOwners?.owners?.length) {
    return (
      <NotCreated
        message="Currently No tournament organisers are present. Please create the tournament organisers to get started."
        buttonText="Add Tournament Organiser"
        type="organizers"
      />
    );
  }

  return (
    <TournamentOrganisersListing
      owners={tournamentOwners?.owners ?? []}
      error={err_IN_TO}
      total={tournamentOwners?.total || 0}
      currentPage={currentPage || 1}
    />
  );
}

export default TournamentOrganisersPage;
