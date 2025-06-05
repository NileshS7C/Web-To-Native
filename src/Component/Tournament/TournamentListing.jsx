import { useDispatch, useSelector } from "react-redux";
import {
  TournamentTableHeaders,
  tournamentListingTabs as initialTour_Tabs,
  tournamentStatusFilters,
} from "../../Constant/tournament";

import Tabs from "../Common/Tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllTournaments,
  searchTournament,
} from "../../redux/tournament/tournamentActions";
import Spinner from "../Common/Spinner";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { CreateTournamentTable } from "./tournamentTable";
import { searchIcon } from "../../Assests";
import FilterGroup from "../Common/FilterGroup";
import {
  onTour_FilterChange,
  resetEditMode,
} from "../../redux/tournament/getTournament";
import { formattedDate } from "../../utils/dateUtils";
import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";
import useDebounce from "../../Hooks/useDebounce";

const SearchEvents = ({
  dispatch,
  page,
  limit,
  searchInput,
  setSearchInput,
  singleTournamentOwner,
  selectedTab,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const inputRef = useRef(null);
  const handleInputChange = (e) => {
    setSearchValue(e?.target?.value);
    setSearchInput(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      switch (selectedTab) {
        case "all":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              ownerId: singleTournamentOwner?.id,
            })
          );
          break;
        case "draft":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              status: selectedTab?.toUpperCase(),
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );

          break;
        case "active":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              "dateRange[startDate]": formattedDate(new Date()),
              timeline: "ACTIVE",
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );
          break;

        case "upcoming":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              "dateRange[endDate]": formattedDate(new Date()),
              status: selectedFilter?.toUpperCase(),
              timeline: "UPCOMING",
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );

        case "archive":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              status: "ARCHIVED",
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );
          break;
        case "completed":
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              status: "COMPLETED",
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );
        default:
          dispatch(
            searchTournament({
              page: page || 1,
              limit: limit,
              ownerId: singleTournamentOwner?.id,
              search: debouncedValue,
            })
          );  
      }
    }
  }, [debouncedValue, page]);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search Tournament"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        ref={inputRef}
        placeholder="Search Tournaments"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleInputChange}
        value={searchInput}
      />
    </div>
  );
};

function TournamentListing(props) {
  const {
    dispatch,
    currentPage,
    singleTournamentOwner,
    searchInput,
    selectedTab,
    setSearchInput,
  } = props;

  const { tournaments, totalTournaments, isGettingTournament, selectedFilter } =
    useSelector((state) => state.GET_TOUR);

  useEffect(() => {
    if (!searchInput) {
      dispatch(
        getAllTournaments({
          page: currentPage || 1,
          limit: 10,
          ownerId: singleTournamentOwner?.id,
        })
      );
    }
  }, [searchInput, currentPage, singleTournamentOwner?.id]);

  useEffect(() => {
    if (selectedFilter || selectedTab) {
      setSearchInput("");
    }
  }, [selectedFilter, selectedTab]);
  useEffect(() => {
    if (singleTournamentOwner && !searchInput && selectedTab) {
      switch (selectedTab) {
        case "all":
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              ownerId: singleTournamentOwner?.id,
            })
          );
          break;
        case "draft":
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              status: selectedTab?.toUpperCase(),
              ownerId: singleTournamentOwner?.id,
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
              ownerId: singleTournamentOwner?.id,
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
                ownerId: singleTournamentOwner?.id,
              })
            );
          } else {
            dispatch(
              getAllTournaments({
                page: currentPage || 1,
                limit: 10,
                "dateRange[endDate]": formattedDate(new Date()),
                timeline: "UPCOMING",
                ownerId: singleTournamentOwner?.id,
              })
            );
          }
          break;

        case "archive":
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              status: "ARCHIVED",
              ownerId: singleTournamentOwner?.id,
            })
          );
          break;
        case "completed":
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              status: "COMPLETED",
              ownerId: singleTournamentOwner?.id,
            })
          );
          break;
        default:
          dispatch(
            getAllTournaments({
              page: currentPage || 1,
              limit: 10,
              ownerId: singleTournamentOwner?.id,
            })
          );
      }
    } else if (singleTournamentOwner && !searchInput && !selectedTab) {
      dispatch(
        getAllTournaments({
          page: currentPage || 1,
          limit: 10,
          ownerId: singleTournamentOwner?.id,
        })
      );
    }
  }, [
    selectedTab,
    currentPage,
    selectedFilter,
    singleTournamentOwner,
    searchInput,
  ]);

  if (isGettingTournament) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="bg-[#FFFFFF] p-[10px] rounded-md text-[#232323] mb-4">
        <Tabs options={initialTour_Tabs} hasLink={true} />
      </div>

      <div className="flex flex-col gap-2.5 justify-end items-end">
        {selectedTab && selectedTab === "upcoming" && (
          <FilterGroup
            title="Filter by status:"
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
        currentPage={currentPage || 1}
        totalPages={totalTournaments}
      />
    </div>
  );
}

function TournamentListingWrapper() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const selectedTab = searchParams.get("tab");
  const { singleTournamentOwner = {} } = useOwnerDetailsContext();
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full md:w-[40%]">
        <SearchEvents
          dispatch={dispatch}
          page={currentPage || 1}
          limit={10}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          singleTournamentOwner={singleTournamentOwner}
          selectedTab={selectedTab}
        />
      </div>

      <TournamentListing
        dispatch={dispatch}
        currentPage={currentPage}
        singleTournamentOwner={singleTournamentOwner}
        searchInput={searchInput}
        selectedTab={selectedTab}
        setSearchInput={setSearchInput}
      />
    </div>
  );
}

TournamentListing.propTypes = {
  dispatch: PropTypes.func,
  searchInput: PropTypes.string,
  currentPage: PropTypes.string || PropTypes.number,
  singleTournamentOwner: PropTypes.object,
  selectedTab: PropTypes.string,
  setSearchInput: PropTypes.func,
};

SearchEvents.propTypes = {
  dispatch: PropTypes.func,
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func,
  page: PropTypes.string || PropTypes.number,
  limit: PropTypes.number,

  singleTournamentOwner: PropTypes.object,
};

CreateTournamentTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
};

export default TournamentListingWrapper;
