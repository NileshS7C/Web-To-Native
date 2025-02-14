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
  getSingle_TO,
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
import { userLogout } from "../../redux/Authentication/authActions";

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
  const { tournament, tournamentEditMode, singleTournamentOwner } = useSelector(
    (state) => state.GET_TOUR
  );

  const { isOpen, message, onClose, isConfirmed, type } = useSelector(
    (state) => state.confirm
  );
  const [cookies] = useCookies(["name", "userRole"]);
  const isAddInThePath = window.location.pathname.includes("/add");

  useEffect(() => {
    const isDisable = shouldBeDisable(
      tournament?.status,
      tournamentId,
      tournamentEditMode,
      isAddInThePath,
      cookies?.userRole,
      tournament?._id
    );

    dispatch(setIsEditable(isDisable));

    if (tournament?.status === "DRAFT" && tournamentId) {
      dispatch(setFormOpen("event"));
    } else {
      dispatch(setFormOpen("basic info"));
    }
  }, [
    tournament?.status,
    tournamentId,
    tournamentEditMode,
    isAddInThePath,
    cookies?.userRole,
    tournament?._id,
  ]);

  useEffect(() => {
    const userRole = cookies.userRole;

    if (!userRole) {
      dispatch(userLogout());
    } else if (userRole === "TOURNAMENT_OWNER") {
      dispatch(getSingle_TO("TOURNAMENT_OWNER"));
    } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      dispatch(getSingle_TO("ADMIN"));
    }
  }, []);

  useEffect(() => {
    if (tournamentId && singleTournamentOwner) {
      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
        })
      );
    }
  }, [tournamentId, singleTournamentOwner]);

  useEffect(() => {
    if (isConfirmed && tournamentId && type === "Tour") {
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
      const timerId = setTimeout(() => {
        dispatch(
          showSuccess({
            message:
              approvalBody.action === "APPROVE"
                ? "Tournament approved successfully."
                : "Tournament rejected successfully.",
            onClose: "hideSuccess",
          })
        );
        dispatch(resetVerificationState());
      }, 300);

      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
        })
      );

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
      {tournament?.status === "REJECTED" && tournamentId && (
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
              } disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={!tournamentId}
              onClick={() => dispatch(setFormOpen("event"))}
            >
              Events
            </button>
            <button
              className={`tab-button ${
                currentStep === "acknowledgement" ? "active" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={!tournamentId}
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
          withComments={type !== "Event"}
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
