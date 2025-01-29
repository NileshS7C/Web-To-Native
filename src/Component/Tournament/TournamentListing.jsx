import { useDispatch, useSelector } from "react-redux";
import {
  TournamentTableHeaders,
  tournamentListingTabs as initialTour_Tabs,
  tournamentStatusFilters,
} from "../../Constant/tournament";
import Tabs from "../Common/Tabs";
import { useEffect } from "react";
import { getAllTournaments } from "../../redux/tournament/tournamentActions";
import Spinner from "../Common/Spinner";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { CreateTournamentTable } from "./tournamentTable";
import { searchIcon } from "../../Assests";
import FilterGroup from "../Common/FilterGroup";
import { onTour_FilterChange } from "../../redux/tournament/getTournament";
import { formattedDate } from "../../utils/dateUtils";




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
  const { tournaments, totalTournaments, isGettingTournament, selectedFilter } =
    useSelector((state) => state.GET_TOUR);
  const selectedTab = searchParams.get("tab");
  const currentPage = searchParams.get("page");

  useEffect(() => {
    switch (selectedTab) {
      case "all":
        dispatch(getAllTournaments({ page: currentPage || 1, limit: 10 }));
        break;
      case "draft":
        dispatch(
          getAllTournaments({
            page: currentPage || 1,
            limit: 10,
            status: selectedTab?.toUpperCase(),
          })
        );

        break;
      case "active":
        dispatch(
          getAllTournaments({
            page: currentPage || 1,
            limit: 10,
            "dateRange[startDate]": formattedDate(new Date()),
            timeline: "ACTIVE",
          })
        );
        break;

      case "upcoming":
        if (selectedFilter && selectedFilter !== "all") {
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              "dateRange[endDate]": formattedDate(new Date()),
              status: selectedFilter?.toUpperCase(),
              timeline: "UPCOMING",
            })
          );
        } else {
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              "dateRange[endDate]": formattedDate(new Date()),
              timeline: "UPCOMING",
            })
          );
        }
        break;

      case "archive":
        dispatch(
          getAllTournaments({
            page: currentPage || 1,
            limit: 10,
            "dateRange[endDate]": formattedDate(new Date()),
            timeline: "COMPLETED",
          })
        );
        break;

      default:
        dispatch(getAllTournaments({ page: currentPage || 1, limit: 10 }));
    }
  }, [selectedTab, currentPage, selectedFilter]);

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

      <div className="flex flex-col gap-2.5 justify-end items-end">
        <div className="flex justify-end">
          <SearchEvents />
        </div>
        {selectedTab && selectedTab === "upcoming" && (
          <FilterGroup
            title="Filter by approved status:"
            options={tournamentStatusFilters}
            selectedValue={selectedFilter}
            defaultValue="all"
            onChange={(value) => dispatch(onTour_FilterChange(value))}
          />
        )}
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
