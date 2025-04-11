import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosInstance from '../../../../Services/axios';
import { useSelector ,useDispatch} from 'react-redux';
import Spinner from '../../../Common/Spinner';
import { getAllVenues } from '../../../../redux/Venue/venueActions';
import { onPageChange } from '../../../../redux/Venue/getVenues';
import { venueLimit } from '../../../../Constant/venue';
 import useDebounce from '../../../../Hooks/useDebounce';
 import { searchIcon } from '../../../../Assests';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
const Pagination=({dispatch,currentPage,total,onPageChange,rowsInOnePage})=>{
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
} 
const SearchVenue = ({
  dispatch,
  venueName,
  setVenueName,
  currentPage,
  limit
}) => {
  const [searchVenue, setSearchVenue] = useState("");
  const debouncedValue = useDebounce(searchVenue, 300);

  const handleSearchVenue = (e) => {
    setSearchVenue(e?.target?.value);
    setVenueName(e?.target?.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch(
        getAllVenues({
          currentPage,
          limit,
          name: debouncedValue,
        })
      );
    }
  }, [debouncedValue, currentPage]);

  return (
    <div className="relative w-full">
      <img
        src={searchIcon}
        alt="search Venue"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Search Venues"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={venueName}
        onChange={handleSearchVenue}
      />
    </div>
  );
};

export default function VenueListingModal({ venuesCMSData, isOpen, onClose,fetchHomepageSections }) {
    
    const [selectedItems, setSelectedItems] = useState([]);
    const dispatch = useDispatch();
    const [venueName,setVenueName]=useState("");
    const handleSelectItem = (item) => {
        setSelectedItems(prevSelected => {
            if (prevSelected?.some(selectedItem => selectedItem._id === item._id)) {
                return prevSelected.filter(selectedItem => selectedItem._id !== item._id);
            } else {
                return [...prevSelected, item];
            }
        });
    };
    
    const { venues, totalVenues, isLoading, isSuccess, currentPage } =useSelector((state) => state.getVenues);
    useEffect(() => {
        dispatch(
          getAllVenues({
            currentPage,
            selectedFilter:"Published",
            limit: venueLimit,
            name:venueName
          })
        );
    }, [
      currentPage,
      isSuccess,
      venueName
    ]);
  

 
    const handleSave = async () => {

        const formattedData = selectedItems.map((item, index) => ({
            venueID: item._id,
            position: index,
        }));

        const payload = {
            sectionTitle: venuesCMSData.sectionTitle,
            isVisible: venuesCMSData.isVisible,
            venues: formattedData,
        };

        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/venues`, JSON.stringify(payload),config);
        } catch (error) {
            console.error("Error updating tournaments:", error);
        }
        fetchHomepageSections();
        onClose();
    };
    
    const handleDiscard = () => {
        setVenueName("");
        onClose();
    };
  
    useEffect(() => {
      if (venuesCMSData?.venues) {
        setSelectedItems(venuesCMSData?.venues.map((venue) => venue?.venueID));
      }
    }, [venuesCMSData]);
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="modal-content w-[70%] h-[90vh] mx-auto p-4 bg-white rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[100%]">
                  <Spinner />
                </div>
              ) : (
                <>
                  <SearchVenue
                    dispatch={dispatch}
                    venueName={venueName}
                    setVenueName={setVenueName}
                    currentPage={currentPage}
                    limit={venueLimit}
                  ></SearchVenue>
                  <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 min-h-[60vh] max-h-[60vh] rounded-lg border border-gray-300 p-2">
                    {venues?.length > 0 ? (
                      venues.map((item, index) => (
                        <div
                          key={item._id}
                          className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
            ${
              selectedItems?.some(
                (selectedItem) => selectedItem?._id === item._id
              )
                ? "bg-blue-100 border-[#1570EF]"
                : "hover:bg-gray-100"
            }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems?.some(
                              (selectedItem) => selectedItem._id === item._id
                            )}
                            onChange={() => handleSelectItem(item)}
                            className="checkbox accent-blue-500"
                          />
                          <div className="items-center flex flex-row justify-between w-full text-left gap-4">
                            <p className="w-[10%]">{index + 1}</p>
                            <h4 className="w-[40%]">{item.name}</h4>
                            <p className="w-[40%] line-clamp-1">
                              {item.handle}
                            </p>
                            <p className="w-[10%]">{item.address.city}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No venues available</p>
                    )}
                  </div>

                  <div className="modal-footer flex flex-col gap-2">
                    {totalVenues > venueLimit && (
                      <Pagination
                        dispatch={dispatch}
                        currentPage={currentPage}
                        total={totalVenues}
                        onPageChange={onPageChange}
                        rowsInOnePage={venueLimit}
                      />
                    )}
                    <div className="flex justify-end gap-5">
                      <button
                        onClick={handleDiscard}
                        className="px-4 py-2 bg-gray-400 rounded-md"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    );
}
