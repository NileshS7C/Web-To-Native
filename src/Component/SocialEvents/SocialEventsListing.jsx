import React from 'react';
import { listingIcon } from '../../Assests';
import { GoDotFill } from 'react-icons/go';

const SocialEventsListing = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className='text-gray-400 mt-4'>No events found.</p>;
  }

  return (
    <div className='flex flex-col gap-4 mt-4'>
      {events.map((event) => (
        <div
          className='flex items-center justify-between bg-white px-4 py-4 rounded-lg flex-col md:flex-row gap-4'
          key={event?._id}
        >
          <div className='hidden md:block'>
            <img src={listingIcon} width="60px" height="60px" alt="event logo" />
          </div>

          <div className='text-left flex flex-row items-center w-full justify-between md:flex-col md:justify-start md:w-auto'>
            <p className='font-semibold text-base text-left'>Event Name</p>
            <p className='text-[#718ebf] text-left text-sm'>{event?.eventName}</p>
          </div>

          <div className='text-left flex flex-row items-center w-full justify-between md:flex-col md:justify-start md:w-auto'>
            <p className='font-semibold text-base text-left'>Start Date</p>
            <p className='text-[#718ebf] text-left text-sm'>{event?.startDate}</p>
          </div>

          <div className='text-left flex flex-row items-center w-full justify-between md:flex-col md:justify-start md:w-auto'>
            <p className='font-semibold text-base text-left'>Approval Status</p>
            <p
              className={`inline-flex flex-1 max-w-fit items-center rounded-2xl px-2 py-1 text-xs font-medium ring-1 ring-inset
                ${event?.status === "PUBLISHED"
                  ? "bg-green-50 text-[#41C588] ring-green-600/20"
                  : event?.status === "DRAFT"
                    ? "bg-orange-100 text-[#FF791A] ring-orange-600/20"
                    : "bg-gray-300 text-[#5D5D5D] ring-gray-600/20"
                }`}
            >
              <span><GoDotFill /></span>
              <span>{event?.status}</span>
            </p>
          </div>

          <button className='text-[#718EBF] text-sm border-[1px] border-[#718EBF] px-[30px] py-2 rounded-md capitalize mr-auto md:mr-0'>
            view Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default SocialEventsListing;
