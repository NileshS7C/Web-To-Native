import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import SwitchToggle from "../SwitchToggle";
import axiosInstance from "../../../../Services/axios";

export default function ExploreSectionInfo({ sectionInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionDetails, setSectionDetails] = useState([]);

  useEffect(() => {
    setSectionDetails({
      sectionTitle: sectionInfo.sectionTitle,
      isVisible: sectionInfo.isVisible,
      features: sectionInfo.features || [],
    });
  }, [sectionInfo])
  
  const handleSave = async () => {
    setIsEditing(false);

    const hasChanged = sectionDetails.sectionTitle !== sectionInfo.sectionTitle || sectionDetails.isVisible !== sectionInfo.isVisible;

    if (!hasChanged) {
      return;
    }

    const updatedFeatures = sectionDetails.features.map(({ _id, ...rest }) => rest);

    const updatedData = {
      sectionTitle: sectionDetails.sectionTitle,
      isVisible: sectionDetails.isVisible,
      features: updatedFeatures,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post( `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/explore`,JSON.stringify(updatedData), config);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  return (
    <div className="px-4 py-3 sm:px-8 sm:py-4 relative w-full max-w-md sm:w-fit shadow-md rounded-lg border border-gray-300 bg-white">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={() => setIsEditing(!isEditing)}
        aria-label="Edit Section"
      >
        <PencilIcon className="w-5 h-5 sm:w-4 sm:h-4" />
      </button>
      <div className="space-y-4 sm:space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-20">
          <span className="text-gray-700 font-semibold text-base sm:text-sm">Section Title:</span>
          {isEditing ? (
            <input
              type="text"
              value={sectionDetails?.sectionTitle}
              onChange={(e) =>
                setSectionDetails({ ...sectionDetails, sectionTitle: e.target.value })
              }
              className="w-full sm:w-40 border rounded p-2 sm:p-1 text-base sm:text-sm"
            />
          ) : (
            <span className="text-gray-900 text-base sm:text-sm break-words">{sectionDetails?.sectionTitle}</span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-20">
          <span className="text-gray-700 font-semibold text-base sm:text-sm">Show Section:</span>
          {isEditing ? (
            <div className="w-full sm:w-auto">
              <SwitchToggle
                enabled={sectionDetails?.isVisible}
                onChange={(value) =>
                  setSectionDetails({ ...sectionDetails, isVisible: value })
                }
              />
            </div>
          ) : (
            <span className="text-gray-900 text-base sm:text-sm">{sectionDetails?.isVisible ? "Yes" : "No"}</span>
          )}
        </div>
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full mt-2 bg-[#1570EF] text-white p-2 rounded text-base sm:text-sm"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
