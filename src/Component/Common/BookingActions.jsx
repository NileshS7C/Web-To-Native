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

const cancelBooking = async (dispatch, data, type) => {
  try {
    const result = await dispatch(
      cancelAndRefundBooking({ data, type })
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

const BookingActions = ({ id, index }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const [actionType, setActionType] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [buttonIndex, setButtonIndex] = useState(null);
  const { rejectionComments } = useSelector((state) => state.Tournament);
  const { isConfirmed } = useSelector((state) => state.confirm);
  const cancelBookingData = {
    bookingId: "",
    categoryId: "",
    cancelReason: "",
  };

  useEffect(() => {
    if (
      actionType &&
      actionType === "cancel" &&
      isConfirmed &&
      bookingId &&
      buttonIndex === index
    ) {
      const updatedData = {
        ...cancelBookingData,
        bookingId,
        categoryId: eventId,
        cancelReason: rejectionComments,
      };
      cancelBooking(dispatch, updatedData, actionType);
    }
  }, [actionType, isConfirmed, bookingId, buttonIndex]);

  return (
    <div className="flex justify-end gap-2.5">
      {ActionButtonBooking.map((item) => {
        return (
          <button
            className="text-[#718EBF] text-sm border-[1px] border-[#718EBF] px-[20px] py-2 rounded-md"
            type="button"
            key={item?.name}
            onClick={() => {
              setActionType(item?.action);
              if (item?.action === "cancel") {
                setBookingId(id);
                setButtonIndex(index);
                dispatch(
                  showConfirmation({
                    message: "Do you want to cancel the booking?",
                    type: "booking",
                  })
                );
              }
            }}
          >
            {item?.name}
          </button>
        );
      })}
    </div>
  );
};

BookingActions.propTypes = {
  id: PropTypes.object,
};

export default BookingActions;
