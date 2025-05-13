import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";

import { showError } from "../../redux/Error/errorSlice";
import { showSuccess } from "../../redux/Success/successSlice";
import { resetArchiveState,resetDownloadState } from "../../redux/tournament/addTournament";
import {
  resetConfirmationState,
  showConfirmation,
} from "../../redux/Confirmation/confirmationSlice";
import {
  getSingleTournament,
  submitFinalTournament,
} from "../../redux/tournament/tournamentActions";

import Button from "../Common/Button";

/**
 * A buttons Component to dispaly the publish and unpublished buttons
 *
 * @component
 * @param {function} dispatch - A function to dispatch Redux actions for publishing and unpublishing the tournament.
 * @param {object} tournament - The current tournament object. Must contain a `published` boolean property.
 * @return {JSX.Element} The rendered "Publish" and "Unpublish" buttons.
 *
 * */

export const ArchiveButtons = (props) => {
  const { dispatch, tournament } = props;
  const [pendingAction, setPendingAction] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { singleTournamentOwner } = useOwnerDetailsContext();
  const {
    pendingArchive,
    archived,
    archivedError,
    archivedErrorMessage,
    pendingDownload,
    downloadError,
    downloadErrorMessage,
    sheetDownload
  } = useSelector((state) => state.Tournament);

  const { isConfirmed, type } = useSelector((state) => state.confirm);
  
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
          message: "Tournament Archived Successfully.",
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
            "Something went wrong while archiving the tournament. Please try again later.",
          onClose: "hideError",
        })
      );
      dispatch(resetConfirmationState());
      dispatch(resetDownloadState());
    }

    if (error) {
      dispatch(
        showError({
          message: errorMessage,
          onClose: "hideError",
        })
      );
    }

    if (sheetDownload) {
      dispatch(
        showSuccess({
          message: "Excel sheet downloaded successfully",
          onClose: "hideSuccess",
        })
      );

      dispatch(resetDownloadState());
    }
  }, [archivedError, archived, error,downloadError,pendingDownload]);
  

  useEffect(() => {
    const publishTournamet = async (data) => {
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
      publishTournamet(formData);
    }
  }, [isConfirmed]);

  return (
    <div>
      {tournament?.status === "PUBLISHED" && (
        <Button
          className="flex items-center justify-center gap-3 px-4 py-2 bg-[#FFFFFF] text-customColor ml-[0] w-[100%] md:w-auto sm:w-full md:ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-200 shadow-lg transition-transform duration-200 ease-in-out  active:translate-y-1 active:scale-95"
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
      {tournament?.status === "ARCHIVED" && (
        <Button
          className="flex w-[200px] items-center justify-center gap-3 px-4 py-2 bg-[#FFFFFF] text-customColor ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-200 shadow-lg transition-transform duration-200 ease-in-out  active:translate-y-1 active:scale-95"
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
    </div>
  );
};

ArchiveButtons.propTypes = {
  dispatch: PropTypes.func,
  tournament: PropTypes.object,
};

