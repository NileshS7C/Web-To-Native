import React, { useState, useEffect } from "react";
import { IoMdTrash } from "react-icons/io";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { imageUpload, uploadIcon } from "../../Assests";
import TextError from "../Error/formError";

const BannerMobileTable = ({ disabled, onChange }) => {
  const dispatch = useDispatch();
  const [bannerImages, setBannerImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const previewImages = bannerImages.length
      ? [{ preview: bannerImages[0] }]
      : [];
    setPreviews(previewImages);
  }, [bannerImages]);

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    
    if (!uploadedFile?.type?.startsWith("image/")) {
      setErrorMessage("File should be a valid image type.");
      setIsError(true);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
      setErrorMessage("File should be less than 5 MB");
      setIsError(true);
      return;
    }
    
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const url = result.data.url;
      const updated = [url]; // Only keep one image for banner
      setBannerImages(updated);
      onChange?.(updated);
    } catch (err) {
      setErrorMessage(err.data?.message || "Upload failed");
      setIsError(true);
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
        {previews[0]?.preview && (
          <>
            <img
              src={previews[0]?.preview || ""}
              className="absolute inset-0 object-scale-down rounded h-full w-full z-100"
              alt="mobile banner"
            />
            {!disabled && (
              <IoMdTrash
                className="absolute right-0 top-0 w-6 h-6 z-100 text-black cursor-pointer shadow-lg"
                onClick={handleRemoveImage}
              />
            )}
          </>
        )}

        {!previews[0]?.preview && (
          <>
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
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
