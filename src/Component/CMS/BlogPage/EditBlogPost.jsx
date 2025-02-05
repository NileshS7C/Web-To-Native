import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Services/axios";

export default function EditBlogPost() {
  const { handle } = useParams();
  const params = useParams();

  const navigate = useNavigate();

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
  const [handleError, setHandleError] = useState("");
  const [saveError, setSaveError] = useState("");
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
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleImageChange = async (event, setImageFunction) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToS3(file);
      if (imageUrl) {
        setImageFunction(imageUrl);
      } else {
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

  const handleRemoveImage = (setImageFunction) => {
    setImageFunction("");
  };

  const handleSave = async () => {
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

    try {
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

      setIsEditing(false)
      alert("Blog post updated successfully!");
      // navigate("/cms/blogs/blog-posts");
    } catch (error) {
      console.error("Error:", error);
      setSaveError("Error saving blog post.");
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

          {saveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mt-2">
              <p className="text-sm">{saveError}</p>
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
                    style={{ height: "130px" }}
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
                  onChange={(e) => handleImageChange(e, setImage)}
                  disabled={!isEditing}
                />
                {image && (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Blog Cover"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveImage(setImage)}
                        className="absolute top-0 right-0 bg-gray-500 text-white text-xs rounded-full p-1"
                      >
                        &times;
                      </button>
                    )}
                  </div>
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
                    onChange={(e) => handleImageChange(e, setWriterImage)}
                    disabled={!isEditing}
                  />
                  {writerImage && (
                    <div className="relative">
                      <img
                        src={writerImage}
                        alt="Writer"
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveImage(setWriterImage)}
                          className="absolute top-0 right-0 bg-gray-500 text-white text-xs rounded-full p-1"
                        >
                          &times;
                        </button>
                      )}
                    </div>
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
                  {showDropdown && tag && (
                    <button
                      onClick={handleAddTag}
                      className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
                    >
                      Add Tag
                    </button>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
