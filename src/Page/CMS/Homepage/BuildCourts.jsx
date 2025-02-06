import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import SwitchToggle from "../../../Component/CMS/HomePage/SwitchToggle";
import axiosInstance from "../../../Services/axios";

export default function BuildCourts() {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionDetails, setSectionDetails] = useState(null);
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);

  const fetchBuildCourtsData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections?section=buildCourt`);
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setSectionDetails(result.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBuildCourtsData();
  }, []);

  const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("uploaded-file", file);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const response = await axiosInstance.post(
            `${import.meta.env.VITE_BASE_URL}/upload-file`,
            formData,
            config
        );
        return { success: true, url: response.data.data.url };
    } catch (error) {
        return { success: false, message: error.response.data.message };
    }
};

  const handleSave = async () => {
    setIsEditing(false);
    try {
      let updatedDetails = { ...sectionDetails };
      console.log(desktopImage, mobileImage)
      if (desktopImage) {
        const uploadedDesktopUrl = await uploadImage(desktopImage);
        if (uploadedDesktopUrl.success) {
          updatedDetails.DesktopBannerImage = uploadedDesktopUrl.url;
        }
      }

      if (mobileImage) {
        const uploadedMobileUrl = await uploadImage(mobileImage);
        if (uploadedMobileUrl.success) {
          updatedDetails.MobileBannerImage = uploadedMobileUrl.url;
        }
      }
      const { _id, updatedAt, sectionType, ...finalPayload } = updatedDetails;

      // Send updated details to API
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections/buildCourt`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) throw new Error("Failed to update");
      await response.json();
      fetchBuildCourtsData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };


  if (!sectionDetails) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-lg border border-gray-300 p-4 mx-auto relative w-full">
        Build Courts Section
      </div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 mx-auto relative w-full">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 w-[40%]">
            <label className="text-gray-700 font-semibold">Visibility:</label>
            {isEditing ? (
              <SwitchToggle
                enabled={sectionDetails.isVisible}
                onChange={(value) => setSectionDetails({ ...sectionDetails, isVisible: value })}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-gray-900">{sectionDetails?.isVisible ? "Yes" : "No"}</span>
            )}
          </div>
          <div className="flex items-center gap-2 w-[20%]">
            <label className="text-gray-700 font-semibold">Link:</label>
            {isEditing ? (
              <input
                type="text"
                className="border border-gray-300 p-1 rounded w-full"
                value={sectionDetails.link}
                onChange={(e) => setSectionDetails({ ...sectionDetails, link: e.target.value })}
              />
            ) : (
              <a href={sectionDetails.link} className="text-blue-600 hover:underline truncate max-w-sm">
                {sectionDetails.link}
              </a>
            )}
          </div>
          <div className="flex justify-end space-x-2 w-[40%]">
            {!isEditing ? (
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsEditing(true)}>
                <PencilIcon className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setIsEditing(false)}>
                  Discard
                </button>
                <button className="bg-[#1570EF] text-white px-3 py-1 rounded" onClick={handleSave}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {/* Desktop Image */}
          <div className="relative border border-gray-300 px-2 pt-4 pb-2 rounded-md">
            {isEditing && (
              <div className="absolute top-4 right-2">
                <input
                  type="file"
                  className="hidden"
                  id="desktopUpload"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file) {
                      setDesktopImage(file);
                    }
                  }}
                />
                <label htmlFor="desktopUpload" className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer">
                  Upload
                </label>
              </div>
            )}
            <label className="text-gray-700 font-semibold block text-center">Desktop Image</label>
            <img
              src={desktopImage ? URL.createObjectURL(desktopImage) : sectionDetails.DesktopBannerImage}
              alt="Desktop"
              className="w-full h-60 object-cover rounded-md mt-4"
            />
          </div>

          {/* Mobile Image */}
          <div className="relative border border-gray-300 px-2 pt-4 pb-2 rounded-md">
            {isEditing && (
              <div className="absolute top-4 right-2">
                <input
                  type="file"
                  className="hidden"
                  id="mobileUpload"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file) {
                      setMobileImage(file);
                    }
                  }}
                />
                <label htmlFor="mobileUpload" className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer">
                  Upload
                </label>
              </div>
            )}
            <label className="text-gray-700 font-semibold block text-center">Mobile Image</label>
            <img
              src={mobileImage ? URL.createObjectURL(mobileImage) : sectionDetails.MobileBannerImage}
              alt="Mobile"
              className="w-full h-60 object-cover rounded-md mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
