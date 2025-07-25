import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import SwitchToggle from "../SwitchToggle";
import axiosInstance from "../../../../Services/axios";



export default function MediaGallerySectionInfo({ sectionInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionDetails, setSectionDetails] = useState([]);

  useEffect(() => {
    setSectionDetails({
      sectionTitle: sectionInfo.sectionTitle,
      isVisible: sectionInfo.isVisible,
      mediaGallery: sectionInfo.mediaGallery || [],
    });
  }, [sectionInfo])
  
  const handleSave = async () => {
    setIsEditing(false);

    const hasChanged = sectionDetails.sectionTitle !== sectionInfo.sectionTitle || sectionDetails.isVisible !== sectionInfo.isVisible;

    if (!hasChanged) {
      return;
    }

    const updatedMediaGallery = sectionDetails.mediaGallery.map(
      ({ _id, ...rest }) => rest
    );

    const updatedData = {
      sectionTitle: sectionDetails.sectionTitle,
      isVisible: sectionDetails.isVisible,
      mediaGallery: updatedMediaGallery,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tourism/mediaGallery`,
        JSON.stringify(updatedData),
        config
      );
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  return (
    <div className="px-8 py-4 relative w-fit shadow-md rounded-lg border border-gray-300 bg-white">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={() => setIsEditing(!isEditing)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <div className="space-y-2">
        <div className="flex justify-between items-center gap-20">
          <span className="text-gray-700 font-semibold">Section Title:</span>
          {isEditing ? (
            <input
              type="text"
              value={sectionDetails?.sectionTitle}
              onChange={(e) =>
                setSectionDetails({ ...sectionDetails, sectionTitle: e.target.value })
              }
              className="w-40 border rounded p-1"
            />
          ) : (
            <span className="text-gray-900">{sectionDetails?.sectionTitle}</span>
          )}
        </div>
        <div className="flex justify-between items-center gap-20">
          <span className="text-gray-700 font-semibold">Show Section:</span>
          {isEditing ? (
            <SwitchToggle
              enabled={sectionDetails?.isVisible}
              onChange={(value) =>
                setSectionDetails({ ...sectionDetails, isVisible: value })
              }
            />
          ) : (
            <span className="text-gray-900">{sectionDetails?.isVisible ? "Yes" : "No"}</span>
          )}
        </div>
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full mt-2 bg-[#1570EF] text-white p-2 rounded"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
