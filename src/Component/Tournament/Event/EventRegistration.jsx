import { useSelector, useDispatch } from "react-redux";
import ErrorBanner from "../../Common/ErrorBanner";
import Spinner from "../../Common/Spinner";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllBookings } from "../../../redux/tournament/tournamentActions";
import { bookingLimit } from "../../../Constant/tournament";
import EmptyBanner from "../../Common/EmptyStateBanner";
import DataTable from "../../Common/DataTable";
import { bookingTableHeaders, data } from "../../../Constant/booking";
import {
  onPageChangeEvent,
  toggleBookingModal,
} from "../../../redux/tournament/eventSlice";
import { Button } from "@headlessui/react";
import AddParticipants from "./AddParticipantPage";
function EventRegistrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const dispatch = useDispatch();
  const { tournamentId, eventId } = useParams();
  const { bookings, bookingError, isGettingBookings } = useSelector(
    (state) => state.GET_TOUR
  );

  useEffect(() => {
    if (tournamentId && eventId) {
      dispatch(
        getAllBookings({
          currentPage: currentPage || 1,
          limit: bookingLimit,
          tour_Id: tournamentId,
          eventId,
        })
      );
    }
  }, []);

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

  // if (bookings.length) {
  //   return (
  //     <EmptyBanner message="There are currently no bookings for this event." />
  //   );
  // }
  return (
    <div className="flex flex-col gap-5 bg-[#FFFFFF] justify-center p-5 rounded-lg">
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="w-[148px] h-[40px] rounded-[10px] shadow-md text-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
          onClick={() => {
            dispatch(toggleBookingModal());
          }}
        >
          Add Participant
        </Button>

        <AddParticipants />
      </div>

      <DataTable
        columns={bookingTableHeaders}
        data={data}
        totalPages="20"
        currentPage={1}
        onPageChange={onPageChangeEvent}
        className="border-[1px] rounded-md"
      />
    </div>
  );
}

export default EventRegistrations;
