import React from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

const PlayerPagination = ({
  currentPage,
  total,
  onPageChange,
  rowsInOnePage = 10,
}) => {
  const totalPages = Math.ceil(total / rowsInOnePage);

  const generatePages = () => {
    const pages = [];
    const range = 2;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-1 md:px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent md:pr-1 pt-4 text-xs md:text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <ArrowLongLeftIcon className="mr-3 size-4 md:size-5" />
          Previous
        </button>
      </div>

      <div className="mb-12 md:mb-0 md:flex">
        {pages.map((page) => (
          <button
            key={`page_${page}`}
            onClick={() => page !== "..." && onPageChange(page)}
            className={`inline-flex items-center border-t-2 px-2 md:px-4 pt-4 text-sm font-medium ${
              page === currentPage
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent md:pl-1 pt-4 text-xs md:text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Next
          <ArrowLongRightIcon className="ml-1 md:ml-3 size-4 md:size-5" />
        </button>
      </div>
    </nav>
  );
};

export default PlayerPagination;
