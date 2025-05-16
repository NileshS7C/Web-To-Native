import React from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "../../../Assests/Venue/delete.svg";

export default function BlogTable({ blogs, deleteBlogHandler }) {
  const navigate = useNavigate();

  const columns = [
    { key: "blogName", header: "Blog Name" },
    { key: "writerName", header: "Author" },
    { key: "publishDate", header: "Publish Date" },
  ];

  return (
    <div className="overflow-hidden shadow-xl rounded-lg border border-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 hidden md:table-header-group">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-sm font-medium text-gray-700 text-left font-semibold"
              >
                {col.header}
              </th>
            ))}
            <th className="px-6 py-3 text-sm font-medium text-gray-700 text-left font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogs.map((blog) => (
            <tr 
              key={blog._id}
              className="cursor-pointer block text-sm text-gray-600 md:table-row md:shadow-none shadow-lg"
            >
              {/* Mobile card view */}
              <div className="md:hidden flex flex-col bg-white rounded-xl mb-4 shadow-md">
                {columns.map((column) => (
                  <div
                    key={`${blog._id}-${column.key}-mobile`}
                    className="flex justify-between items-center gap-3 px-4 py-3"
                  >
                    <span className="font-medium text-gray-700">
                      {column.header}:
                    </span>
                    <span className="text-gray-600">
                      {blog[column.key]}
                    </span>
                  </div>
                ))}
                <div className="flex justify-end gap-4 px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/cms/blogs/blog-posts/${blog.handle}`)}
                    className="text-blue-600 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlogHandler(blog.handle)}
                    className="text-red-600"
                  >
                    <img src={DeleteIcon} alt="delete blog" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop table view */}
              {columns.map((col) => (
                <td
                  key={`${blog._id}-${col.key}-desktop`}
                  className="px-6 py-4 text-sm text-gray-600 text-left hidden md:table-cell"
                >
                  {blog[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-sm text-left gap-3 flex hidden md:table-cell">
                <button
                  onClick={() => navigate(`/cms/blogs/blog-posts/${blog.handle}`)}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBlogHandler(blog.handle)}
                  className="font-medium ml-4"
                >
                  <img src={DeleteIcon} alt="delete blog" />
                </button>
              </td>
            </tr>
          ))}
          
          {blogs.length === 0 && (
            <tr>
              <td 
                colSpan={columns.length + 1} 
                className="px-6 py-4 text-center text-gray-500"
              >
                No blogs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}