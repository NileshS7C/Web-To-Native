import React from "react";
import { useNavigate } from "react-router-dom";

export default function BlogTable({ blogs }) {
  const navigate = useNavigate();

  const columns = [
    { key: "blogName", label: "Blog Name" },
    { key: "writerName", label: "Author" },
    { key: "publishDate", label: "Publish Date" },
  ];

  return (
    <div className="overflow-hidden shadow-xl rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-sm font-medium text-gray-700 text-left"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-sm font-medium text-gray-700 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogs.map((blog) => (
            <tr key={blog._id}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-sm text-gray-600 text-left"
                >
                  {blog[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-700 text-left">
                <button
                  onClick={() =>
                    navigate(`/cms/blogs/blog-posts/${blog.handle}`)
                  }
                  className="font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
