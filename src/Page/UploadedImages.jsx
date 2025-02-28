import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  deleteUploadedImagesListing,
  getUploadedImages,
} from "../redux/Upload/uploadActions";
import { UploadedFilesListing } from "../Component/UploadedFiles/uploadedFilesListing";
import Spinner from "../Component/Common/Spinner";
import EmptyBanner from "../Component/Common/EmptyStateBanner";
import ErrorBanner from "../Component/Common/ErrorBanner";
import { uploadedImageLimit } from "../Constant/app";
import { showError } from "../redux/Error/errorSlice";
import {
  resetDeleteImageDetails,
  resetDeleteImageSuccess,
  setDeleteImageSuccess,
} from "../redux/Upload/uploadImage";

export const UploadedImages = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(null);
  const currentPage = searchParams.get("page");
  const { isUploded, deleteImageDetails, deleteImageSuccess } = useSelector(
    (state) => state.upload
  );

  useEffect(() => {
    const getFiles = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setErrorMessage(false);
        setSuccess(false);

        const result = await dispatch(
          getUploadedImages({
            currentPage: currentPage || 1,
            limit: uploadedImageLimit,
          })
        ).unwrap();

        if (result?.status === "success") {
          setSuccess(true);
          setFiles(result.data?.files);
          setTotalFiles(result.data?.pagination?.totalFiles);
        }
      } catch (err) {
        console.log(" error occured while getting the uploaded images", err);
        setError(true);
        setErrorMessage(
          err?.data?.message ||
            "Oops!, something went wrong while getting the uploaded images."
        );
      } finally {
        setIsLoading(false);
      }
    };

    getFiles();
  }, [currentPage, isUploded, deleteImageSuccess]);

  useEffect(() => {
    const deleteImages = async () => {
      try {
        dispatch(resetDeleteImageSuccess());
        const result = await dispatch(
          deleteUploadedImagesListing({ fileUrls: deleteImageDetails })
        ).unwrap();

        if (result?.status === "success") {
          dispatch(setDeleteImageSuccess());
        }
      } catch (err) {
        console.log(" error occured while deleting the file", err);
        dispatch(
          showError({
            message:
              err?.data?.message ||
              "Something went wrong while deleting the file. Please try again later.",
            onClose: "hideError",
          })
        );
      } finally {
        dispatch(resetDeleteImageDetails());
      }
    };
    if (deleteImageDetails.length > 0) {
      deleteImages();
    }
  }, [deleteImageDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={errorMessage} />;
  }

  if (!files?.length) {
    return <EmptyBanner message="No uploaded images has been found." />;
  }

  return (
    <UploadedFilesListing
      currentPage={currentPage || 1}
      files={files}
      totalFiles={totalFiles}
    />
  );
};
