import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { uploadIcon, venueUploadImage } from "../../Assests";
import TextError from "../Error/formError";

const EventGalleryTable = ({ disabled, onChange, data = [] }) => {
  const dispatch = useDispatch();
  const [galleryImages, setGalleryImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [localPreview, setLocalPreview] = useState(null); // local image while uploading
  const [isUploading, setIsUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      setGalleryImages(data);
      setPreviews(data.map(url => ({ preview: url })));
    }
  }, [data]);

  useEffect(() => {
    const previewImages = galleryImages.map(url => ({ preview: url }));
    setPreviews(previewImages);
  }, [galleryImages]);

  const handleRemoveImage = (index) => {
    const imageToRemove = galleryImages[index];
    if (imageToRemove) {
      dispatch(deleteUploadedImage(imageToRemove));
    }

    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
    setLocalPreview(null);
    onChange?.(updatedImages);
  };

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

    if (galleryImages.length >= 4) {
      setErrorMessage("You can add up to 4 images only.");
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
      const updated = [...galleryImages, url];
      setGalleryImages(updated);
      setLocalPreview(null);
      onChange?.(updated);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Upload failed");
      setIsError(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2.5 mb-2">
      <p className="text-base leading-[19.36px] text-[#232323]">Event Gallery</p>

      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-2.5 w-full overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => {
            const isPreview = previews[index]?.preview;
            const isUploadingSlot = !isPreview && index === galleryImages.length;

            return (
              <div
                className="relative flex flex-none w-[48%] md:w-[30%] lg:w-[23%] gap-3"
                key={`eventGallery-${index}`}
              >
                <img
                  src={
                    isUploadingSlot && localPreview
                      ? localPreview
                      : isPreview
                      ? previews[index].preview
                      : venueUploadImage
                  }
                  alt={`Event gallery ${index + 1}`}
                  className="object-scale-down rounded w-full h-auto"
                />

                {isUploading && isUploadingSlot && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {isPreview && !disabled && !isUploadingSlot && (
                  <IoIosCloseCircleOutline
                    className="absolute right-0 w-6 h-6 z-100 text-black cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {!disabled && galleryImages.length < 4 && !isUploading && (
          <div className="relative flex flex-col items-start gap-2.5 w-full">
            <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
              <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />
              <p className="text-sm text-[#5B8DFF]">
                Click to upload{" "}
                <span className="text-sm text-[#353535]">or drag and drop</span>
              </p>
              <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
              <p className="text-xs text-[#353535] mt-1">(Image size: 600x600)</p>
              <input
                id="eventGallery"
                name="eventGallery"
                onChange={handleFileUpload}
                value=""
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                disabled={disabled || galleryImages.length >= 4}
              />
            </div>
            {isError && <TextError>{errorMessage}</TextError>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGalleryTable;
