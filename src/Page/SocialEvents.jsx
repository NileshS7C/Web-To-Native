import React, { useEffect, useState } from 'react';
import { useGetAllEvents } from '../Hooks/SocialEventsHooks';
import SocialEventsListing from '../Component/SocialEvents/SocialEventsListing';
import EventSearch from '../Component/SocialEvents/EventSearch';
import { useNavigate } from 'react-router-dom';

const SocialEvents = () => {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, error } = useGetAllEvents(page, limit);

  useEffect(() => {
    if (data && !isFetching) {
      setEvents(data?.events || []);
    }
  }, [data, isFetching]);

  const handleAddEvent = () => {
    navigate("/social-events/add");
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

      <EventSearch onSearchResults={(searchResults) => {
        if (searchResults !== null) { // Explicit check for null
          setEvents(searchResults);
        } else {
          // Reset to original data when search is cleared
          setEvents(data?.events || []);
        }
      }} />

      {isLoading && <p className='text-gray-500 mt-4'>Loading events...</p>}
      {isError && <p className='text-red-500 mt-4'>Error: {error?.message || 'Something went wrong!'}</p>}
      {!isLoading && !isError && <SocialEventsListing events={events} />}
    </>
  );
};

export default SocialEvents;
