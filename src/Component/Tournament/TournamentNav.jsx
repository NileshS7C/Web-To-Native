import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import {
  resetVerificationState,
  setApprovalBody,
  setFormOpen,
  setIsEditable,
  setRejectionComments,
} from "../../redux/tournament/addTournament";
import {
  getSingleTournament,
  handleTournamentDecision,
} from "../../redux/tournament/tournamentActions";

import {
  onCancel,
  onCofirm,
  resetConfirmationState,
} from "../../redux/Confirmation/confirmationSlice";
import { showSuccess } from "../../redux/Success/successSlice";
import { showError } from "../../redux/Error/errorSlice";

import RejectionBanner from "../Common/RejectionBanner";
import { shouldBeDisable } from "../../utils/tournamentUtils";
import { ConfirmationModal } from "../Common/ConfirmationModal";
import { AcknowledgementText } from "./Acknowledgement/Acknowledgement";
import { EventCreationModal } from "./Event/EventCreationModal";
import EventInfo from "./Event/EventInfo";
import { TournamentInfo } from "./TournamentInfo";

const TournamentCreationForm = () => {
  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const {
    currentStep,
    isNotEditable,
    verificationSuccess,
    verificationError,
    rejectionComments,
    approvalBody,
    verificationErrorMessage,
  } = useSelector((state) => state.Tournament);
  const { tournament, tournamentEditMode } = useSelector(
    (state) => state.GET_TOUR
  );

  const { isOpen, message, onClose, isConfirmed } = useSelector(
    (state) => state.confirm
  );
  const [cookies] = useCookies(["name", "userRole"]);
  const isAddInThePath = window.location.pathname.includes("add");

  useEffect(() => {
    const isDisable = shouldBeDisable(
      tournament?.status,
      tournamentId,
      tournamentEditMode,
      isAddInThePath,
      cookies?.userRole
    );

    dispatch(setIsEditable(isDisable));

    if (tournament?.status === "DRAFT") {
      dispatch(setFormOpen("event"));
    } else {
      dispatch(setFormOpen("basic info"));
    }
  }, [
    tournament?.status,
    tournamentId,
    tournamentEditMode,
    isAddInThePath,
    cookies,
  ]);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getSingleTournament(tournamentId));
    }
  }, [tournamentId]);

  useEffect(() => {
    if (isConfirmed && tournamentId) {
      const rejectionBody = {
        ...approvalBody,
        action: "REJECT",
        rejectionComments,
      };

      dispatch(
        handleTournamentDecision({ actions: rejectionBody, id: tournamentId })
      );

      dispatch(setApprovalBody(rejectionBody));
      dispatch(resetConfirmationState());
      dispatch(setRejectionComments(""));
    }
  }, [isConfirmed, tournamentId]);

  useEffect(() => {
    if (verificationSuccess && tournamentId) {
      dispatch(
        showSuccess({
          message:
            approvalBody.action === "APPROVE"
              ? "Tournament approved successfully."
              : "Tournament rejected successfully.",
          onClose: "hideSuccess",
        })
      );

      const timerId = setTimeout(() => {
        dispatch(resetVerificationState());
      }, 300);

      return () => {
        clearTimeout(timerId);
      };
    }

    if (verificationError) {
      const timerId = setTimeout(() => {
        dispatch(
          showError({
            message:
              verificationErrorMessage ||
              "Oops! Something went wrong. Please try again.",
            onClose: "hideError",
          })
        );

        dispatch(resetVerificationState());
      }, 300);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [verificationSuccess, tournamentId, verificationError]);

  return (
    <div>
      {tournament?.status && tournament?.status === "REJECTED" && (
        <RejectionBanner
          message={tournament?.rejectionComments}
          title="Rejection comments:"
        />
      )}

      <div className="flex flex-col pl-[50px] pr-[30px]  bg-[#FFFFFF] rounded-3xl">
        <div className="py-[50px] ">
          <div className="flex items-center  border-b-[1px] border-[#EDEDED] gap-[67px] ">
            <button
              className={`tab-button ${
                currentStep === "basic info" ? "active" : ""
              } `}
              onClick={() => dispatch(setFormOpen("basic info"))}
            >
              Basic Info
            </button>
            <button
              className={`tab-button ${
                currentStep === "event" ? "active" : ""
              } `}
              onClick={() => dispatch(setFormOpen("event"))}
            >
              Events
            </button>
            <button
              className={`tab-button ${
                currentStep === "acknowledgement" ? "active" : ""
              } `}
              onClick={() => dispatch(setFormOpen("acknowledgement"))}
            >
              Acknowledgement
            </button>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isOpen}
          onCancel={onCancel}
          onClose={onClose}
          onConfirm={onCofirm}
          isLoading={false}
          message={message}
          withComments={true}
        />

        {currentStep === "basic info" && (
          <TournamentInfo
            tournament={tournament}
            status={tournament?.status}
            isDisable={isNotEditable}
          />
        )}
        {currentStep === "event" && <EventInfo isDisable={isNotEditable} />}
        {currentStep === "acknowledgement" && (
          <AcknowledgementText ownerUserId={tournament?.ownerUserId} />
        )}
        <EventCreationModal />
      </div>
    </div>
  );
};

export default TournamentCreationForm;
