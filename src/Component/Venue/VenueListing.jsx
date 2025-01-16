import AlertBanner from "../Common/AlertBanner";
import FilterGroup from "../Common/FilterGroup";
import { getAllVenues, deleteVenue } from "../../redux/Venue/venueActions";
import {
  checkVenue,
  onPageChange,
  onFilterChange,
} from "../../redux/Venue/getVenues";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { tableHeaders, venueFilters } from "../../Constant/venue";
import Button from "../Common/Button";
import DataTable from "../Common/DataTable";
import { ConfirmationModal } from "../Common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { onCancel, onCofirm } from "../../redux/Confirmation/confirmationSlice";
import { SuccessModal } from "../Common/SuccessModal";
import { showSuccess } from "../../redux/Success/successSlice";
import { ErrorModal } from "../Common/ErrorModal";
import { showError } from "../../redux/Error/errorSlice";
import Spinner from "../Common/Spinner";
import NotCreated from "../Common/NotCreated";

export default function VenueListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isOpen, message, onClose } = useSelector((state) => state.confirm);
  const { isDeleting, isDeleted, isError, errorMessage } = useSelector(
    (state) => state.deleteVenue
  );
  const {
    venues,
    totalVenues,
    currentPage,
    venueWithNoCourt,
    selectedFilter,
    isLoading,
  } = useSelector((state) => state.getVenues);

  const { isConfirmed, type, confirmationId } = useSelector(
    (state) => state.confirm
  );
  useEffect(() => {
    if (isConfirmed && type === "Venue" && confirmationId) {
      dispatch(deleteVenue(confirmationId));
    }
  }, [isConfirmed, type, confirmationId]);

  useEffect(() => {
    dispatch(getAllVenues({ currentPage, selectedFilter }));
  }, [currentPage, selectedFilter, isDeleted]);

  useEffect(() => {
    if (venues?.length > 0) {
      const isVenueWithNoCourt = venues.some(
        (venue) => venue.courts.length === 0
      );
      dispatch(checkVenue(isVenueWithNoCourt));
    }
  }, [venues]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(
        showSuccess({
          message: "Venue deleted successfully",
          onClose: "hideSuccess",
        })
      );
    }

    if (isError) {
      dispatch(
        showError({
          message: errorMessage || "Something went wrong!",
          onClose: "hideError",
        })
      );
      dispatch(onCancel());
    }
  }, [isDeleted, isError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (venues.length === 0) {
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
        <FilterGroup
          title="Filter By Approval Status :"
          options={venueFilters}
          selectedValue={selectedFilter}
          onChange={(value) => dispatch(onFilterChange(value))}
          defaultValue="draft"
        />
        <Button
          type="button"
          className="block rounded-md  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate("/venues/new")}
        >
          Add New Venue
        </Button>
      </div>
      {venueWithNoCourt && venues?.length > 0 && (
        <AlertBanner description="You Will Need to Add Courts " />
      )}
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
        currentPage={currentPage}
        totalPages={totalVenues}
        onPageChange={onPageChange}
      />
    </div>
  );
}
