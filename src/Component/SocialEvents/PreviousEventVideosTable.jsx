import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { imageUpload } from "../../Assests";
import Button from "../Common/Button";

const PreviousEventVideosTable = ({ disabled, onChange }) => {
  const dispatch = useDispatch();
  const [videoUrls, setVideoUrls] = useState([]);
  const [tempUrl, setTempUrl] = useState("");

  const handleAddVideo = () => {
    if (!tempUrl) return;

    const updated = [...videoUrls, tempUrl];
    setVideoUrls(updated);
    onChange?.(updated);
    setTempUrl("");
  };

  const handleDelete = (index) => {
    const updated = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updated);
    onChange?.(updated);
  };

  // For video URLs, we'll use a text input instead of file upload
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-[19.36px] text-[#232323]">Previous Event Videos</p>
      
      <div className="overflow-x-auto rounded-md w-full">
        <table className="border border-[#EAECF0] rounded-[8px] table-auto min-w-[700px] w-full">
          <thead>
            <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b h-[44px]">
              <th className="text-left p-2">S.No.</th>
              <th className="text-left p-2">Video URL</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videoUrls.map((url, index) => (
              <tr key={index} className="text-sm text-[#667085]">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div className="relative flex items-center gap-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline truncate max-w-xs">
                      {url}
                    </a>
                  </div>
                </td>
                <td className="p-2">
                  {!disabled && (
                    <div className="flex gap-4">
                      <RiDeleteBin6Line
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {/* Add Row */}
            {!disabled && (
              <tr className="text-sm text-[#667085]">
                <td className="p-2">{videoUrls.length + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="Enter video URL"
                    className="w-full px-3 py-2 border border-[#DFEAF2] rounded-md"
                  />
                </td>
                <td className="p-2">
                  <Button
                    className="px-3 py-1 bg-[#1570EF] text-white rounded-md"
                    onClick={handleAddVideo}
                    disabled={!tempUrl}
                  >
                    Add
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviousEventVideosTable;
