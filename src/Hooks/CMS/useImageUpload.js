import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../redux/Upload/uploadActions";

import { venueImageSize } from "../../Constant/app";

export const useImageUpload = () => {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    setIsError(false);
    setUploadError("");
    const uploadedFile = e.target.files[0];

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];
    if (!allowedTypes.includes(uploadedFile.type)) {
      setUploadError("File should be a PNG, JPEG, JPG or WEBP image.");
      return;
    }

    const maxSize = venueImageSize;
    if (uploadedFile.size > maxSize) {
      setUploadError("File should be less than 5 MB");
      return;
    }
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const url = result.data.url;
      setPreviewURL(url);
      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err.data?.message);
      setIsError(true);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleFileUpload,
    isError,
    isUploading,
    uploadError,
    previewURL,
    uploadSuccess,
  };
};
