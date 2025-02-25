import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getUploadedImages } from "../redux/Upload/uploadActions";
import { UploadedFilesListing } from "../Component/UploadedFiles/uploadedFilesListing";
import Spinner from "../Component/Common/Spinner";
import EmptyBanner from "../Component/Common/EmptyStateBanner";
import ErrorBanner from "../Component/Common/ErrorBanner";
import { uploadedImageLimit } from "../Constant/app";

export const UploadedImages = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [lastFileKey, setLastFileKey] = useState("");
  const [totalFiles, setTotalFiles] = useState(null);
  const currentPage = searchParams.get("page");
  const { isUploded } = useSelector((state) => state.upload);

  useEffect(() => {
    const getFiles = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setErrorMessage(false);
        setSuccess(false);

        const result = await dispatch(
          getUploadedImages({
            lastFileKey,
            limit: uploadedImageLimit,
          })
        ).unwrap();

        if (!result?.responseCode) {
          setSuccess(true);
          setLastFileKey(result.data?.lastFileKey);
          setFiles(result.data?.files);
          setTotalFiles(result.data?.totalFiles);
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
  }, [currentPage]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setErrorMessage(false);
        setSuccess(false);

        const result = await dispatch(
          getUploadedImages({
            lastFileKey: "",
            limit: uploadedImageLimit,
          })
        ).unwrap();

        if (!result?.responseCode) {
          setSuccess(true);
          setLastFileKey(result.data?.lastFileKey);
          setFiles(result.data?.files);
          setTotalFiles(result.data?.totalFiles);
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

    if (isUploded) {
      getFiles();
    }
  }, [isUploded]);

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
