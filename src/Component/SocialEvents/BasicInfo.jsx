import React, { useState, useEffect } from 'react'
import { useOwnerDetailsContext } from '../../Providers/onwerDetailProvider'; 
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { calenderIcon } from '../../Assests';
import SponsorTable from './SponsorTable';
import WhatToExpectTable from './WhatToExpectTable';
import BannerDesktopTable from './BannerDesktopTable';
import BannerMobileTable from './BannerMobileTable';
import EventGalleryTable from './EventGalleryTable';
import PreviousEventVideosTable from './PreviousEventVideosTable';
import ReactQuill from 'react-quill';
import { useCreateEvent } from '../../Hooks/SocialEventsHooks';

const BasicInfo = () => {
  const [eventHandle, setEventHandle] = useState("");
  const [formData, setFormData] = useState({
    sponsors: [],
    bannerDesktopImages: [],
    bannerMobileImages: [],
    eventGallery: [],
    previousEventVideos: []
  });
  const { tournamentOwners } = useOwnerDetailsContext();
  const { isGettingTags, tags, isGettingALLTO, err_IN_TO } = useSelector((state) => state.Tournament);
  
  // Handle event name change to update handle
  const handleEventNameChange = (e) => {
    const eventName = e.target.value;
    if (eventName) {
      const handle = eventName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setEventHandle(handle);
      document.getElementById("handle").value = handle;
    }
  };

  // Handle data changes from child components
  const handleDataChange = (field, data) => {
    setFormData(prev => ({
      ...prev,
      [field]: data
    }));
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px] mt-4'>
        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event Organiser name</p>
          <select name="organiser" id="organiser" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value="">Select Organiser</option>
            {tournamentOwners?.owners?.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.name}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event name</p>
          <input 
            type="text" 
            name="eventName" 
            id="eventName" 
            className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Enter Event Name' 
            onChange={handleEventNameChange}
          />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event handle</p>
          <input 
            type="text" 
            name="handle" 
            id="handle" 
            className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Enter Event handle'
            defaultValue={eventHandle}
          />
        </div>



        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Google Map</p>
          <input type="text" name="googleMap" id="googleMap" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Google maps' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event Address</p>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Location Name</p>
          <input type="text" name="locationName" id="locationName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Location Name' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Line 1</p>
          <input type="text" name="line1" id="line1" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Line 1' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Line 2</p>
          <input type="text" name="line2" id="line2" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Line 2' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>City</p>
          <input type="text" name="city" id="city" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter City' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>State</p>
          <input type="text" name="state" id="state" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter State' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Pincode</p>
          <input type="text" name="postalCode" id="postalCode" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Pincode' />
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Date</p>
          <>
            <DatePicker
              id="startDate"
              name="startDate"
              placeholderText="Select date"
              startDate=""
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
              dateFormat="dd/MM/yy"
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Registration Start Date</p>
          <>
            <DatePicker
              id="bookingStartDate"
              name="bookingStartDate"
              placeholderText="Select date"
              startDate=""
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
              dateFormat="dd/MM/yy"
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Registration End Date</p>
          <>
            <DatePicker
              id="bookingEndDate"
              name="bookingEndDate"
              placeholderText="Select date"
              startDate=""
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
              dateFormat="dd/MM/yy"
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Time Date</p>
          <>
            <DatePicker
              id="startTimeDate"
              name="startTimeDate"
              placeholderText="Select date & time"
              startDate=""
              toggleCalendarOnIconClick
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yy HH:mm"
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>End Time Date</p>
          <>
            <DatePicker
              id="endTimeDate"
              name="endTimeDate"
              placeholderText="Select date & time"
              startDate=""
              toggleCalendarOnIconClick
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yy HH:mm"
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Time (24 hrs)</p>
          <input type="time" name="startTime" id="startTime" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Start Time' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>End Time (24 hrs)</p>
          <input type="time" name="endTime" id="endTime" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter End Time' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Maximum Participants</p>
          <input type="number" name="maxParticipants" id="maxParticipants" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter max participants' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Registration fee</p>
          <input type="number" name="registrationFee" id="registrationFee" step="0.01" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Registration Fee' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Instagram Handle</p>
          <input type="text" name="instagramHandle" id="instagramHandle" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Instagram Handle' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>WhatsApp Group Link</p>
          <input type="text" name="whatsappGroupLink" id="whatsappGroupLink" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter WhatsApp Group Link' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Tags</p>
          <input type="text" name="tags" id="tags" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter tags separated by commas' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Rejection Comments</p>
          <textarea name="rejectionComments" id="rejectionComments" rows="3" className='w-full px-[19px] py-3 border-[1px] border-[#DFEAF2] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' placeholder='Enter rejection comments (if any)'></textarea>
        </div>
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <WhatToExpectTable />
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <SponsorTable 
          disabled={false} 
          onChange={(data) => handleDataChange('sponsors', data)} 
        />
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <BannerDesktopTable 
          disabled={false} 
          onChange={(data) => handleDataChange('bannerDesktopImages', data)} 
        />
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <BannerMobileTable 
          disabled={false} 
          onChange={(data) => handleDataChange('bannerMobileImages', data)} 
        />
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <EventGalleryTable 
          disabled={false} 
          onChange={(data) => handleDataChange('eventGallery', data)} 
        />
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <PreviousEventVideosTable 
          disabled={false} 
          onChange={(data) => handleDataChange('previousEventVideos', data)} 
        />
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <label
          className="text-base leading-[19.36px] justify-self-start"
          htmlFor="description"
        >
          Description
        </label>
        <ReactQuill
          theme="snow"
          id="description"
          name="description"
          placeholder="Enter Event Description"
          className="custom-quill"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <label
          className="text-base leading-[19.36px] justify-self-start"
          htmlFor="preRequisites"
        >
          Pre-requisites
        </label>
        <ReactQuill
          theme="snow"
          id="preRequisites"
          name="preRequisites"
          placeholder="Enter Pre-requisites"
          className="custom-quill"
        />
      </div>


    </div>
  )
}

export default BasicInfo
