import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import {
  resetActionType,
  setAction,
} from "../../redux/tournament/bookingSlice";

import {
  cancelAndRefundBooking,
  getAllBookings,
} from "../../redux/tournament/tournamentActions";
import { showError } from "../../redux/Error/errorSlice";
import { showSuccess } from "../../redux/Success/successSlice";

import { bookingLimit } from "../../Constant/tournament";
import { ActionButtonBooking } from "../../Constant/booking";
import Button from "./Button";
import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";
import { parseDate } from "../../utils/dateUtils";

const cancelBooking = async (
  dispatch,
  data,
  type,
  bookingId,
  currentPage,
  tournamentId,
  eventId,
  ownerId
) => {
  try {
    const result = await dispatch(
      cancelAndRefundBooking({ data, type, bookingId, ownerId })
    ).unwrap();

    if (!result.responseCode) {
      dispatch(
        showSuccess({
          message: "Booking Canceled Successfully.",
          onClose: "hideSuccess",
        })
      );

      dispatch(
        getAllBookings({
          currentPage: currentPage || 1,
          limit: bookingLimit,
          tour_Id: tournamentId,
          eventId,
        })
      );
    }
  } catch (err) {
    console.log("err in canceling the booking", err);

    dispatch(
      showError({
        message:
          err?.data?.message ||
          "OOPS!, something went wrong while canceling the booking. Please try again later.",
        onClose: "hideError",
      })
    );
  } finally {
    dispatch(resetConfirmationState());
    dispatch(resetActionType());
  }
};

const processRefund = async (
  dispatch,
  data,
  type,
  bookingId,
  currentPage,
  tournamentId,
  eventId,
  ownerId
) => {
  try {
    const result = await dispatch(
      cancelAndRefundBooking({ data, type, bookingId, ownerId })
    ).unwrap();

    if (!result.responseCode) {
      dispatch(
        showSuccess({
          message: "Refund processed Successfully.",
          onClose: "hideSuccess",
        })
      );

      dispatch(
        getAllBookings({
          currentPage: currentPage || 1,
          limit: bookingLimit,
          tour_Id: tournamentId,
          eventId,
        })
      );
    }
  } catch (err) {
    console.log("err in processing the refund of the booking", err);

    dispatch(
      showError({
        message:
          err?.data?.message ||
          "OOPS!, something went wrong while processing the refund of the booking. Please try again later.",
        onClose: "hideError",
      })
    );
  } finally {
    dispatch(resetConfirmationState());
    dispatch(resetActionType());
  }
};

const BookingActions = ({ id, index, status }) => {
  const dispatch = useDispatch();
  const { eventId, tournamentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const [actionType, setActionType] = useState(null);
  const [actionObject, setActionObject] = useState({
    type: "",
    bookingId: "",
  });
  const [actionPending, setActionPending] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const { rejectionComments } = useSelector((state) => state.Tournament);
  const { isConfirmed } = useSelector((state) => state.confirm);
  const { tournament } = useSelector((state) => state.GET_TOUR);

  // useEffect(() => {
  //   if (tournament) {
  //     const parsedTournamentEndDate =
  //       tournament?.endDate && parseDate(tournament?.endDate);

  //     const endDate = new Date(parsedTournamentEndDate).setHours(0, 0, 0, 0);

  //     const today = new Date().setHours(0, 0, 0, 0);

  //     const isDisable = endDate > today;
  //     setIsDisable(isDisable);
  //   }
  // }, []);

  const cancelBookingData = {
    categoryId: "",
    cancelReason: "",
  };

  const refundBookingData = {
    categoryId: "",
  };

  const { singleTournamentOwner = {} } = useOwnerDetailsContext();

  useEffect(() => {
    if (actionType && actionType === "cancel") {
      if (isConfirmed && actionObject?.bookingId) {
        const updatedData = {
          ...cancelBookingData,
          categoryId: eventId,
          cancelReason: rejectionComments,
        };
        cancelBooking(
          dispatch,
          updatedData,
          actionType,
          actionObject?.bookingId,
          currentPage,
          tournamentId,
          eventId,
          tournament?.ownerUserId || singleTournamentOwner?.id
        );

        setActionObject({
          type: "",
          bookingId: "",
        });
      }
    } else if (actionType && actionType === "refund") {
      if (isConfirmed && actionObject?.bookingId) {
        const updatedData = {
          ...refundBookingData,
          categoryId: eventId,
        };
        processRefund(
          dispatch,
          updatedData,
          actionType,
          actionObject?.bookingId,
          currentPage,
          tournamentId,
          eventId,
          tournament?.ownerUserId || singleTournamentOwner?.id
        );

        setActionObject({
          type: "",
          bookingId: "",
        });
      }
    }
  }, [actionType, isConfirmed, actionObject]);

  const handleDisable = (item) => {
    if (isDisable) {
      return true;
    }
    if (status === "REFUNDED") {
      return true;
    }
    if (item.action === "refund" && status !== "CANCELLED") {
      return true;
    } else if (item.action === "cancel" && status === "CANCELLED") {
      return true;
    }
    return false;
  };

  return (
    <div className="flex justify-end gap-2.5">
      {ActionButtonBooking.map((item) => {
        const buttonColor =
          item?.action === "cancel"
            ? "bg-red-500 hover:bg-red-300 text-white"
            : "bg-gray-200 hover:bg-gray-400 text-black";
        let itemName;
        if (item?.action === "cancel" && status === "CANCELLED") {
          itemName = "Cancelled";
        } else if (item?.action === "refund" && status === "REFUNDED") {
          itemName = "Refunded";
        } else {
          itemName = item?.name;
        }
        return (
          <Button
            className={`text-sm px-[20px] py-2 rounded-md  ${buttonColor} `}
            type="button"
            key={item?.name}
            onClick={() => {
              setActionType(item?.action);
              setActionObject((prev) => ({
                ...prev,
                type: item?.action,
                bookingId: id,
              }));

              dispatch(setAction(item.action));

              dispatch(
                showConfirmation({
                  message:
                    item.action === "cancel"
                      ? "Do you want to cancel the booking?"
                      : "Do you want to initiate the refund?",
                  type: "booking",
                })
              );
            }}
            loading={actionPending && item.action === actionObject.type}
            disabled={handleDisable(item)}
          >
            {itemName}
          </Button>
        );
      })}
    </div>
  );
};

BookingActions.propTypes = {
  id: PropTypes.object,
};

export default BookingActions;
