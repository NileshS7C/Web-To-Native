import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogTable from "../../../Component/CMS/BlogPage/BlogTable.jsx";

export default function BlogPosts() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // const response = await fetch("/api/blogs"); // Adjust the API URL as needed
        // if (!response.ok) {
        //   throw new Error("Failed to fetch blogs");
        // }
        // const data = await response.json();
        const data = [{ name: "f", author: "o", id: "99" }];
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const addNewBlogHandler = () => {
    navigate(`/cms/blogs/blog-posts/new`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between mb-4">
        <div className="text-2xl font-semibold text-gray-800">Blog Posts</div>
        <div className="w-[40%] flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={addNewBlogHandler}
          >
            Create Blog Post
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No blogs found. Please add a blog.
        </div>
      ) : (
        <BlogTable blogs={blogs} />
      )}
    </div>
  );
}
