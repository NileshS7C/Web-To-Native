import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { resetEditMode } from "../../redux/tournament/getTournament";
import {
  resetArchiveState,
  resetVerificationState,
  setApprovalBody,
  setFormOpen,
  setIsEditable,
  setRejectionComments,
} from "../../redux/tournament/addTournament";
import {
  archiveTournament,
  getSingleTournament,
  handleTournamentDecision,
} from "../../redux/tournament/tournamentActions";

import {
  onCancel,
  onConfirm,
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

import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";
const TournamentCreationForm = () => {
  const {rolesAccess}=useOwnerDetailsContext()
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

  const { isOpen, message, onClose, isConfirmed, type, withComments } =
    useSelector((state) => state.confirm);

  const { archived } = useSelector((state) => state.Tournament);

  const { singleTournamentOwner = {} } = useOwnerDetailsContext();
  const isAddInThePath = window.location.pathname.includes("/add");

  useEffect(() => {
    const isDisable = shouldBeDisable(
      tournament?.status,
      tournamentId,
      tournamentEditMode,
      isAddInThePath,
      rolesAccess.tournament,
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
    rolesAccess?.tournament,
    tournament?._id,
  ]);

  useEffect(() => {
    if (tournamentId && singleTournamentOwner) {
      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
          type:rolesAccess?.tournament
        })
      );
    }
  }, [tournamentId, singleTournamentOwner]);
  console.log(tournament,rolesAccess);
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

      dispatch(setRejectionComments(""));
      dispatch(resetConfirmationState());
    }
  }, [isConfirmed, tournamentId]);

  useEffect(() => {
    if (isConfirmed && tournament && type === "Archive") {
      dispatch(archiveTournament({tournamentId:tournamentId, ownerId:tournament?.ownerUserId,type:rolesAccess?.tournament}));
      dispatch(resetConfirmationState());
    }
  }, [isConfirmed, tournamentId]);
  useEffect(() => {
    if (archived) {
      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
          type: rolesAccess?.tournament,
        })
      );

      dispatch(resetArchiveState());
    }
  }, [archived]);

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
      }, 500);

      dispatch(
        getSingleTournament({
          tournamentId,
          ownerId: singleTournamentOwner?.id,
          type: rolesAccess?.tournament,
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
  useEffect(() => {
    return () => {
      dispatch(resetEditMode());
    };
  }, []);

  return (
    <div>
      {tournament?.status === "REJECTED" && tournamentId && (
        <RejectionBanner
          message={tournament?.rejectionComments}
          title="Rejection comments:"
        />
      )}

      <div className="flex flex-col px-4 md:pl-[50px] md:pr-[30px]  bg-[#FFFFFF] rounded-3xl w-full">
        <div className="py-5 md:py-[50px] overflow-auto scrollbar-hide">
          <div className="flex items-center  border-b-[1px] border-[#EDEDED] gap-5 md:gap-[67px] ">
            <button
              className={`tab-button whitespace-nowrap ${
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
              disabled={!tournamentId || tournament?.status === "ARCHIVED"}
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
          onConfirm={onConfirm}
          isLoading={false}
          message={message}
          withComments={withComments}
        />

        {currentStep === "basic info" && (
          <TournamentInfo
            tournament={tournament}
            status={tournament?.status}
            isDisable={isNotEditable}
            disabled={!isNotEditable}
          />
        )}
        {currentStep === "event" && <EventInfo disabled={!isNotEditable} />}
        {currentStep === "acknowledgement" && (
          <AcknowledgementText
            ownerUserId={tournament?.ownerUserId}
            disabled={!isNotEditable}
          />
        )}
        <EventCreationModal />
      </div>
    </div>
  );
};

export default TournamentCreationForm;
