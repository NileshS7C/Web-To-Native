
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BlogTable({ blogs }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden shadow-xl rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-sm font-medium text-gray-700 text-left">Blog Name</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-700 text-left">Author</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-700 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogs.map((blog, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-600">{blog.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
              <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-700">
                <button
                  onClick={() => navigate(`/cms/blogs/blog-posts/${blog.id}`)}
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
