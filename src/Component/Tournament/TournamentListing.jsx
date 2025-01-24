import { useDispatch, useSelector } from "react-redux";
import {
  TournamentTableHeaders,
  tournamentListingTabs as initialTour_Tabs,
} from "../../Constant/tournament";
import Tabs from "../Common/Tabs";
import { useEffect, useState } from "react";
import { getAllTournaments } from "../../redux/tournament/tournamentActions";
import Spinner from "../Common/Spinner";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { CreateTournamentTable } from "./tournamentTable";
import { searchIcon } from "../../Assests";

const SearchEvents = () => {
  return (
    <div className="relative ">
      <img
        src={searchIcon}
        alt="search Tournament"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Tournaments"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

function TournamentListing() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tournaments, totalTournaments, isGettingTournament } = useSelector(
    (state) => state.GET_TOUR
  );

  const selectedTab = searchParams.get("tab");
  const currentPage = searchParams.get("page");
  useEffect(() => {
    if (selectedTab === "all") {
      dispatch(getAllTournaments({ currentPage: currentPage || 1, limit: 10 }));
    } else {
      dispatch(
        getAllTournaments({
          currentPage: currentPage || 1,
          limit: 10,
          status: selectedTab?.toUpperCase(),
        })
      );
    }
  }, [selectedTab, currentPage]);

  if (isGettingTournament) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-[#FFFFFF] p-[10px] rounded-md text-[#232323] mb-4">
        <Tabs options={initialTour_Tabs} hasLink={true} />
      </div>
      <div className="flex justify-end">
        <SearchEvents />
      </div>

      <CreateTournamentTable
        columns={TournamentTableHeaders}
        data={tournaments}
        currentPage={currentPage}
        totalPages={totalTournaments}
      />
    </div>
  );
}

CreateTournamentTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
};

export default TournamentListing;
