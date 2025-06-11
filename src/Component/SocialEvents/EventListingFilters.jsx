import React, { useState } from 'react'

const EventListingFilters = ({ activeFilter, onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published', status: 'PUBLISHED' },
    { id: 'draft', label: 'Draft', status: 'DRAFT' },
    { id: 'archive', label: 'Archive', status: 'ARCHIVED' },
    { id: 'upcoming', label: 'Upcoming', timeline: 'upcoming' }
  ];

  const handleFilterChange = (filter) => {
    if (filter.id === 'upcoming') {
      // If switching to upcoming, include the current status filter
      onFilterChange({
        ...filter,
        status: statusFilter === 'all' ? undefined : 
                statusFilter === 'pending' ? 'PENDING_VERIFICATION' : 'PUBLISHED'
      });
    } else {
      // For other filters, just pass the filter as is
      onFilterChange(filter);
    }
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    // Update the filter with the new status
    onFilterChange({
      ...activeFilter,
      status: status === 'all' ? undefined : 
              status === 'pending' ? 'PENDING_VERIFICATION' : 'PUBLISHED'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mt-4 border-b border-gray-200 overflow-auto justify-around scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter)}
            className={`pb-4 px-2 text-sm font-medium ${
              activeFilter.id === filter.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {activeFilter.id === 'upcoming' && (
        <div className="flex items-center justify-end gap-2 md:gap-6  px-2">
          <span className="text-sm text-gray-600 text-[13px] md:text-sm">Filter by status:</span>
          <div className="flex items-center gap-2 md:gap-4">
            <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="all"
                checked={statusFilter === 'all'}
                onChange={() => handleStatusChange('all')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="approved"
                checked={statusFilter === 'approved'}
                onChange={() => handleStatusChange('approved')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Approved</span>
            </label>
            <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="pending"
                checked={statusFilter === 'pending'}
                onChange={() => handleStatusChange('pending')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pending</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventListingFilters 