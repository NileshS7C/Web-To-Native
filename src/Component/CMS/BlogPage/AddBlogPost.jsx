import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [handle, setHandle] = useState(""); // New state for Handle Label
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState(null);
  const [writerName, setWriterName] = useState("");
  const [writerShortName, setWriterShortName] = useState("");
  const [writerImage, setWriterImage] = useState(null);
  const [tag, setTag] = useState("");

  // Handle Image Upload
  const handleImageChange = (event, setImageFunction) => {
    const file = event.target.files[0];
    if (file) {
      setImageFunction(URL.createObjectURL(file)); // Preview the image
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Add Blog Post</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          {/* Title & Content Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6 h-[500px]">
            {/* Title Input */}
            <div>
              <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="blogTitle"
                name="blogTitle"
                placeholder="Give your blog post a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <ReactQuill theme="snow" value={content} onChange={setContent} className="mt-1" style={{ height: "130px" }} />
            </div>
          </div>

          {/* Handle Label Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium">Handle Label</h2>
            <input
              type="text"
              placeholder="Enter handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Visibility Toggle */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium">Visibility</h2>
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium">Blog Cover Image</h2>
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage)} />
            {image && <img src={image} alt="Blog Cover" className="w-full h-40 object-cover rounded-md" />}
          </div>

          {/* Writer Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-medium">Writer Details</h2>

            {/* Writer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Writer Name</label>
              <input
                type="text"
                placeholder="Enter writer name"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Writer Short Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Writer Short Name</label>
              <input
                type="text"
                placeholder="Enter writer short name"
                value={writerShortName}
                onChange={(e) => setWriterShortName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Writer Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Writer Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setWriterImage)} />
              {writerImage && (
                <img src={writerImage} alt="Writer" className="w-20 h-20 object-cover rounded-full mt-2" />
              )}
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <input
                type="text"
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

