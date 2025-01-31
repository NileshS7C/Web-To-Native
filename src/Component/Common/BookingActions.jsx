import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { ActionButtonBooking } from "../../Constant/booking";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import { cancelAndRefundBooking } from "../../redux/tournament/tournamentActions";
import { showError } from "../../redux/Error/errorSlice";
import Button from "./Button";

const cancelBooking = async (dispatch, data, type, bookingId) => {
  try {
    const result = await dispatch(
      cancelAndRefundBooking({ data, type, bookingId })
    ).unwrap();

    if (!result.responseCode) {
      dispatch(
        showSuccess({
          message: "Booking Canceled Successfully.",
          onClose: "hideSuccess",
        })
      );
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.log("err in canceling the booking", err);
    }

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
  }
};

const processRefund = async (dispatch, data, type, bookingId) => {
  try {
    const result = await dispatch(
      cancelAndRefundBooking({ data, type, bookingId })
    ).unwrap();

    if (!result.responseCode) {
      dispatch(
        showSuccess({
          message: "Refund processed Successfully.",
          onClose: "hideSuccess",
        })
      );
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.log("err in processing the refund of the booking", err);
    }

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
  }
};

const BookingActions = ({ id, index }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const [actionType, setActionType] = useState(null);
  const [actionObject, setActionObject] = useState({
    type: "",
    bookingId: "",
  });
  const [actionPending, setActionPending] = useState(false);
  const { rejectionComments } = useSelector((state) => state.Tournament);
  const { isConfirmed } = useSelector((state) => state.confirm);
  const { isBookingCreating } = useSelector((state) => state.tourBookings);

  const cancelBookingData = {
    categoryId: "",
    cancelReason: "",
  };

  const refundBookingData = {
    categoryId: "",
  };

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
          actionObject?.bookingId
        );

        setActionObject({
          type: "",
          bookingId: "",
        });
      }
    } else if (actionType && actionType === "refund") {
      if (actionObject?.bookingId) {
        const updatedData = {
          ...refundBookingData,
          categoryId: eventId,
        };
        processRefund(
          dispatch,
          updatedData,
          actionType,
          actionObject?.bookingId
        );

        setActionObject({
          type: "",
          bookingId: "",
        });
      }
    }
  }, [actionType, isConfirmed, actionObject]);

  return (
    <div className="flex justify-end gap-2.5">
      {ActionButtonBooking.map((item) => {
        const buttonColor =
          item?.action === "cancel"
            ? "bg-red-500 hover:bg-red-300"
            : "bg-orange-500 hover:bg-orange-400";
        return (
          <Button
            className={`text-white text-sm px-[20px] py-2 rounded-md  ${buttonColor} `}
            type="button"
            key={item?.name}
            onClick={() => {
              setActionType(item?.action);
              setActionObject((prev) => ({
                ...prev,
                type: item?.action,
                bookingId: id,
              }));
              if (item?.action === "cancel") {
                dispatch(
                  showConfirmation({
                    message: "Do you want to cancel the booking?",
                    type: "booking",
                  })
                );
              }
            }}
            loading={actionPending && item.action === actionObject.type}
          >
            {item?.name}
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
