import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Services/axios";

export default function EditBlogPost() {
  const { handle } = useParams();
  const coverFileInputRef = useRef(null);
  const writerFileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState("");
  const [writerName, setWriterName] = useState("");
  const [writerShortName, setWriterShortName] = useState("");
  const [writerImage, setWriterImage] = useState("");
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tag, setTag] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [imageError, setImageError] = useState("");
  const [writerImageError, setWriterImageError] = useState("");
  const [editSaveError, setEditSaveError] = useState("");
  const [blogFetchError, setBlogFetchError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog data based on handle
    const fetchBlogDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/admin/blogs/${handle}`
        );

        if (response.data.data.length <= 0) {
          return setBlogFetchError(
            `Blog with handle ${handle} does not exist.`
          );
        }
        const data = response.data.data.find((blog) => blog.handle === handle);

        setTitle(data.blogName);
        setContent(data.description);
        setIsPublished(data.isVisible);
        setPublishDate(data.publishDate);
        setImage(data.featureImage);
        setWriterName(data.writerName);
        setWriterShortName(data.writerShortname);
        setWriterImage(data.writerImage);
        setTags(data.tag);
      } catch (error) {
        return setBlogFetchError("Failed to fetch blog posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [isEditing]);

  const uploadImageToS3 = async (file) => {
    const formData = new FormData();
    formData.append("uploaded-file", file);

    try {
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

      console.log(
        { success: true, url: response.data.data.url },
        "{ success: true, url: response.data.data.url };"
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
        console.error("Image upload failed");
      }
    }
  };

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
    setTag("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };

  const handleRemoveImage = (setImageFunction, triggerBy) => {
    setImageFunction("");
    if (triggerBy === "coverImage" && coverFileInputRef.current) {
      coverFileInputRef.current.value = "";
    } else if (triggerBy === "writerImage" && writerFileInputRef.current) {
      writerFileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      const formData = {
        blogName: title,
        description: content,
        handle,
        isVisible: isPublished,
        publishDate,
        featureImage: image,
        writerName,
        writerShortname: writerShortName,
        writerImage,
        tag: tags,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BASE_URL}/admin/blogs`,
        JSON.stringify(formData),
        config
      );

      setIsEditing(false);
      alert("Blog post updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      setEditSaveError("Error saving blog post.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : blogFetchError.length > 0 ? (
        <div>{blogFetchError}</div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-left">Edit Blog Post</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Edit Post
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="w-full sm:w-auto p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            )}
          </div>

          {editSaveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mt-2">
              <p className="text-sm">{editSaveError}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6 h-[500px]">
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
                    disabled={!isEditing}
                  />
                </div>

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
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-medium text-left">Handle</h2>
                <input
                  type="text"
                  value={handle}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-medium text-left">Visibility</h2>
                <div className="flex items-center justify-between">
                  <span>{isPublished ? "Visible" : "Hidden"}</span>
                  <button
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex items-center h-6 w-12 rounded-full transition ${
                      isPublished ? "bg-green-500" : "bg-gray-300"
                    }`}
                    disabled={!isEditing}
                  >
                    <span
                      className={`inline-block w-5 h-5 transform bg-white rounded-full transition ${
                        isPublished ? "translate-x-6" : "translate-x-1"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-medium text-left">
                  Blog Cover Image
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImage, "coverImage")}
                  disabled={!isEditing}
                  className="hidden"
                  id="coverImageUploadEdit"
                  ref={coverFileInputRef}
                />

                <div className="text-left">
                  <label
                    htmlFor="coverImageUploadEdit"
                    className={`inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm 
             ${
               isEditing
                 ? "hover:bg-gray-900 hover:text-white cursor-pointer transition duration-200"
                 : ""
             } `}
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
                    {isEditing && (
                      <button
                        onClick={() =>
                          handleRemoveImage(setImage, "coverImage")
                        }
                        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-500 text-white text-xs rounded-full p-1 shadow-md"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                )}
                {imageError && (
                  <p className="text-red-500 text-sm">{imageError}</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-medium text-left">
                  Writer Details
                </h2>

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
                    disabled={!isEditing}
                  />
                </div>

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
                    disabled={!isEditing}
                  />
                </div>

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
                    disabled={!isEditing}
                    className="hidden"
                    id="writerImageUploadEdit"
                    ref={writerFileInputRef}
                  />

                  <div className="text-left">
                    <label
                      htmlFor="writerImageUploadEdit"
                      className={`inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                        isEditing
                          ? "hover:bg-gray-900 hover:text-white cursor-pointer transition duration-200"
                          : ""
                      }`}
                    >
                      Choose Image
                    </label>
                  </div>

                  {writerImage && (
                    <div className="relative w-fit mt-4">
                      <img
                        src={writerImage}
                        alt="Writer"
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      {isEditing && (
                        <button
                          onClick={() =>
                            handleRemoveImage(setWriterImage, "writerImage")
                          }
                          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-500 text-white text-xs rounded-full p-1 shadow-md"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  )}
                  {writerImageError && (
                    <p className="text-red-500 text-sm">{writerImageError}</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-medium text-left">Tags</h2>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
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
                  <div className="space-y-2 mt-4">
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm"
                        >
                          {tag}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveTag(index)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              &times;
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
