import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAllEventBookings } from '../../../api/TournamentEvents';

const SearchBookings = ({tournamentId, eventId, isSingleCategory, onSelectBooking}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', tournamentId, eventId],
    queryFn: () => getAllEventBookings(tournamentId, eventId),
  });
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bookings = data?.data?.bookings || [];
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSuggestions = () => {
    if (!bookings) return [];
    
    return bookings.map(booking => {
      const bookingItem = booking.bookingItems[0];
      if (bookingItem.isDoubles) {
        return {
          ...booking,
          displayName: `${booking.player.name} & ${bookingItem.partnerDetails.name}`
        };
      }
      return {
        ...booking,
        displayName: booking.player.name
      };
    });
  };

  const filteredSuggestions = getSuggestions().filter(suggestion => 
    suggestion.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const handleFocus = () => {
    setSearch('');
    setSelectedBooking(null);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (booking) => {
    setSelectedBooking(booking);
    setSearch(booking.displayName);
    setShowSuggestions(false);
    if (onSelectBooking) {
      onSelectBooking(booking);
    }
  };


  return (
    <>
      <div className="relative" ref={searchRef}>
        <input 
          type="text" 
          placeholder={`Search ${isSingleCategory ? 'player' : 'team'} to swap`} 
          className='w-full border border-gray-300 rounded-md p-2' 
          onFocus={handleFocus} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {showSuggestions && (search || selectedBooking === null) && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 divide-y divide-gray-200">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                className="p-2 hover:bg-gray-100 cursor-pointer text-left text-sm font-medium"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.displayName}
              </div>
            ))}
            {filteredSuggestions.length === 0 && (
              <div className="p-2 text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default SearchBookings