import React, { useState } from 'react'
import { useGetEventOwners } from '../Hooks/SocialEventsHooks'
import { Pagination } from '../Component/Common/Pagination'
import AddEventOwner from '../Component/EventOwners/AddEventOwner'
import ViewEditEventOwner from '../Component/EventOwners/ViewEditEventOwner'

const EventOwners = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOwnerId, setSelectedOwnerId] = useState(null)
  const limit = 10

  const { data, isLoading, error } = useGetEventOwners({
    page: currentPage,
    limit
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleViewDetails = (ownerId) => {
    setSelectedOwnerId(ownerId)
  }

  const handleCloseModal = () => {
    setSelectedOwnerId(null)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading event owners</div>
  }

  const eventOwners = data?.owners || []
  const total = data?.total || 0

  return (
    <div className="container mx-auto">
      <AddEventOwner />
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-bold text-[#667085] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-center text-sm font-bold text-[#667085] uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-center text-sm font-bold text-[#667085] uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-center text-sm font-bold text-[#667085] uppercase tracking-wider">Roles</th>
              <th className="px-6 py-3 text-center text-sm font-bold text-[#667085] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventOwners.map((owner, index) => (
              <tr key={owner.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232323] font-bold">{owner.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#718ebf]">{owner.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#718ebf]">{owner.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#718ebf]">{owner.specificOwnerTypeRoles?.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#718ebf]">
                  <button 
                    onClick={() => handleViewDetails(owner.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {eventOwners.map((owner) => (
          <div key={owner.id} className="bg-white p-4 rounded-lg shadow">
            <div className="space-y-2">
              <div className='flex items-center gap-2 justify-between'>
                <span className="font-regular text-black text-sm">Name:</span> 
                <span className='font-regular text-[#232323] text-sm font-bold'>{owner.name}</span>
              </div>
              <div className='flex items-center gap-2 justify-between'>
                <span className="font-regular text-black text-sm">Email:</span> 
                <span className='font-regular text-[#718ebf] text-sm'>{owner.email}</span>
              </div>
              <div className='flex items-center gap-2 justify-between'>
                <span className="font-regular text-black text-sm">Phone:</span> 
                <span className='font-regular text-[#718ebf] text-sm'>{owner.phone}</span>
              </div>
              <div className='flex items-center gap-2 justify-between'>
                <span className="font-regular text-black text-sm">Roles:</span> 
                <span className='font-regular text-[#718ebf] text-sm'>{owner.specificOwnerTypeRoles?.join(', ')}</span>
              </div>
              <div className="pt-2 flex items-center gap-2 justify-between">
                <span className='font-regular text-black text-sm'>Actions:</span>
                <button 
                  onClick={() => handleViewDetails(owner.id)}
                  className="w-fit bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          total={total}
          onPageChange={handlePageChange}
          rowsInOnePage={limit}
        />
      </div>

      {/* View/Edit Modal */}
      {selectedOwnerId && (
        <ViewEditEventOwner
          ownerId={selectedOwnerId}
          isOpen={!!selectedOwnerId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default EventOwners