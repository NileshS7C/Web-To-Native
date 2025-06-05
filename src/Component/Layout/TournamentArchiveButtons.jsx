import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";

import { showError } from "../../redux/Error/errorSlice";
import { showSuccess } from "../../redux/Success/successSlice";
import {
  resetArchiveState,
  resetDownloadState,
} from "../../redux/tournament/addTournament";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import {
  getSingleTournament,
  submitFinalTournament,
} from "../../redux/tournament/tournamentActions";

import Button from "../Common/Button";

export const ArchiveButtons = ({ dispatch, tournament }) => {
  const [pendingAction, setPendingAction] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { singleTournamentOwner } = useOwnerDetailsContext();
  const { tournamentId, eventId } = useParams();

  const {
    pendingArchive,
    archived,
    archivedError,
    archivedErrorMessage,
    pendingDownload,
    downloadError,
    downloadErrorMessage,
    sheetDownload,
  } = useSelector((state) => state.Tournament);
  console.log(archivedError,archivedErrorMessage)
  const { isConfirmed, type } = useSelector((state) => state.confirm);

  const isSingleEvent = !!tournamentId && !!eventId;

  const canArchive = tournament?.status === "PUBLISHED" || tournament?.status === "COMPLETED";
  const canUnarchive = tournament?.status === "ARCHIVED";
  const canComplete =
    tournament?.status === "ARCHIVED" || tournament?.status === "PUBLISHED";

  useEffect(() => {
    const publishTournament = async (data) => {
      try {
        setPendingAction(true);
        setSuccess(false);
        setError(false);

        const result = await dispatch(submitFinalTournament(data)).unwrap();
        if (result.status === "success") {
          setSuccess(true);
          dispatch(resetConfirmationState());
          dispatch(
            getSingleTournament({
              tournamentId: tournament?._id,
              ownerId: singleTournamentOwner?.id,
            })
          );
        }
      } catch (err) {
        setError(true);
        setErrorMessage(
          err?.data?.message ||
            "Something went wrong while publishing the tournament."
        );
      } finally {
        setPendingAction(false);
      }
    };

    if (isConfirmed && tournament && type === "UnArchive") {
      const formData = {
        step: 2,
        tournamentId: tournament?._id,
        ownerUserId: singleTournamentOwner?.id,
        acknowledgment: true,
      };
      publishTournament(formData);
    }
  }, [isConfirmed, type, dispatch, tournament, singleTournamentOwner]);
  // Handle success/error messages
  useEffect(() => {
    if (archivedError) {
      dispatch(
        showError({
          message:
            archivedErrorMessage ||
            "Something went wrong while archiving the tournament. Please try again later.",
          onClose: "hideError",
        })
      );
      dispatch(resetConfirmationState());
      dispatch(resetArchiveState());
    }

    if (error) {
      dispatch(
        showError({
          message: errorMessage,
          onClose: "hideError",
        })
      );
    }

    if (archived) {
      dispatch(
        showSuccess({
          message: "Tournament archived successfully.",
          onClose: "hideSuccess",
        })
      );
      dispatch(resetArchiveState());
    }

    if (downloadError) {
      dispatch(
        showError({
          message:
            downloadErrorMessage ||
            "Something went wrong while downloading the sheet.",
          onClose: "hideError",
        })
      );
      dispatch(resetConfirmationState());
      dispatch(resetDownloadState());
    }

    if (sheetDownload) {
      dispatch(
        showSuccess({
          message: "Excel sheet downloaded successfully.",
          onClose: "hideSuccess",
        })
      );
      dispatch(resetDownloadState());
    }
  }, [
    archivedError,
    archived,
    error,
    downloadError,
    sheetDownload,
    errorMessage,
    dispatch,
  ]);

  return (
    <div className="flex gap-2">
      {!isSingleEvent && canArchive && (
        <Button
          className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#FFFFFF] text-customColor ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-200 shadow-lg transition-transform duration-200 ease-in-out active:translate-y-1 active:scale-95 text-xs sm:text-base md:text-md lg:text-lg"
          onClick={() =>
            dispatch(
              showConfirmation({
                message:
                  "Are you sure you want to archive this tournament? This action cannot be undone.",
                type: "Archive",
                withComments: false,
              })
            )
          }
          loading={pendingArchive}
          disabled={tournament?.status === "ARCHIVED"}
        >
          Unpublish
        </Button>
      )}

      {!isSingleEvent && canUnarchive && (
        <Button
          className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#FFFFFF] text-customColor ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-200 shadow-lg transition-transform duration-200 ease-in-out active:translate-y-1 active:scale-95 text-xs sm:text-base md:text-md lg:text-lg"
          onClick={() =>
            dispatch(
              showConfirmation({
                message:
                  "Are you sure you want to publish this tournament? This action cannot be undone.",
                type: "UnArchive",
                withComments: false,
              })
            )
          }
          loading={pendingAction}
        >
          Publish Tournament
        </Button>
      )}

      {!isSingleEvent && canComplete && (
        <Button
          className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#FFFFFF] text-customColor ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-200 shadow-lg transition-transform duration-200 ease-in-out active:translate-y-1 active:scale-95 text-xs sm:text-base md:text-md lg:text-lg"
          onClick={() =>
            dispatch(
              showConfirmation({
                message:
                  "Are you sure you want to mark this tournament as completed? This action cannot be undone.",
                type: "Completed",
                withComments: false,
              })
            )
          }
          loading={pendingAction}
        >
          Completed
        </Button>
      )}
    </div>
  );
};

ArchiveButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tournament: PropTypes.object.isRequired,
};
