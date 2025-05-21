import React, { useEffect, useState } from 'react';
import { useGetAllAdmins } from '../../Hooks/AdminHooks';
import { format } from 'date-fns';
import EditAdmin from './EditAdmin';

const AdminListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useGetAllAdmins(currentPage, 10);

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Format date function
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleManageAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
  };

  // Mobile card component for each admin
  const AdminCard = ({ admin }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900">{admin.name}</h3>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {admin.roleName}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start justify-between">
          <span className="font-medium w-20 text-left">Email:</span>
          <span className="text-gray-800 text-right">{admin.email}</span>
        </div>
        
        <div className="flex items-start justify-between">
          <span className="font-medium w-20 text-left">Phone:</span>
          <span className="text-gray-800 text-right">{admin.phone}</span>
        </div>
        
        <div className="flex items-start justify-between">
          <span className="font-medium w-20 text-left">Created:</span>
          <span className="text-gray-800 text-right">{formatDate(admin.createdAt)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => handleManageAdmin(admin)}
        >
          Manage Admin
        </button>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading admins. Please try again later.</p>
          <p className="text-sm mt-1">{error?.message || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data?.admins?.admins || data.admins.admins.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Admins Found</h3>
        <p className="text-gray-500">There are no admins to display at this time.</p>
      </div>
    );
  }

  const admins = data.admins.admins;
  const totalPages = Math.ceil(data.admins.total / 10);

  // Pagination controls
  const Pagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
      >
        Previous
      </button>
      
      <div className="flex space-x-1">
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={`w-8 h-8 rounded-md ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {page + 1}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="w-full mt-5">
      {/* Mobile view - Cards */}
      <div className="md:hidden">
        {admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}
      </div>
      
      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 text-left">{admin.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 text-left">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 text-left">{admin.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {admin.roleName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {formatDate(admin.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    onClick={() => handleManageAdmin(admin)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && <Pagination />}
      
      {/* Edit Admin Modal */}
      {isEditModalOpen && selectedAdmin && (
        <EditAdmin 
          admin={selectedAdmin} 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
        />
      )}
    </div>
  );
};

export default AdminListing;