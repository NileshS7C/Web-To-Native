import React, { useEffect, useState } from 'react';
import { useSearchEvents } from '../../Hooks/SocialEventsHooks';
import { useSelector } from 'react-redux';
import { useSearchDebounce } from '../../Hooks/useSearchDebounce';

const EventSearch = ({ onSearchResults, currentPage, limit, activeFilter = {}, onSearch}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const ownerId = userInfo?.id;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useSearchDebounce(searchTerm, 500);

  const { data, isLoading, isError, error } = useSearchEvents({
    ownerId, 
    searchTitle: debouncedSearch,
    page: currentPage,
    limit: limit,
    filters: activeFilter.id !== 'all' ? activeFilter : {}
  });

  useEffect(() => {
    if (debouncedSearch && data) {
      onSearchResults(data?.events || [], data?.total || 0);
    }
    if (!debouncedSearch) {
      onSearchResults(null, 0);
    }
  }, [debouncedSearch, data, onSearchResults]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    onSearch(searchTerm);
  }
  return (
    <div className="mt-4 md:w-[40%]">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-4 py-2 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && <p className="text-gray-500 mt-2">Searching...</p>}
      {isError && <p className="text-red-500 mt-2">Search failed: {error?.message || 'Try again later.'}</p>}
    </div>
  );
};

export default EventSearch;
