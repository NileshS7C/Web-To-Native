import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogTable from "../../../Component/CMS/BlogPage/BlogTable.jsx";
import axiosInstance from "../../../Services/axios";

export default function BlogPosts() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/blogs?page=${page}&limit=${limit}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch blog posts.");
        }

        setBlogs(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        if (error?.response?.data?.errors?.length > 0) {
          setError(error?.response?.data?.errors[0]?.message);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, limit]);

  const addNewBlogHandler = () => {
    navigate(`/cms/blogs/blog-posts/new`);
  };
  if (error) {
    return (
      <div className="text-center text-lg text-gray-500">
        Could not fetch blogs.
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit); // Total pages
  const paginationGroupSize = 5; // Show 5 pagination buttons at a time
  const currentGroup = Math.ceil(page / paginationGroupSize); // Determine the group

  // Calculate range of pages to display
  const startPage = (currentGroup - 1) * paginationGroupSize + 1;
  const endPage = Math.min(startPage + paginationGroupSize - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

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

      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No blogs found. Please add a blog.
        </div>
      ) : (
        <>
          <BlogTable blogs={blogs} />

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {/* Previous Group Button */}
            <button
              className="px-3 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
              onClick={() => setPage(startPage - paginationGroupSize)}
              disabled={startPage === 1}
            >
              &laquo;
            </button>

            {/* Page Numbers */}
            {pages.map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-2 text-sm rounded-md ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Group Button */}
            <button
              className="px-3 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
              onClick={() => setPage(endPage + 1)}
              disabled={endPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
