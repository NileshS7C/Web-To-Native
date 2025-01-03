import AlertBanner from "../Common/AlertBanner";
import FilterGroup from "../Common/FilterGroup";
import { getAllVenues } from "../../redux/Venue/venueActions";
import {
  checkVenue,
  onPageChange,
  onFilterChange,
} from "../../redux/Venue/getVenues";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { tableHeaders, venueFilters } from "../../Constant/venue";
import Button from "../Common/Button";
import { showForm } from "../../redux/Venue/addVenue";
import DataTable from "../Common/DataTable";

export default function VenueListing() {
  const dispatch = useDispatch();
  const { venues, totalVenues, currentPage, venueWithNoCourt, selectedFilter } =
    useSelector((state) => state.getVenues);
  useEffect(() => {
    dispatch(getAllVenues(currentPage));
    const isVenueWithNoCourt = venues.some(
      (venue) => venue.courts.length === 0
    );
    dispatch(checkVenue(isVenueWithNoCourt));
  }, [currentPage]);

  return (
    <div className="grid grid-cols-1 gap-[40px] rounded-[3xl]">
      <div className="flex justify-between">
        <FilterGroup
          title="Filter By Approval Status :"
          options={venueFilters}
          selectedValue={selectedFilter}
          onChange={(value) => dispatch(onFilterChange(value))}
          defaultValue="published"
        />
        <Button
          type="button"
          className="block rounded-md  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => dispatch(showForm())}
        >
          Add New Venue
        </Button>
      </div>
      {venueWithNoCourt && (
        <AlertBanner description="You Will Need to Add Courts " />
      )}

      <DataTable
        columns={tableHeaders}
        data={venues}
        currentPage={currentPage}
        totalPages={totalVenues}
        onPageChange={onPageChange}
      />
    </div>
  );
}
