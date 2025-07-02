import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { uploadIcon } from "../../Assests";
import Spinner from "../Common/Spinner";
import { deleteImages, uploadImage } from "../../redux/Upload/uploadActions";

const PreviousEventVideosTable = ({ disabled, onChange, data = [] }) => {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]); // { url, thumbnailImage, isUploading }
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof onChange === "function") {
      const output = videos
        .filter(v => v.url)
        .map(({ url, thumbnailImage }) => ({ video: url, thumbnailImage: thumbnailImage || "" }));
      onChange(output);
    }
  }, [JSON.stringify(videos)]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const formatted = data.map(item => ({
        url: item.video,
        thumbnailImage: item.thumbnailImage || "",
        isUploading: false
      }));
      const isSame = JSON.stringify(formatted) === JSON.stringify(videos);
      if (!isSame) {
        setVideos(formatted);
      }
    }
  }, [JSON.stringify(data)]);

  const handleVideoUpload = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file?.type.startsWith("video/")) {
      setError("Only video files are allowed.");
      e.target.value = "";
      return;
    }

    if (videos.length >= 5) {
      setError("You can upload up to 5 videos only.");
      e.target.value = "";
      return;
    }

    const uploadIndex = videos.length;
    setUploadingIndex(uploadIndex);
    setVideos((prev) => [...prev, { url: null, thumbnailImage: "", isUploading: true }]);

    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const uploadedUrl = result?.data?.url;

      setVideos((prev) => {
        const updated = [...prev];
        updated[uploadIndex] = { url: uploadedUrl, thumbnailImage: "", isUploading: false };
        return updated;
      });
    } catch (err) {
      setError(err?.data?.message || "Video upload failed.");
      setVideos((prev) => prev.filter((_, i) => i !== uploadIndex));
    } finally {
      setUploadingIndex(-1);
      e.target.value = "";
    }
  };

  const handlethumbnailImageUpload = async (e, index) => {
    setError("");
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const uploadedthumbnailImage = result?.data?.url;

      setVideos((prev) => {
        const updated = [...prev];
        updated[index].thumbnailImage = uploadedthumbnailImage;
        return updated;
      });
    } catch (err) {
      setError(err?.data?.message || "thumbnailImage upload failed.");
    } finally {
      e.target.value = "";
    }
  };

  const handleDelete = (index) => {
    const videoUrl = videos[index]?.url;
    const thumbUrl = videos[index]?.thumbnailImage;
    if (videoUrl) dispatch(deleteImages([videoUrl]));
    if (thumbUrl) dispatch(deleteImages([thumbUrl]));

    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-[19.36px] text-[#232323] text-left ">Previous Event Videos (Size: 210 * 372)</p>

      <div className="flex flex-wrap gap-2.5 min-h-[133px] overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="relative flex flex-col gap-1 w-[223px]" key={index}>
            <div className="h-[133px] w-full bg-gray-100 rounded flex items-center justify-center">
              {videos[index]?.isUploading ? (
                <Spinner className="w-8 h-8" />
              ) : videos[index]?.url ? (
                <video controls src={videos[index].url} className="object-scale-down rounded h-full w-full" />
              ) : (
                <div className="text-sm text-gray-400">No video</div>
              )}
            </div>

            {videos[index]?.url && !disabled && (
              <>
                {videos[index]?.thumbnailImage ? (
                  <img
                    src={videos[index].thumbnailImage}
                    alt="thumbnailImage"
                    className="h-[60px] w-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full border border-dashed border-gray-300 rounded p-2 text-xs text-gray-500 text-center">
                    No thumbnailImage
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlethumbnailImageUpload(e, index)}
                  className="text-xs"
                  disabled={disabled}
                />
              </>
            )}

            {videos[index]?.url && !disabled && (
              <IoIosCloseCircleOutline
                className="absolute top-1 right-1 w-5 h-5 text-black cursor-pointer"
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        ))}
      </div>

      {!disabled && videos.length < 5 && (
        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px] mt-2">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />
            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535]"> or drag and drop</span>
            </p>
            <p className="text-xs text-[#353535] mt-1">(Video max size: 50MB)</p>
            <p className="text-xs text-[#353535] mt-1">(Supported formats: MP4, WebM)</p>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingIndex !== -1}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default PreviousEventVideosTable;
