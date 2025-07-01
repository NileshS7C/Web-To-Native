import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useGetEventById, useVerifyEvent, useArchiveEvent, usePublishEvent, useChangeEventStatus, useExportEventBookings } from '../../Hooks/SocialEventsHooks';
import EventDetailsInfo from './EventDetailsInfo';
import { Toast } from '../Common/Toast';
import Acknowledgement from './Acknowledgement';
import EditAcknowledgement from './EditAcknowledgement';
import Participants from './Participants';

// Rejection Modal Component
const RejectionModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onSubmit(rejectionReason.trim());
      setRejectionReason('');
    }
  };

  const handleClose = () => {
    setRejectionReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reject Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this event..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !rejectionReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Rejecting...' : 'Reject Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventDetails = () => {
  const { eventId } = useParams()
  const ownerId = useSelector((state) => state.user.id);
  const userRole = useSelector((state) => state.user.roleNames);
  const { data, isLoading, isError, isFetching, error } = useGetEventById(eventId, ownerId);
  const [activeTab, setActiveTab] = useState('basic details info')
  const [isEdit, setIsEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isErrorToast, setIsErrorToast] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const { mutate: verifyEvent, isLoading: isVerifying } = useVerifyEvent();
  const { mutate: archiveEvent } = useArchiveEvent();
  const { mutate: publishEvent } = usePublishEvent();
  const { mutate: changeEventStatus } = useChangeEventStatus();
  const { mutate: exportBookings, isLoading: isExporting } = useExportEventBookings();

  const isAdmin = userRole?.includes('SUPER_ADMIN') || userRole?.includes('ADMIN');
  const isPendingVerification = data?.event?.status === 'PENDING_VERIFICATION';
  const isPublished = data?.event?.status === 'PUBLISHED';
  const isRejected = data?.event?.status === 'REJECTED';
  const isDraft = data?.event?.status === 'DRAFT';
  const isCompleted = data?.event?.status === 'COMPLETED';
  const rejectionComment = data?.event?.rejectionComments;

  const handleVerifyEvent = (action, rejectionComments = undefined) => {
    verifyEvent(
      {
        eventId,
        action,
        rejectionComments: action === 'REJECT' ? rejectionComments : undefined
      },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage(`Event ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
          setIsErrorToast(false);
          if (action === 'REJECT') {
            setShowRejectionModal(false);
          }
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || `Failed to ${action === 'APPROVE' ? 'approve' : 'reject'} event`);
          setIsErrorToast(true);
          if (action === 'REJECT') {
            setShowRejectionModal(false);
          }
        }
      }
    );
  };

  const handleRejectWithReason = (rejectionReason) => {
    handleVerifyEvent('REJECT', rejectionReason);
  };

  const handleArchiveEvent = () => {
    archiveEvent(
      { eventId, ownerId },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage('Event archived successfully!');
          setIsErrorToast(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || 'Failed to archive event');
          setIsErrorToast(true);
        }
      }
    );
  };

  const handlePublishEvent = () => {
    publishEvent(
      { eventId, ownerId },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage('Event published successfully!');
          setIsErrorToast(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || 'Failed to publish event');
          setIsErrorToast(true);
        }
      }
    );
  };

  const handleCompleteEvent = () => {
    changeEventStatus(
      { eventId, ownerId, status: 'COMPLETED' },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage('Event marked as completed successfully!');
          setIsErrorToast(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || 'Failed to mark event as completed');
          setIsErrorToast(true);
        }
      }
    );
  };

  const handleExportBookings = () => {
    exportBookings(
      { eventId, ownerId },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage('Event bookings exported successfully!');
          setIsErrorToast(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || 'Failed to export event bookings');
          setIsErrorToast(true);
        }
      }
    );
  };

  return (
    <>
      <div className='flex items-start justify-between gap-2 mb-6 flex-col md:flex-row md:items-center'>
        <h1 className='text-[#343C6A] font-semibold text-base md:text-[22px]'>
          {data?.event?.eventName || 'Event Details'}
        </h1>
        <div className='flex justify-start md:justify-end gap-2 flex-wrap'>
          {isAdmin && isPendingVerification ? (
            <>
              <button
                onClick={() => handleVerifyEvent('APPROVE')}
                className="px-4 py-2 rounded-lg shadow-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700"
              >
                Approve Event
              </button>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="px-4 py-2 rounded-lg shadow-md bg-red-600 text-white hover:bg-red-500 active:bg-red-700"
              >
                Reject Event
              </button>
            </>
          ) : (
            <>
              {isAdmin && !isPublished && !isRejected && (
                <button
                  onClick={handlePublishEvent}
                  className="px-4 py-2 rounded-lg shadow-md bg-white text-black"
                >
                  Publish Event
                </button>
              )}
              {isPublished && (
                <button
                  onClick={handleArchiveEvent}
                  className="px-4 py-2 rounded-lg shadow-md bg-white text-black"
                >
                  Unpublish Event
                </button>
              )}
              {!isCompleted && !isRejected && (
                <button
                  onClick={handleCompleteEvent}
                  className="px-4 py-2 rounded-lg shadow-md bg-white text-black"
                >
                  Complete
                </button>
              )}
              {!isRejected && (
                <button
                  onClick={handleExportBookings}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-lg shadow-md bg-[#1570EF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Exporting...' : 'Download Sheet'}
                </button>
              )}
              <button
                onClick={() => setIsEdit(!isEdit)}
                className={`px-4 py-2 rounded-lg shadow-md ${isEdit
                    ? 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
                  }`}
              >
                {isEdit ? 'Cancel' : 'Edit'}
              </button>
            </>
          )}
        </div>
      </div>
      {isRejected && rejectionComment && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-3'>
          <h1 className='text-lg font-semibold text-red-500 text-left'>Rejection Comments:</h1>
          <p className='text-md text-black text-left'>{rejectionComment}</p>
        </div>
      )}
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-6 mt-4 border-b-[1px] border-[#EDEDED] w-full'>
            <p
              className={`pb-4 cursor-pointer text-base leading-[19.36px] ${activeTab === 'basic details info' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
              onClick={() => setActiveTab('basic details info')}
            >
              Basic Info
            </p>
            {data?.event?.status === 'REJECTED' && !isAdmin && (

              <p
                className={`pb-4 cursor-pointer text-base leading-[19.36px] ${activeTab === 'acknowledgement' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                  }`}
                onClick={() => setActiveTab('acknowledgement')}
              >
                Acknowledgement
              </p>
            )}
            <p
              className={`pb-4 cursor-pointer text-base leading-[19.36px] ${activeTab === 'players' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
              onClick={() => setActiveTab('players')}
            >
              Players
            </p>
          </div>
        </div>
        <div>
          {activeTab === 'basic details info' && <EventDetailsInfo isEdit={isEdit} setIsEdit={setIsEdit} />}
          {activeTab === 'acknowledgement' && data?.event?.status === 'REJECTED' && !isAdmin && <EditAcknowledgement isEdit={isEdit} />}
          {activeTab === 'players' && <Participants />}
        </div>
      </div>

      {showToast && (
        <Toast
          successMessage={!isErrorToast ? toastMessage : null}
          error={isErrorToast ? toastMessage : null}
          onClose={() => setShowToast(false)}
        />
      )}

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectWithReason}
        isLoading={isVerifying}
      />
    </>
  )
}

export default EventDetails