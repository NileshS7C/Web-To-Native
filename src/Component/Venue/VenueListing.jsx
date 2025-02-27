import FilterGroup from "../Common/FilterGroup";
import { getAllVenues, deleteVenue } from "../../redux/Venue/venueActions";
import {
  checkVenue,
  onPageChange,
  onFilterChange,
} from "../../redux/Venue/getVenues";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { tableHeaders, venueFilters, venueLimit } from "../../Constant/venue";

import DataTable from "../Common/DataTable";
import { ConfirmationModal } from "../Common/ConfirmationModal";
import { useSearchParams } from "react-router-dom";
import { onCancel, onCofirm } from "../../redux/Confirmation/confirmationSlice";
import { SuccessModal } from "../Common/SuccessModal";
import { cleanUpSuccess, showSuccess } from "../../redux/Success/successSlice";
import { ErrorModal } from "../Common/ErrorModal";
import { showError } from "../../redux/Error/errorSlice";
import Spinner from "../Common/Spinner";
import NotCreated from "../Common/NotCreated";
import { searchIcon } from "../../Assests";
import PropTypes from "prop-types";
import useDebounce from "../../Hooks/useDebounce";
import { ImSpinner2 } from "react-icons/im";
import {
  resetDeleteState,
  resetErrorState,
} from "../../redux/Venue/deleteVenue";

const SearchVenue = ({
  dispatch,
  venueName,
  setVenueName,
  currentPage,
  selectedFilter,
  limit,
  isDeleted,
}) => {
  const [searchVenue, setSearchVenue] = useState("");
  const debouncedValue = useDebounce(searchVenue, 300);

  const handleSearchVenue = (e) => {
    setSearchVenue(e?.target?.value);
    setVenueName(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch(
        getAllVenues({
          currentPage,
          selectedFilter,
          limit,
          name: debouncedValue,
        })
      );
    }
  }, [debouncedValue, selectedFilter, currentPage, isDeleted]);

  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search Venue"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Search Venues"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={venueName}
        onChange={handleSearchVenue}
      />
    </div>
  );
};

export default function VenueListing() {
  const dispatch = useDispatch();
  const [venueName, setVenueName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const { isOpen, message, onClose } = useSelector((state) => state.confirm);
  const { isDeleting, isDeleted, isError, errorMessage } = useSelector(
    (state) => state.deleteVenue
  );
  const { venues, totalVenues, selectedFilter, isLoading, isSuccess } =
    useSelector((state) => state.getVenues);

  const { isConfirmed, type, confirmationId } = useSelector(
    (state) => state.confirm
  );

  useEffect(() => {
    if (isConfirmed && type === "Venue" && confirmationId) {
      console.log(" i am working inside this venue listing");
      dispatch(deleteVenue(confirmationId));
    }
  }, [isConfirmed, type, confirmationId]);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [selectedFilter]);

  useEffect(() => {
    if (!venueName) {
      dispatch(
        getAllVenues({ currentPage, selectedFilter, limit: venueLimit })
      );
    }
  }, [currentPage, selectedFilter, isDeleted, isSuccess, venueName]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(
        showSuccess({
          message: "Venue deleted successfully",
          onClose: "hideSuccess",
        })
      );

      dispatch(cleanUpSuccess());

      dispatch(resetDeleteState());
    }

    if (isError) {
      dispatch(
        showError({
          message: errorMessage || "Something went wrong!",
          onClose: "hideError",
        })
      );
      dispatch(onCancel());

      dispatch(resetErrorState());
    }
  }, [isDeleted, isError]);

  if (venues?.length === 0 && selectedFilter === "all" && !venueName) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <NotCreated
          message="You haven't created any Venue yet! Start by adding a new Venue."
          buttonText="Add Venue"
          type="venue"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[40px] rounded-[3xl]">
      <div className="flex justify-between">
        <div className="flex items-center justify-between w-[40%] gap-2.5">
          <SearchVenue
            dispatch={dispatch}
            venueName={venueName}
            setVenueName={setVenueName}
            currentPage={currentPage}
            selectedFilter={selectedFilter}
            limit={venueLimit}
            isDeleted={isDeleted}
          />
          {isLoading && (
            <ImSpinner2 className="animate-spin rotate-180 w-6 h-6" />
          )}
        </div>

        <FilterGroup
          title="Filter By Approval Status :"
          options={venueFilters}
          selectedValue={selectedFilter}
          onChange={(value) => dispatch(onFilterChange(value))}
          defaultValue="draft"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <ConfirmationModal
            isOpen={isOpen}
            onCancel={onCancel}
            onClose={onClose}
            onConfirm={onCofirm}
            isLoading={isDeleting}
            message={message}
          />

          <ErrorModal />

          <DataTable
            columns={tableHeaders}
            data={venues}
            currentPage={currentPage || 1}
            totalPages={totalVenues}
            onPageChange={onPageChange}
            pathName="/venues"
            evenRowColor="[#FFFFFF]"
            oddRowColor="blue-100"
            alternateRowColors="true"
            rowPaddingY="5"
          />
        </div>
      )}

    </div>
  );
}

SearchVenue.propTypes = {
  dispatch: PropTypes.func,
  venueName: PropTypes.string,
  setVenueName: PropTypes.func,
  currentPage: PropTypes.string,
  selectedFilter: PropTypes.string,
  limit: PropTypes.number,
  isDeleted: PropTypes.bool,
};
