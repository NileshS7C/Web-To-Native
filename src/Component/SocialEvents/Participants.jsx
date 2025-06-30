import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useGetEventBookings, useCancelEventBooking, useRefundEventBooking } from '../../Hooks/SocialEventsHooks';
import { Toast } from '../Common/Toast';
import AddEventPlayers from './AddEventPlayers';
import { crossIcon } from '../../Assests';
import Button from '../Common/Button';

const Participants = () => {
  const { eventId } = useParams();
  const ownerId = useSelector((state) => state.user.id);
  const { data, isLoading, error } = useGetEventBookings(eventId);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isErrorToast, setIsErrorToast] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const { mutate: cancelBooking, isLoading: isCancelling } = useCancelEventBooking();
  const { mutate: refundBooking, isLoading: isRefunding } = useRefundEventBooking();

  const handleRefund = async (bookingId) => {
    try {
      await refundBooking(
        { bookingId, ownerId },
        {
          onSuccess: () => {
            setShowToast(true);
            setToastMessage("Refund processed successfully!");
            setIsErrorToast(false);
          },
          onError: (error) => {
            setShowToast(true);
            setToastMessage(error?.message || "Failed to process refund");
            setIsErrorToast(true);
          }
        }
      );
    } catch (error) {
      setShowToast(true);
      setToastMessage(error?.message || "Failed to process refund");
      setIsErrorToast(true);
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsCancelModalOpen(true);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setShowToast(true);
      setToastMessage("Please provide a reason for cancellation");
      setIsErrorToast(true);
      return;
    }

    try {
      await cancelBooking(
        { bookingId: selectedBookingId, ownerId, cancelReason },
        {
          onSuccess: () => {
            setShowToast(true);
            setToastMessage("Booking cancelled successfully!");
            setIsErrorToast(false);
            setIsCancelModalOpen(false);
            setCancelReason('');
            setSelectedBookingId(null);
          },
          onError: (error) => {
            setShowToast(true);
            setToastMessage(error?.message || "Failed to cancel booking");
            setIsErrorToast(true);
          }
        }
      );
    } catch (error) {
      setShowToast(true);
      setToastMessage(error?.message || "Failed to cancel booking");
      setIsErrorToast(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading participants: {error.message}
      </div>
    );
  }

  const ParticipantCard = ({ booking }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className='flex items-center gap-2 justify-between'>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Name:
            </h3>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {booking.playerId?.name || 'N/A'}
            </h3>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <p className="text-sm text-gray-600 mb-2">
              Phone:
            </p>
            <p className="text-sm text-gray-600 mb-2">
              {booking.playerId?.phone || 'N/A'}
            </p>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <p className="text-sm text-gray-600 mb-2">
              Amount:
            </p>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ₹{booking.finalAmount || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleRefund(booking._id)}
          disabled={isRefunding}
          className={`text-black bg-gray-200 py-2 px-5 rounded-md mr-4 ${isRefunding ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} 
          ${booking.status === 'CANCELLED' ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'} 
          ${booking.status === 'REFUNDED' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {booking.status === 'REFUNDED' ? 'Refunded' : 'Refund'}
        </button>
        <button
          onClick={() => handleCancelClick(booking._id)}
          disabled={isCancelling}
          className={`text-white bg-red-500 py-2 px-5 rounded-md mr-4 hover:opacity-50 ${isCancelling ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} 
            ${booking.status === 'REFUNDED' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
            ${booking.status === 'CANCELLED' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
        >
          {(booking.status === 'CANCELLED' || booking.status === 'REFUNDED') ? 'Cancelled' : 'Cancel'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AddEventPlayers />
      <div className="bg-white">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-[#667085] uppercase tracking-wider text-center">
                  Name
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-[#667085] uppercase tracking-wider text-center">
                  Phone
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-[#667085] uppercase tracking-wider text-center">
                  Amount
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-[#667085] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-[#667085] uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.bookings?.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.playerId?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {booking.playerId?.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      ₹{booking.finalAmount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className={`text-sm capitalize ${booking.status === 'CANCELLED' ? 'text-red-500' : ''} ${booking.status === 'REFUNDED' ? 'text-blue-500' : ''} ${booking.status === 'CONFIRMED' ? 'text-green-500' : ''}`}>
                        {booking.status || ''}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRefund(booking._id)}
                      disabled={isRefunding}
                      className={`text-black bg-gray-200 py-2 px-5 rounded-md mr-4 ${isRefunding ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                        } ${booking.status === 'CANCELLED' ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'} ${booking.status === 'REFUNDED' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    >
                      {booking.status === 'REFUNDED' ? 'Refunded' : 'Refund'}
                    </button>
                    <button
                      onClick={() => handleCancelClick(booking._id)}
                      disabled={isCancelling}
                      className={`text-white bg-red-500 py-2 px-5 rounded-md mr-4 hover:opacity-50 ${isCancelling ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                        } ${booking.status === 'REFUNDED' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
                        ${booking.status === 'CANCELLED' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                      {(booking.status === 'CANCELLED' || booking.status === 'REFUNDED') ? 'Cancelled' : 'Cancel'}
                    </button>
                  </td>
                </tr>
              ))}
              {(!data?.bookings || data.bookings.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No participants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {data?.bookings?.length > 0 ? (
            data.bookings.map((booking) => (
              <ParticipantCard key={booking._id} booking={booking} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No participants found
            </div>
          )}
        </div>

        {/* Cancel Reason Modal */}
        <Dialog
          open={isCancelModalOpen}
          onClose={() => {
            setIsCancelModalOpen(false);
            setCancelReason('');
            setSelectedBookingId(null);
          }}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
          />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cancel Booking
                  </h3>
                  <button
                    onClick={() => {
                      setIsCancelModalOpen(false);
                      setCancelReason('');
                      setSelectedBookingId(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <img src={crossIcon} alt="close" className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="cancelReason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason for Cancellation
                  </label>
                  <textarea
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-black-600 shadow-sm sm:text-sm p-2"
                    rows={4}
                    placeholder="Enter reason for cancellation"
                  />
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    loading={isCancelling}
                  >
                    Confirm Cancel
                  </Button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      setIsCancelModalOpen(false);
                      setCancelReason('');
                      setSelectedBookingId(null);
                    }}
                  >
                    Back
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        {showToast && (
          <Toast
            successMessage={!isErrorToast ? toastMessage : null}
            error={isErrorToast ? toastMessage : null}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </>
  );
};

export default Participants;