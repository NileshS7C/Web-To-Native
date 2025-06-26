import React, { useState, useEffect } from "react";
import { IoMdTrash } from "react-icons/io";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { uploadIcon } from "../../Assests";
import TextError from "../Error/formError";

const BannerMobileTable = ({ disabled, onChange, data = [] }) => {
  const dispatch = useDispatch();
  const [bannerImages, setBannerImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setBannerImages(data);
      setPreviews(data.map(url => ({ preview: url })));
    }
  }, [data]);

  useEffect(() => {
    const previewImages = bannerImages.length
      ? [{ preview: bannerImages[0] }]
      : [];
    setPreviews(previewImages);
  }, [bannerImages]);

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");
    setIsUploading(true);

    const uploadedFile = e.target.files[0];

    if (!uploadedFile?.type?.startsWith("image/")) {
      setErrorMessage("File should be a valid image type.");
      setIsError(true);
      setIsUploading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (uploadedFile.size > maxSize) {
      setErrorMessage("File should be less than 5 MB");
      setIsError(true);
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result);
    };
    reader.readAsDataURL(uploadedFile);

    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const url = result.data.url;
      const updated = [url];
      setBannerImages(updated);
      onChange?.(updated);
      setLocalPreview(null);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Upload failed");
      setIsError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (bannerImages[0]) {
      dispatch(deleteUploadedImage(bannerImages[0]));
    }
    setBannerImages([]);
    setPreviews([]);
    setIsError(false);
    setErrorMessage("");
    onChange?.([]);
    setLocalPreview(null);
  };

  return (
    <div className="relative flex flex-col items-start gap-2.5">
      <label
        className="text-base leading-[19.36px]"
        htmlFor="bannerMobileImages"
      >
        Banner Image (Mobile)
      </label>

      <div className="relative flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
        {(localPreview || previews[0]?.preview) && (
          <div className="absolute inset-0 w-full h-full rounded overflow-hidden">
            <img
              src={localPreview || previews[0]?.preview}
              className="object-scale-down w-full h-full"
              alt="mobile banner"
            />

            {isUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!disabled && !isUploading && (
              <IoMdTrash
                className="absolute right-2 top-2 w-6 h-6 z-30 text-black cursor-pointer shadow-lg"
                onClick={handleRemoveImage}
              />
            )}
          </div>
        )}

        {!localPreview && !previews[0]?.preview && (
          <>
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />
            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535]">or drag and drop</span>
            </p>
            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <p className="text-xs text-[#353535] mt-1">
              (Image Size: 800x400)
            </p>
            <input
              id="bannerMobileImages"
              name="bannerMobileImages"
              onChange={handleFileUpload}
              value=""
              type="file"
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
              multiple={false}
              disabled={disabled}
            />
          </>
        )}
      </div>

      {isError && <TextError>{errorMessage}</TextError>}
    </div>
  );
};

export default BannerMobileTable;
