import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogPosts() {
  const navigate = useNavigate();

  const addNewBlogHandler = () => {
    navigate(`/cms/blogs/blog-posts/new`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="sm:flex-auto text-left lg:flex">
        <div className="text-base font-semibold text-gray-900">Blog posts</div>

        <div className="w-[40%] flex">
          <button
            type="button"
            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
            onClick={() => addNewBlogHandler()}
          >
            Add blog post
          </button>
        </div>
      </div>
    </div>
  );
}
