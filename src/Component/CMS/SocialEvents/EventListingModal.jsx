import React, { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import axiosInstance from '../../../Services/axios'
import Spinner from '../../Common/Spinner'
import useDebounce from '../../../Hooks/useDebounce'
import { searchIcon } from '../../../Assests'
// import { eventLimit } from '../../../Constant/event'  =  10
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

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

const SearchEvent = ({ eventName, searchEventHandler }) => {
  const [searchEvent, setSearchEvent] = useState("");
  const debouncedValue = useDebounce(searchEvent, 200);

  const handleSearchEvent = (e) => {
    setSearchEvent(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue !== undefined) {
      searchEventHandler(debouncedValue);
    }
  }, [debouncedValue, searchEventHandler]);
  useEffect(()=>{
      if(!searchEvent){
         searchEventHandler("");
      }
  },[searchEvent])
  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search Event"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Search Events"
        className="w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchEvent}
        onChange={handleSearchEvent}
      />
    </div>
  );
};

const EventListingModal = ({ eventData, isOpen, onClose, fetchEventSections }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [alreadySelected, setAlreadySelected] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventName, setEventName] = useState("");
  const [totalEvent, setTotalEvent] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1); // Reset to first page when modal opens
      GetAllEvents(1); // Load first page
    } else if (!isOpen) {
      setEventName("");
      setCurrentPage(1);
    }
  }, [isOpen]);

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
      setEventsData(response.data.data.events);
      setTotalEvent(response?.data?.data?.total || 0);
      if (eventData?.featuredSocialEvents) {
        const formattedSelected = eventData.featuredSocialEvents.map(
          (item) => item
        );
        setAlreadySelected(formattedSelected);
        setSelectedItems(formattedSelected);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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
    const formattedData = selectedItems.map((item, index) => ({
      eventID: item._id,
      position: index,
    }));
    

    const payload = {
      sectionTitle: eventData.sectionTitle,
      isVisible: eventData.isVisible,
      featuredSocialEvents: formattedData,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/social-events/featuredSocialEvents`,
        JSON.stringify(payload),
        config
      );
      if (response.data?.data?.length) {
        const allEvents = response.data.data.flatMap(
          (section) => section.featuredSocialEvents
        );
        setEventsData(allEvents);
      }
    } catch (error) {
      console.error("Error updating events:", error);
    }

    fetchEventSections();
    onClose();
  };

  const getSearchEvents = async (page = currentPage) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/events/search?search=${eventName}&page=${page}&limit=10`,
        config
      );

      setEventsData(response.data.data.featuredSocialEvents);
      setTotalEvent(response?.data?.data?.total || 0);
      if (eventData?.featuredSocialEvents) {
        const formattedSelected = eventData.featuredSocialEvents.map(
          (item) => item
        );
        setAlreadySelected(formattedSelected);
        setSelectedItems(formattedSelected);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleDiscard = () => {
    setSelectedItems(alreadySelected);
    onClose();
  };

  const searchEventHandler = (name) => {
    setEventName(name);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Updated useEffect to handle pagination properly
  useEffect(() => {
    if (isOpen) {
      if (eventName) {
        getSearchEvents(currentPage);
      } else {
        GetAllEvents(currentPage);
      }
    }
  }, [eventName, currentPage]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-center justify-start p-4 text-center sm:items-center sm:p-0 overflow-x-auto">
          <DialogPanel className="modal-content w-full md:w-[90%] mx-auto p-4 bg-white rounded-lg md:min-w-[950px]">
            <div className="mb-4">
              <SearchEvent
                eventName={eventName}
                searchEventHandler={searchEventHandler}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh] rounded-lg border border-gray-300 my-4">
                <Spinner />
              </div>
            ) : (
              <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 h-[60vh] rounded-lg border border-gray-300 p-2">
                {eventsData.length > 0 ? (
                  <>
                    {/* Desktop View */}
                    <div className="hidden md:flex md:flex-col md:gap-2">
                      {eventsData.map((item) => (
                        <div
                          key={item._id}
                          className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
                         ${selectedItems.some(
                            (selectedItem) => selectedItem._id === item._id
                          )
                              ? "bg-blue-100 border-[#1570EF]"
                              : "hover:bg-gray-100"
                            }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.some(
                              (selectedItem) => selectedItem._id === item._id
                            )}
                            className="checkbox accent-blue-500 cursor-pointer"
                          />
                          <div className="item-details flex flex-row justify-between w-full text-left gap-4">
                            <h4 className="w-[40%] font-medium">
                              {item.eventName}
                            </h4>
                            <p className="w-[40%] text-gray-600">{item.handle}</p>
                            <p className="w-[10%] text-gray-600">
                              {item.startDate}
                            </p>
                            <p className="w-[10%] text-gray-600">{item.endDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Mobile View - Card Style */}
                    <div className="md:hidden flex flex-col gap-3">
                      {eventsData.map((item) => (
                        <div
                          key={item._id}
                          className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border ${selectedItems.some(
                            (selectedItem) => selectedItem._id === item._id
                          )
                              ? "border-[#1570EF] bg-blue-50"
                              : "border-gray-200"
                            }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.some(
                                  (selectedItem) => selectedItem._id === item._id
                                )}
                                className="checkbox accent-blue-500 cursor-pointer h-5 w-5"
                                onChange={() => { }} // Empty onChange to avoid React warning
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
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No tournaments available
                  </p>
                )}
              </div>
            )}

            <div className="modal-footer flex flex-col gap-2">
              {totalEvent > 10 && (
                <Pagination
                  currentPage={currentPage}
                  total={totalEvent}
                  onPageChange={onPageChange}
                  rowsInOnePage={10}
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
  )
}

export default EventListingModal