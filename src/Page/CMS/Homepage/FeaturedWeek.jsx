import React, { useState, useEffect } from "react";
import WeekSectionInfo from "../../../Component/CMS/HomePage/FeaturedWeeks/WeekSectionInfo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadImage } from "../../../utils/uploadImage";
import axiosInstance from "../../../Services/axios";

export default function FeaturedWeek() {
  const [isEditing, setIsEditing] = useState(false);
  const [weekData, setWeekData] = useState({});
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [originalWeekData, setOriginalWeekData] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchWeekData = async () => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=featuredThisWeek`,
        config
      );
  
      const data = response.data?.data?.length ? response.data.data[0] : null;
  
      if (data) {
        setOriginalWeekData(data);
        setWeekData(data);
        setHeading(data.heading || "");
        setSubHeading(data.subHeading || "");
        setButtonText(data.buttonText || "");
        setLink(data.link || "");
        setImage(data.image || "");
      } else {
        // Handle empty response case
        setOriginalWeekData(null);
        setWeekData(null);
        setHeading("");
        setSubHeading("");
        setButtonText("");
        setLink("");
        setImage("");
      }
    } catch (error) {
      console.error("Error fetching week data:", error);
    }
  };
  

  useEffect(() => {
    fetchWeekData();
  }, []);

  const handleSave = async () => {
    if (!validateFields()) return;
    try {
      let uploadImageUrl = image;

      if (newImageFile) {
        // Only upload if a new image is selected
        const uploadedImage = await uploadImage(newImageFile);
        uploadImageUrl = uploadedImage?.url || image;
      }
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      await axiosInstance.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/homepage-sections/featuredThisWeek`,
        JSON.stringify({
          heading,
          subHeading,
          buttonText,
          link,
          image: uploadImageUrl,
        }),
        config
      );

      setIsEditing(false);
      fetchWeekData();
    } catch (error) {
      console.error(error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    
    const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "").trim();  // Remove HTML tags

    if (!heading.trim()) newErrors.heading = "Heading is required.";
    if (!stripHtml(subHeading)) newErrors.subHeading = "Sub Heading is required.";  // Fix for ReactQuill
    if (!buttonText.trim()) newErrors.buttonText = "Button Text is required.";
    if (!link.trim()) newErrors.link = "Link is required.";
    if (!image.trim()) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleDiscard = () => {
    if (originalWeekData) {
      setWeekData(originalWeekData);
      setHeading(originalWeekData.heading);
      setSubHeading(originalWeekData.subHeading);
      setButtonText(originalWeekData.buttonText);
      setLink(originalWeekData.link);
      setImage(originalWeekData.image);
      setNewImageFile(null);
    }
    setIsEditing(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col gap-4">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold text-left text-gray-900">
            {weekData.sectionTitle}
          </h1>
        </div>
        <div className="flex items-end justify-between w-full">
          <WeekSectionInfo sectionInfo={weekData} />
          {!isEditing ? (
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-3 py-2 rounded"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 shadow-md rounded-lg border border-gray-300 bg-white py-4 px-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-left">Heading</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            disabled={!isEditing}
            
          />
            {errors.heading && <span className="text-red-500 text-sm">{errors.heading}</span>}

          <label className="font-semibold text-left">Sub Heading</label>
          <ReactQuill
            value={subHeading}
            onChange={setSubHeading}
            readOnly={!isEditing}
            theme="snow"
            style={{
              height: "170px",
              cursor: isEditing ? "text" : "not-allowed",
              borderColor: "#e5e7eb",
            }}
          />
          {errors.subHeading && <span className="text-red-500 text-sm">{errors.subHeading}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-left">Button Text</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            disabled={!isEditing}
          />
            {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
          <label className="font-semibold text-left">Link</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={!isEditing}
          />

          <div className="relative flex items-center gap-2">
            <img
              src={image}
              alt="Preview"
              className="w-full h-40 object-cover rounded"
            />
            {isEditing && (
              <div className="absolute right-0 top-0 flex flex-col gap-2">
                <input
                  type="file"
                  className="hidden"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewImageFile(file);
                      setImage(URL.createObjectURL(file));
                    }
                  }}
                />

                <label
                  htmlFor="imageUpload"
                  className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer"
                >
                  Upload
                </label>
              </div>
            )}
          </div>
          <p className="text-[12px] text-[#353535] mt-1">
            (Image size: 800x800)
          </p>
        </div>
      </div>
    </div>
  );
}
