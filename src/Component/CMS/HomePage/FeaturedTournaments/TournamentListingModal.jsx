import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosInstance from "../../../../Services/axios";
import Spinner from "../../../Common/Spinner";
import useDebounce from "../../../../Hooks/useDebounce";
import { searchIcon } from "../../../../Assests";
import { tournamentLimit } from "../../../../Constant/tournament";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

const Pagination = ({ currentPage, total, onPageChange, rowsInOnePage }) => {
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
            onPageChange(Number(currentPage) - 1);
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
                  onPageChange(page);
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
          onClick={() => onPageChange(Number(currentPage) + 1)}
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

const SearchInput = ({ searchValue, searchHandler, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 200);

  const handleSearch = (e) => {
    setSearchTerm(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue !== undefined) {
      searchHandler(debouncedValue);
    }
  }, [debouncedValue, searchHandler]);

  useEffect(() => {
    if (!searchTerm) {
      searchHandler("");
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder={placeholder}
        className="w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default function TournamentListingModal({
  tournamentData,
  isOpen,
  onClose,
  fetchHomepageSections,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [alreadySelected, setAlreadySelected] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTab, setSelectedTab] = useState("tournaments"); // "tournaments" or "events"

  useEffect(() => {
    if (isOpen) {
      if (selectedTab === "tournaments") {
        GetAllTournaments();
      } else {
        GetAllEvents();
      }
    } else if (!isOpen) {
      setSearchTerm("");
      setSelectedTab("tournaments");
      setCurrentPage(1);
    }
  }, [isOpen, selectedTab]);

  useEffect(() => {
    if (searchTerm) {
      if (selectedTab === "tournaments") {
        getSearchTournaments();
      } else {
        getSearchEvents();
      }
    } else if (searchTerm === "") {
      if (selectedTab === "tournaments") {
        GetAllTournaments();
      } else {
        GetAllEvents();
      }
    }
  }, [searchTerm, currentPage, selectedTab]);

  const GetAllTournaments = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/public/tournaments?page=${currentPage}&limit=${tournamentLimit}`,
        config
      );

      setItemsData(response.data.data.tournaments);
      setTotalItems(response?.data?.data?.total || 0);
      
      // Set already selected tournaments
      if (tournamentData?.events) {
        const formattedSelected = tournamentData.events
          .filter(item => item.event?.eventType === "tournament")
          .map(item => item.event);
        setAlreadySelected(formattedSelected);
        setSelectedItems(formattedSelected);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GetAllEvents = async (page = currentPage) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/events?status=PUBLISHED&page=${page}&limit=10`,
        config
      );
      setItemsData(response.data.data.events);
      setTotalItems(response?.data?.data?.total || 0);
      
      // Set already selected events
      if (tournamentData?.events) {
        const formattedSelected = tournamentData.events
          .filter(item => item.event?.eventType === "socialEvents")
          .map(item => item.event);
        setAlreadySelected(formattedSelected);
        setSelectedItems(formattedSelected);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchTournaments = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/public/tournaments/search?search=${searchTerm}&page=${currentPage}&limit=${tournamentLimit}`,
        config
      );

      setItemsData(response.data.data.tournaments);
      setTotalItems(response?.data?.data?.total || 0);
    } catch (error) {
      console.error("Error searching tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchEvents = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/events/search?search=${searchTerm}&page=${currentPage}&limit=10`,
        config
      );

      setItemsData(response.data.data.events);
      setTotalItems(response?.data?.data?.total || 0);
    } catch (error) {
      console.error("Error searching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.some((selectedItem) => selectedItem._id === item._id)) {
        return prevSelected.filter(
          (selectedItem) => selectedItem._id !== item._id
        );
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleSave = async () => {
    // Combine existing items from other tab with new selections
    const existingOtherTabItems = tournamentData?.events?.filter(item => 
      selectedTab === "tournaments" 
        ? item.event?.eventType === "socialEvents"
        : item.event?.eventType === "tournament"
    ) || [];

    const newSelectedItems = selectedItems.map((item, index) => ({
      ...(selectedTab === "tournaments" 
        ? { tournamentID: item._id } 
        : { eventID: item._id }),
      position: existingOtherTabItems.length + index,
    }));

    const existingOtherTabFormatted = existingOtherTabItems.map((item, index) => ({
      ...(item.event?.eventType === "tournament"
        ? { tournamentID: item.event._id }
        : { eventID: item.event._id }),
      position: index,
    }));

    const allEvents = [...existingOtherTabFormatted, ...newSelectedItems];

    const payload = {
      sectionTitle: tournamentData.sectionTitle,
      isVisible: tournamentData.isVisible,
      events: allEvents,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/event`,
        JSON.stringify(payload),
        config
      );
    } catch (error) {
      console.error("Error updating events:", error);
    }

    fetchHomepageSections();
    onClose();
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDiscard = () => {
    setSelectedItems(alreadySelected);
    onClose();
  };

  const searchHandler = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const renderItemCard = (item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );

    if (selectedTab === "tournaments") {
      return (
        <div
          key={item._id}
          className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
          ${isSelected ? "bg-blue-100 border-[#1570EF]" : "hover:bg-gray-100"}`}
          onClick={() => handleSelectItem(item)}
        >
          <input
            type="checkbox"
            checked={isSelected}
            className="checkbox accent-blue-500 cursor-pointer"
            readOnly
          />
          <div className="item-details flex flex-row justify-between w-full text-left gap-4">
            <h4 className="w-[40%] font-medium">{item.tournamentName}</h4>
            <p className="w-[40%] text-gray-600">{item.handle}</p>
            <p className="w-[10%] text-gray-600">{item.startDate}</p>
            <p className="w-[10%] text-gray-600">{item.endDate}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={item._id}
          className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
          ${isSelected ? "bg-blue-100 border-[#1570EF]" : "hover:bg-gray-100"}`}
          onClick={() => handleSelectItem(item)}
        >
          <input
            type="checkbox"
            checked={isSelected}
            className="checkbox accent-blue-500 cursor-pointer"
            readOnly
          />
          <div className="item-details flex flex-row justify-between w-full text-left gap-4">
            <h4 className="w-[40%] font-medium">{item.eventName}</h4>
            <p className="w-[40%] text-gray-600">{item.handle}</p>
            <p className="w-[10%] text-gray-600">{item.startDate}</p>
            <p className="w-[10%] text-gray-600">{item.startTime} - {item.endTime}</p>
          </div>
        </div>
      );
    }
  };

  const renderMobileCard = (item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );

    if (selectedTab === "tournaments") {
      return (
        <div
          key={item._id}
          className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border ${
            isSelected ? "border-[#1570EF] bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => handleSelectItem(item)}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                className="checkbox accent-blue-500 cursor-pointer h-5 w-5"
                readOnly
              />
              <h4 className="font-medium text-[#2B2F38] truncate max-w-[85%]">
                {item.tournamentName}
              </h4>
            </div>
          </div>
          
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">Handle:</span>
              <span className="text-gray-600 text-right truncate max-w-[70%]">{item.handle}</span>
            </div>
            
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">Start Date:</span>
              <span className="text-gray-600">{item.startDate}</span>
            </div>
            
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">End Date:</span>
              <span className="text-gray-600">{item.endDate}</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={item._id}
          className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border ${
            isSelected ? "border-[#1570EF] bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => handleSelectItem(item)}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                className="checkbox accent-blue-500 cursor-pointer h-5 w-5"
                readOnly
              />
              <h4 className="font-medium text-[#2B2F38] truncate max-w-[85%]">
                {item.eventName}
              </h4>
            </div>
          </div>
          
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">Handle:</span>
              <span className="text-gray-600 text-right truncate max-w-[70%]">{item.handle}</span>
            </div>
            
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">Start Date:</span>
              <span className="text-gray-600">{item.startDate}</span>
            </div>
            
            <div className="flex justify-between items-center gap-3 px-4 py-3">
              <span className="font-medium text-black">Time:</span>
              <span className="text-gray-600">{item.startTime} - {item.endTime}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-center justify-start p-4 text-center sm:items-center sm:p-0 overflow-x-auto">
          <DialogPanel className="modal-content w-full md:w-[90%] mx-auto p-4 bg-white rounded-lg md:min-w-[950px]">
            
            {/* Tab Selection */}
            <div className="mb-6 flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedTab("tournaments")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTab === "tournaments"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Add Tournaments
              </button>
              <button
                onClick={() => setSelectedTab("events")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTab === "events"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Add Social Events
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <SearchInput
                searchValue={searchTerm}
                searchHandler={searchHandler}
                placeholder={`Search ${selectedTab === "tournaments" ? "Tournaments" : "Events"}`}
              />
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh] rounded-lg border border-gray-300 my-4">
                <Spinner />
              </div>
            ) : (
              <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 h-[60vh] rounded-lg border border-gray-300 p-2">
                {itemsData.length > 0 ? (
                  <>
                    {/* Desktop View */}
                    <div className="hidden md:flex md:flex-col md:gap-2">
                      {itemsData.map((item) => renderItemCard(item))}
                    </div>
                    
                    {/* Mobile View */}
                    <div className="md:hidden flex flex-col gap-3">
                      {itemsData.map((item) => renderMobileCard(item))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No {selectedTab === "tournaments" ? "tournaments" : "events"} available
                  </p>
                )}
              </div>
            )}
            
            {/* Footer */}
            <div className="modal-footer flex flex-col gap-2">
              {totalItems > (selectedTab === "tournaments" ? tournamentLimit : 10) && (
                <Pagination
                  currentPage={currentPage}
                  total={totalItems}
                  onPageChange={onPageChange}
                  rowsInOnePage={selectedTab === "tournaments" ? tournamentLimit : 10}
                />
              )}
              <div className="flex justify-end gap-5">
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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