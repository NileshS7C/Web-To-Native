import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Services/axios";

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const coverFileInputRef = useRef(null);
  const writerFileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [handle, setHandle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [writerName, setWriterName] = useState("");
  const [writerShortName, setWriterShortName] = useState("");
  const [writerDesignation, setWriterDesignation] = useState("");
  const [writerImage, setWriterImage] = useState("");
  const [writerImageError, setWriterImageError] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [saveError, setSaveError] = useState("");

  const uploadImageToS3 = async (file) => {
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

  // Handle Image Upload
  const handleImageChange = async (event, setImageFunction, triggerBy) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToS3(file);
      if (imageUrl.success) {
        setImageFunction(imageUrl.url);
        setImageError("");
        setWriterImageError("");
      } else {
        if (triggerBy === "coverImage") {
          setImageError(imageUrl.message);
        } else if (triggerBy === "writerImage") {
          setWriterImageError(imageUrl.message);
        }
      }
    }
  };

  // Handle Tag Addition
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
    setTag("");
    setShowDropdown(false);
  };

  // Handle Tag Removal
  const handleRemoveTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };

  // Handle Image Removal
  const handleRemoveImage = (setImageFunction, triggerBy) => {
    setImageFunction("");
    if (triggerBy === "coverImage" && coverFileInputRef.current) {
      coverFileInputRef.current.value = "";
    } else if (triggerBy === "writerImage" && writerFileInputRef.current) {
      writerFileInputRef.current.value = "";
    }
  };

  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Handle Form Submission
  const handleSave = async () => {
    if (!handle.trim()) {
      setHandleError("Handle is required.");
      return;
    }
    setHandleError("");

    const publishDate = getFormattedDate();
    const formData = {
      blogName: title,
      description: content,
      handle,
      isVisible: isPublished,
      featureImage: image,
      writerName,
      writerShortname: writerShortName,
      writerDesignation: writerDesignation,
      writerImage,
      tag: tags,
      publishDate,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/blogs`,
        JSON.stringify(formData),
        config
      );

      if (response.status !== 200) {
        throw new Error("Failed to save blog post.");
      }

      const newHandle = response.data.data.handle;
      navigate(`/cms/blogs/blog-posts`);


    } catch (error) {
      if (error?.response?.data?.errors.length > 0) {
        setSaveError(error?.response?.data?.errors[0]?.message);
      } else {
        setSaveError(error.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Page Title and Save Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-left">Create Blog Post</h1>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Create Post
        </button>
      </div>
      
      {/* Show the error if save failure */}
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mt-2">
          <p className="text-sm">{saveError}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-1 sm:col-span-2 space-y-6">
          {/* Title & Content Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-6 min-h-[500px]">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Title
              </label>
              <input
                type="text"
                placeholder="Give your blog post a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="mt-1"
                style={{ height: "16em" }}
              />
            </div>
          </div>

          {/* Handle Label Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium text-left">Handle</h2>
            <input
              type="text"
              placeholder="Enter handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {handleError && (
              <p className="text-red-500 text-sm">{handleError}</p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Visibility Toggle */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium text-left">Visibility</h2>
            <div className="flex items-center justify-between">
              <span>{isPublished ? "Visible" : "Hidden"}</span>
              <button
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex items-center h-6 w-12 rounded-full transition ${
                  isPublished ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 transform bg-white rounded-full transition ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium text-left">Blog Cover Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImage, "coverImage")}
              className="hidden"
              id="coverImageUpload"
              ref={coverFileInputRef}
            />
            <div className="text-left">
              <label
                htmlFor="coverImageUpload"
                className="inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm 
              hover:bg-gray-900 hover:text-white cursor-pointer transition duration-200"
              >
                Choose Image
              </label>
            </div>

            {image && (
              <div className="relative w-fit">
                <img
                  src={image}
                  alt="Blog Cover"
                  className="w-20 h-20 object-cover rounded-md"
                />

                <button
                  onClick={() => handleRemoveImage(setImage, "coverImage")}
                  className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-500 text-white text-xs rounded-full p-1 shadow-md"
                >
                  &times;
                </button>
              </div>
            )}

<span className="text-[12px] text-left text-[#353535] mt-1">(Image size: 1200x600) </span>


            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
          </div>

          {/* Writer Details */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium text-left">Writer Details</h2>

            {/* Writer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Writer Name
              </label>
              <input
                type="text"
                placeholder="Enter writer name"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Writer Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Writer Short Description
              </label>
              <input
                type="text"
                placeholder="Enter writer short description"
                value={writerShortName}
                onChange={(e) => setWriterShortName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Writer Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Writer Designation
              </label>
              <input
                type="text"
                placeholder="Enter writer designation"
                value={writerDesignation}
                onChange={(e) => setWriterDesignation(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Writer Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Writer Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setWriterImage, "writerImage")
                }
                className="hidden"
                id="writerImageUpload"
                ref={writerFileInputRef}
              />
              <div className="text-left">
                <label
                  htmlFor="writerImageUpload"
                  className="inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm 
              hover:bg-gray-900 hover:text-white cursor-pointer transition duration-200"
                >
                  Choose Image
                </label>
              </div>

              {writerImage && (
                <div className="relative w-fit mt-4">
                  <img
                    src={writerImage}
                    alt="Writer"
                    className="w-20 h-20 object-cover rounded-full mt-2"
                  />
                  <button
                    onClick={() =>
                      handleRemoveImage(setWriterImage, "writerImage")
                    }
                    className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-500 text-white text-xs rounded-full p-1 shadow-md"
                  >
                    &times;
                  </button>
                  <span className="text-[12px] text-left text-[#353535] mt-1">(Image size: 300x300) </span>

                </div>
              )}

              {writerImageError && (
                <p className="text-red-500 text-sm">{writerImageError}</p>
              )}
            </div>
            {/* Tag Input & Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Tag
              </label>
              <input
                type="text"
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Tag Dropdown */}
              {showDropdown && (
                <div className="bg-white border border-gray-300 rounded-md mt-1 shadow-md">
                  <button
                    className="w-full text-left p-2 hover:bg-gray-100"
                    onClick={handleAddTag}
                  >
                    Add "{tag}"
                  </button>
                </div>
              )}

              {/* Display Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/cms/blogs/blog-posts")}
            className="w-full p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
