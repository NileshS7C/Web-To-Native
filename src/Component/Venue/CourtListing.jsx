import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@headlessui/react";

import {
  onCancel,
  onConfirm,
} from "../../redux/Confirmation/confirmationSlice";
import { cleanUpSuccess, showSuccess } from "../../redux/Success/successSlice";
import { cleanUpError, showError } from "../../redux/Error/errorSlice";
import { resetCourtState, resetDeleteState, resetErrorState } from "../../redux/Venue/addCourt";
import { deleteCourt, getSingleVenue } from "../../redux/Venue/venueActions";
import { resetConfirmationState } from "../../redux/Confirmation/confirmationSlice";

import { courtTableContent } from "../../Constant/venue";
import DataTable from "../Common/DataTable";
import { SuccessModal } from "../Common/SuccessModal";
import { ErrorModal } from "../Common/ErrorModal";
import { ConfirmationModal } from "../Common/ConfirmationModal";

export const CourtListing = ({
  courts,
  currentPage,
  totalVenues,
  onPageChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isOpen, message, onClose } = useSelector((state) => state.confirm);
  const { isDeleting, isDeleted, isError, errorMessage } = useSelector(
    (state) => state.addCourt
  );
  const { isConfirmed, type, confirmationId } = useSelector(
    (state) => state.confirm
  );
  useEffect(() => {
    if (isConfirmed && type === "Court" && confirmationId) {
      dispatch(deleteCourt(confirmationId));
      dispatch(resetConfirmationState());
    }
  }, [isConfirmed, type, confirmationId]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(
        showSuccess({
          message: "Court deleted successfully",
          onClose: "hideSuccess",
        })
      );
      dispatch(getSingleVenue(id));
    }

    if (isError) {
      console.log("called");
      dispatch(
        showError({
          message: errorMessage || "Something went wrong!",
          onClose: "hideError",
        })
      );
    }
  }, [isDeleted, isError]);
  useEffect(() => {
    return () => {
      dispatch(cleanUpSuccess());
      dispatch(resetDeleteState());
      dispatch(onCancel());
      dispatch(cleanUpError());
      dispatch(resetCourtState());
    };
  }, []);

  return (
    <div className="flex flex-col ">
      <div className="flex justify-between bg-[#FFFFFF] items-center px-[24px] py-[20px]">
        <p className="text-[18px] font-semibold text-[#101828]">Courts</p>
        <Button
          type="button"
          className="block rounded-md bg-[#1570EF]  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate(`/venues/${id}/add-court`)}
        >
          Add Court
        </Button>
      </div>
      <SuccessModal />
      <ErrorModal />
      <ConfirmationModal
        isOpen={isOpen}
        onCancel={onCancel}
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={isDeleting}
        message={message}
      />
      <DataTable
        columns={courtTableContent}
        data={courts}
        currentPage={currentPage}
        totalPages={totalVenues}
        onPageChange={onPageChange}
      />
    </div>
  );
};

CourtListing.propTypes = {
  courts: PropTypes.array,
  currentPage: PropTypes.number,
  totalVenues: PropTypes.number,
  onPageChange: PropTypes.func,
};
