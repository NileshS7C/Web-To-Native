import React, { useEffect, useState } from 'react';
import { useGetAllEvents } from '../Hooks/SocialEventsHooks';
import SocialEventsListing from '../Component/SocialEvents/SocialEventsListing';
import EventSearch from '../Component/SocialEvents/EventSearch';
import EventListingFilters from '../Component/SocialEvents/EventListingFilters';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pagination } from '../Component/Common/Pagination';

const SocialEvents = () => {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ id: 'all' });
  const limit = 10;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { data, isLoading, isError, isFetching, error } = useGetAllEvents(
    page, 
    limit, 
    user?.id,
    activeFilter.id !== 'all' ? activeFilter : {}
  );

  useEffect(() => {
    if (data && !isFetching && !isSearching) {
      setEvents(data?.events || []);
      setTotalEvents(data?.total || 0);
    }
  }, [data, isFetching, isSearching]);

  const handleAddEvent = () => {
    navigate("/social-events/add");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchResults = (searchResults, total) => {
    if (searchResults !== null) {
      setEvents(searchResults);
      setTotalEvents(total);
      setIsSearching(true);
    } else {
      // Reset to original data when search is cleared
      setEvents(data?.events || []);
      setTotalEvents(data?.total || 0);
      setIsSearching(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page when filter changes
    setIsSearching(false); // Reset search when filter changes
  };

  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='inline-flex items-center gap-2.5 text-[#343C6A] font-semibold text-base md:text-[22px]'>
          Social Events
        </h1>
        <button
          className='bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400 px-4 py-2'
          onClick={handleAddEvent}
        >
          Add New Event
        </button>
      </div>

      <EventSearch 
        onSearchResults={handleSearchResults}
        currentPage={page}
        limit={limit}
      />

      <EventListingFilters 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isLoading && <p className='text-gray-500 mt-4'>Loading events...</p>}
      {isError && <p className='text-red-500 mt-4'>Error: {error?.message || 'Something went wrong!'}</p>}
      {!isLoading && !isError && <SocialEventsListing events={events} />}

      {!isLoading && !isError && totalEvents > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            total={totalEvents}
            onPageChange={handlePageChange}
            rowsInOnePage={limit}
          />
        </div>
      )}
    </>
  );
};

export default SocialEvents;
