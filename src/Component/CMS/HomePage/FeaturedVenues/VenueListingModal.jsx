import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosInstance from "../../../../Services/axios";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../../Common/Spinner";
import {
  getAllVenues,
  getSearchVenues,
} from "../../../../redux/Venue/venueActions";
import { onPageChange } from "../../../../redux/Venue/getVenues";
import { venueLimit } from "../../../../Constant/venue";
import useDebounce from "../../../../Hooks/useDebounce";
import { searchIcon } from "../../../../Assests";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

const Pagination = ({
  dispatch,
  currentPage,
  total,
  onPageChange,
  rowsInOnePage,
}) => {
  const totalPages = Math.ceil(total / rowsInOnePage);
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
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => {
            dispatch(onPageChange(Number(currentPage) - 1));
          }}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <ArrowLongLeftIcon aria-hidden="true" className="mr-3 size-5" />
          Previous
        </button>
      </div>

      <div className="hidden md:-mt-px md:flex">
        {pages.map((page, index) => (
          <React.Fragment key={`page_${page}`}>
            <button
              onClick={() => {
                if (page !== "...") {
                  dispatch(onPageChange(page));
                }
              }}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                page === currentPage
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => dispatch(onPageChange(Number(currentPage) + 1))}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Next
          <ArrowLongRightIcon aria-hidden="true" className="ml-3 size-5" />
        </button>
      </div>
    </nav>
  );
};

const SearchVenue = ({
  dispatch,
  venueName,
  setVenueName,
  currentPage,
  limit,
}) => {
  const [searchVenue, setSearchVenue] = useState("");
  const debouncedValue = useDebounce(searchVenue, 200);
  const handleSearchVenue = (e) => {
    setSearchVenue(e?.target?.value);
    setVenueName(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch(
        getSearchVenues({
          currentPage,
          selectedFilter: "Published",
          limit,
          name: debouncedValue
        })
      );
    }
  }, [debouncedValue, currentPage, dispatch, limit]);

  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search Venue"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Search Venues"
        className="w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={venueName}
        onChange={handleSearchVenue}
      />
    </div>
  );
};

export default function VenueListingModal({
  venuesCMSData,
  isOpen,
  onClose,
  fetchHomepageSections,
}) {
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const dispatch = useDispatch();
  const [venueName, setVenueName] = useState("");
  const { venues, totalVenues, isLoading, isSuccess, currentPage } =
    useSelector((state) => state.getVenues);

  // Initialize selected venues from venuesCMSData
  useEffect(() => {
    if (venuesCMSData?.venues && venuesCMSData.venues.length > 0) {
      const venueIDs = venuesCMSData.venues.map(
        (venue) => venue.venueID._id || venue.venueID
      );
      setSelectedVenueIds(venueIDs);

      // Store full venue objects for the API payload
      const venueObjects = venuesCMSData.venues
        .map((venue) => {
          // Check if venueID is an object or just the ID
          const venueObj = venue.venueID._id
            ? venue.venueID
            : venues.find((v) => v._id === venue.venueID);
          return venueObj;
        })
        .filter(Boolean);

      setSelectedVenues(venueObjects);
    }
  }, [venuesCMSData, venues]);

  // Handle selecting/deselecting a venue
  const handleSelectItem = (item) => {
    setSelectedVenueIds((prevIds) => {
      if (prevIds.includes(item._id)) {
        // Remove from selected IDs
        setSelectedVenues((prev) =>
          prev.filter((venue) => venue._id !== item._id)
        );
        return prevIds.filter((id) => id !== item._id);
      } else {
        // Add to selected IDs
        setSelectedVenues((prev) => [...prev, item]);
        return [...prevIds, item._id];
      }
    });
  };

  // Fetch venues when component mounts or filters change
  useEffect(() => {
    if (!venueName) {
      dispatch(
        getAllVenues({
          currentPage,
          selectedFilter: "Published",
          limit: venueLimit,
          name: venueName,
        })
      );
    }
  }, [currentPage, isSuccess, venueName, dispatch]);

  // Handle save action
  const handleSave = async () => {
    try {
      const formattedData = selectedVenues.map((item, index) => ({
        venueID: item._id,
        position: index,
      }));

      const payload = {
        sectionTitle: venuesCMSData.sectionTitle,
        isVisible: venuesCMSData.isVisible,
        venues: formattedData,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/venues`,
        JSON.stringify(payload),
        config
      );

      fetchHomepageSections();
      handleDiscard();
    } catch (error) {
      console.error("Error updating venues:", error);
      // Consider adding error handling UI here
    }
  };

  // Handle discard action
  const handleDiscard = () => {
    setVenueName("");
    onClose();
  };
  useEffect(() => {
    if (!isOpen) {
      setVenueName("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
      <div className="flex min-h-full items-center sm:items-center justify-center p-4 sm:p-0">
        <DialogPanel className="w-full sm:min-w-[950px] max-w-[95%] sm:w-[90%] h-[90vh] mx-auto p-2 sm:p-4 bg-white rounded-lg shadow-xl transform transition-all">
            <SearchVenue
              dispatch={dispatch}
              venueName={venueName}
              setVenueName={setVenueName}
              currentPage={currentPage}
              limit={venueLimit}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh] rounded-lg border border-gray-300 my-4">
                <Spinner />
              </div>
            ) : (
              <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 h-[60vh] rounded-lg border border-gray-300 p-2">
                {venues?.length > 0 ? (
                  <>
                  {/* Desktop View */}
                  <div className="hidden md:flex md:flex-col md:gap-2">
                    {venues.map((item) => (
                      <div
                        key={item._id}
                        className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
                          ${
                            selectedVenueIds.includes(item._id)
                              ? "bg-blue-100 border-[#1570EF]"
                              : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedVenueIds.includes(item._id)}
                          onChange={() => {}} // Handled by parent div click
                          className="checkbox accent-blue-500 flex-shrink-0"
                        />
                        <div className="items-center flex flex-row justify-between w-full text-left gap-4">
                          <h4 className="w-[40%] truncate">{item.name}</h4>
                          <p className="w-[40%] line-clamp-1">{item.handle}</p>
                          <p className="w-[10%]">{item.address?.city || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                    </div>
                     {/* Mobile View - Card Style */}
                     <div className="md:hidden flex flex-col gap-3">
                      {venues.map((item) => (
                        <div
                          key={item._id}
                          className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border ${
                            selectedVenueIds.includes(item._id)
                              ? "border-[#1570EF] bg-blue-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className="flex items-center justify-between px-3 py-3 bg-gray-50">
                            <div className="flex items-center gap-2 w-full">
                              <input
                                type="checkbox"
                                checked={selectedVenueIds.includes(item._id)}
                                className="checkbox accent-blue-500 cursor-pointer h-4 w-4 flex-shrink-0"
                                onChange={() => {}}
                              />
                              <h4 className="font-medium text-[#2B2F38] truncate text-sm">
                                {item.name}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex flex-col divide-y divide-gray-100">
                            <div className="flex justify-between items-center gap-2 px-3 py-2">
                              <span className="text-sm font-medium text-black">Handle:</span>
                              <span className="text-sm text-gray-600 text-right truncate max-w-[60%]">{item.handle}</span>
                            </div>
                            
                            <div className="flex justify-between items-center gap-2 px-3 py-2">
                              <span className="text-sm font-medium text-black">City:</span>
                              <span className="text-sm text-gray-600">{item.address?.city || "N/A"}</span>
                            </div>
                            
                            {item.address?.state && (
                              <div className="flex justify-between items-center gap-2 px-3 py-2">
                                <span className="text-sm font-medium text-black">State:</span>
                                <span className="text-sm text-gray-600">{item.address.state}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-gray-500">
                      No venues available
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="modal-footer flex flex-col gap-2">
              {totalVenues > venueLimit ? (
                <Pagination
                  dispatch={dispatch}
                  currentPage={currentPage}
                  total={totalVenues}
                  onPageChange={onPageChange}
                  rowsInOnePage={venueLimit}
                />
              ) : (
                <div className="h-[30px]" />
              )}

              <div className="flex justify-end gap-2 sm:gap-5">
                <button
                  onClick={handleDiscard}
                  className="px-3 sm:px-4 py-2 bg-gray-400 text-white text-sm rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}