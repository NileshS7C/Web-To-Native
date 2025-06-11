import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useGetEventById, useVerifyEvent, useArchiveEvent, usePublishEvent } from '../../Hooks/SocialEventsHooks';
import EventDetailsInfo from './EventDetailsInfo';
import { Toast } from '../Common/Toast';
import Acknowledgement from './Acknowledgement';
import EditAcknowledgement from './EditAcknowledgement';
import Participants from './Participants';

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
  const { mutate: verifyEvent } = useVerifyEvent();
  const { mutate: archiveEvent } = useArchiveEvent();
  const { mutate: publishEvent } = usePublishEvent();

  const isAdmin = userRole?.includes('SUPER_ADMIN') || userRole?.includes('ADMIN');
  const isPendingVerification = data?.event?.status === 'PENDING_VERIFICATION';
  const isPublished = data?.event?.status === 'PUBLISHED';
  const isDraft = data?.event?.status === 'DRAFT';

  const handleVerifyEvent = (action) => {
    verifyEvent(
      { 
        eventId, 
        action,
        rejectionComments: action === 'REJECT' ? 'Event rejected by admin' : undefined 
      },
      {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage(`Event ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
          setIsErrorToast(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || `Failed to ${action === 'APPROVE' ? 'approve' : 'reject'} event`);
          setIsErrorToast(true);
        }
      }
    );
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

  return (
    <>
      <div className='flex justify-end gap-2 mb-2'>
        {isAdmin && isPendingVerification ? (
          <>
            <button
              onClick={() => handleVerifyEvent('APPROVE')}
              className="px-4 py-2 rounded-lg shadow-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700"
            >
              Approve Event
            </button>
            <button
              onClick={() => handleVerifyEvent('REJECT')}
              className="px-4 py-2 rounded-lg shadow-md bg-red-600 text-white hover:bg-red-500 active:bg-red-700"
            >
              Reject Event
            </button>
          </>
        ) : (
          <>
            {isAdmin && !isPublished && (
              <button
                onClick={handlePublishEvent}
                className="px-4 py-2 rounded-lg shadow-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700"
              >
                Publish Event
              </button>
            )}
            {isPublished && (
              <button
                onClick={handleArchiveEvent}
                className="px-4 py-2 rounded-lg shadow-md bg-yellow-600 text-white hover:bg-yellow-500 active:bg-yellow-700"
              >
                Unpublish Event
              </button>
            )}
            <button
              onClick={() => setIsEdit(!isEdit)}
              className={`px-4 py-2 rounded-lg shadow-md ${
                isEdit
                  ? 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
              }`}
            >
              {isEdit ? 'Cancel' : 'Edit'}
            </button>
          </>
        )}
      </div>
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-6 mt-4 border-b-[1px] border-[#EDEDED] w-full'>
            <p
              className={`pb-4 cursor-pointer text-base leading-[19.36px] ${
                activeTab === 'basic details info' ? 'border-b-2 border-blue-500 text-blue-600' : ''
              }`}
              onClick={() => setActiveTab('basic details info')}
            >
              Basic Info
            </p>
            {data?.event?.status === 'REJECTED' && !isAdmin && (
              
              <p
              className={`pb-4 cursor-pointer text-base leading-[19.36px] ${
                activeTab === 'acknowledgement' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                }`}
                onClick={() => setActiveTab('acknowledgement')}
                >
              Acknowledgement
            </p>
            )}
            <p
              className={`pb-4 cursor-pointer text-base leading-[19.36px] ${
                activeTab === 'players' ? 'border-b-2 border-blue-500 text-blue-600' : ''
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
    </>
  )
}

export default EventDetails