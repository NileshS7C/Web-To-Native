import { useDispatch } from "react-redux";
import React from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Pagination = ({
  currentPage,
  total,
  onPageChange,
  hasLink = false,
  pathName = "",
  rowsInOnePage = 10,
}) => {
  const dispatch = useDispatch();
  const totalPages = Math.ceil(total / rowsInOnePage);
  const updateQueryString = (value) => {
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(value).forEach(([key, value]) => {
      searchParams.set(key, value);
    });

    return searchParams.toString();
  };
  const generatePages = () => {
    const pages = [];
    const range = 2;
    const start = Math.max(1, Number(currentPage) - range);
    const end = Math.min(totalPages, Number(currentPage) + range);

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
        {!hasLink && (
          <button
            onClick={() => {
              dispatch(onPageChange(Number(currentPage) - 1));
            }}
            disabled={currentPage === 1}
            className={`inline-flex items-center border-t-2 border-transparent md:pr-1 pt-4 text-xs md:text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <ArrowLongLeftIcon
              aria-hidden="true"
              className="mr-3 size-4 md:size-5"
            />
            Previous
          </button>
        )}

        {hasLink && Number(currentPage) > 1 && (
          <Link
            to={{
              pathname: !pathName ? "/tournaments" : pathName,
              search: updateQueryString({
                page: (Number(currentPage) - 1).toString(),
              }),
            }}
            className={`inline-flex items-center border-t-2 border-transparent md:pr-1 pt-4 text-xs md:text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed hidden"
                : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <ArrowLongLeftIcon
              aria-hidden="true"
              className="mr-3 size-4 md:size-5"
            />
            Previous
          </Link>
        )}
      </div>

      <div className="mb-12 md:mb-0  md:flex">
        {pages.map((page, index) => (
          <React.Fragment key={`page_${page}`}>
            {hasLink && page !== "..." ? (
              <Link
                to={{
                  pathname: !pathName ? "/tournaments" : pathName,
                  search: updateQueryString({ page: page.toString() }),
                }}
                className={`inline-flex items-center border-t-2 px-[6px] md:px-4 pt-4 text-sm font-medium ${
                  page === Number(currentPage)
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {page}
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (page !== "...") {
                    dispatch(onPageChange(page));
                  }
                }}
                className={`inline-flex items-center border-t-2 px-2 md:px-4 pt-4 text-sm font-medium ${
                  page === currentPage
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className=" flex w-0 flex-1 justify-end">
        {!hasLink && (
          <button
            onClick={() => dispatch(onPageChange(Number(currentPage) + 1))}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center border-t-2 border-transparent md:pl-1 pt-4 text-xs md:text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Next
            <ArrowLongRightIcon
              aria-hidden="true"
              className="ml-1 md:ml-3 size-4 md:size-5"
            />
          </button>
        )}

        {hasLink && Number(currentPage) !== totalPages && (
          <Link
            to={{
              pathname: !pathName ? "/tournaments" : pathName,
              search: updateQueryString({
                page: (Number(currentPage) + 1).toString(),
              }),
            }}
            className={`inline-flex items-center border-t-2 border-transparent md:pr-1 pt-4 text-xs md:text-sm font-medium ${
              Number(currentPage) === totalPages
                ? "text-gray-300 cursor-not-allowed hidden"
                : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Next
            <ArrowLongRightIcon
              aria-hidden="true"
              className="ml-1 md:ml-3 size-4 md:size-5"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  rowsInOnePage: PropTypes.number,
};
