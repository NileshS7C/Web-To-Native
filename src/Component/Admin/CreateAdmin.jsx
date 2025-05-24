import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import React, { useState, useEffect } from 'react'
import { useCreateAdmin } from '../../Hooks/AdminHooks';
import { toast } from 'react-hot-toast';

const CreateAdmin = () => {
  const { mutate: creatingAdmin, isLoading: isCreatingAdmin, isError: isCreateAdminError, isPending: isCreatingAdminPending, error: createAdminError, isSuccess: adminCreatedSuccessfully } = useCreateAdmin();
  
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
    setErrors({});
  };

  // Handle successful admin creation
  useEffect(() => {
    if (adminCreatedSuccessfully) {
      toast.success('Admin created successfully!');
      handleClose();
    }
  }, [adminCreatedSuccessfully]);

  // Handle admin creation errors
  useEffect(() => {
    if (isCreateAdminError && createAdminError) {
      setApiError(createAdminError?.response?.data?.message || 'Failed to create admin. Please try again.');
    }
  }, [isCreateAdminError, createAdminError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when user starts editing again
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/i.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Reset any previous API errors
      setApiError(null);
      
      // Call the mutation hook to create admin
      creatingAdmin(formData);
    }
  };
                
  return (
    <div>
      <Popover>
        <PopoverButton 
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors' 
          onClick={handleOpen}
        >
          Create Admin
        </PopoverButton>
        
        {open && (
          <PopoverPanel className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={isCreatingAdmin ? null : handleClose} />
              
              {/* Modal */}
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Admin</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                    disabled={isCreatingAdmin || isCreatingAdminPending}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* API Error Message */}
                {apiError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    <p className="text-sm">{apiError}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        errors.name ? 'border-red-500' : 'border'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        errors.email ? 'border-red-500' : 'border'
                      }`}
                      placeholder="admin@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-left">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      max={10}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        errors.phone ? 'border-red-500' : 'border'
                      }`}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Password Field - Now visible, not using dots */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                      Password
                    </label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        errors.password ? 'border-red-500' : 'border'
                      }`}
                      placeholder="Enter password (min. 8 characters)"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleClose}
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isCreatingAdmin || isCreatingAdminPending}
                    >
                      {isCreatingAdmin || isCreatingAdminPending ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </PopoverPanel>
        )}
      </Popover>
    </div>
  );
};

export default CreateAdmin;