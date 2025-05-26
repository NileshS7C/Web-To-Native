import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllBookings } from "../../../redux/tournament/tournamentActions";
import { getFixture } from "../../../redux/tournament/fixturesActions";
import {
  onPageChangeEvent,
  toggleBookingModal,
} from "../../../redux/tournament/eventSlice";
import {
  onCancel,
  onConfirm,
} from "../../../redux/Confirmation/confirmationSlice";
import ErrorBanner from "../../Common/ErrorBanner";
import Spinner from "../../Common/Spinner";
import { bookingLimit } from "../../../Constant/tournament";
import DataTable from "../../Common/DataTable";
import { bookingTableHeaders } from "../../../Constant/booking";
import { Button } from "@headlessui/react";
import AddParticipants from "./AddParticipantPage";
import { ConfirmationModal } from "../../Common/ConfirmationModal";
import PropTypes from "prop-types";


function EventRegistrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const dispatch = useDispatch();
  const location = useLocation();
  const { tournamentId, eventId } = useParams();

  const {
    bookings: bookingData,
    bookingError,
    isGettingBookings,
  } = useSelector((state) => state.GET_TOUR);
  const { actionType } = useSelector((state) => state.tourBookings);
  const { isOpen, message, onClose, isConfirmed } = useSelector(
    (state) => state.confirm
  );

  const { fixture } = useSelector((state) => state.fixture);

  const currentPath = location.pathname;

  useEffect(() => {
    if (tournamentId && eventId) {
      dispatch(
        getAllBookings({
          currentPage: currentPage || 1,
          limit: bookingLimit,
          tour_Id: tournamentId,
          eventId
        })
      );
    }
  }, [currentPage, tournamentId, eventId]);

  if (isGettingBookings) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (bookingError) {
    return (
      <ErrorBanner message="We're having trouble loading bookings information right now. Please try again later." />
    );
  }

  return (
    <div className="flex flex-col gap-5 md:bg-[#FFFFFF] justify-center p-5 rounded-lg">
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="w-[148px] h-[40px] rounded-[10px] shadow-md text-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
          onClick={() => {
            dispatch(toggleBookingModal());
          }}
          disabled={fixture?.status === "PUBLISHED"}
        >
          Add Participant
        </Button>

        <AddParticipants />
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onCancel={onCancel}
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={false}
        message={message}
        withComments={actionType === "cancel"}
      />

      <DataTable
        columns={bookingTableHeaders}
        data={bookingData?.bookings}
        totalPages={bookingData?.total}
        currentPage={currentPage}
        onPageChange={onPageChangeEvent}
        className="border-[1px] rounded-md"
        pathName={currentPath}
        headerTextAlign="middle"
        rowTextAlignment="middle"
      />
    </div>
  );
}

EventRegistrations.propTypes = {
  tournament: PropTypes.object,
};

export default EventRegistrations;
