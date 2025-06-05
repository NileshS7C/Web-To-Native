import React, { useState, useEffect } from 'react'
import { useOwnerDetailsContext } from '../../Providers/onwerDetailProvider'; 
import { useSelector, useDispatch } from 'react-redux';
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
import LocationSearchInput from "../Common/LocationSearch";
import { resetGlobalLocation } from "../../redux/Location/locationSlice";

const BasicInfo = () => {
  const dispatch = useDispatch();
  const { mutate: createEvent, isLoading } = useCreateEvent();
  const [eventHandle, setEventHandle] = useState("");
  const [formData, setFormData] = useState({
    sponsors: [],
    bannerDesktopImages: [],
    bannerMobileImages: [],
    eventGallery: [],
    previousEventVideos: [],
    whatToExpect: []
  });
  const { tournamentOwners } = useOwnerDetailsContext();
  const { isGettingTags, tags, isGettingALLTO, err_IN_TO } = useSelector((state) => state.Tournament);
  const { location } = useSelector((state) => state.location);
  
  // Add state for all date fields
  const [dates, setDates] = useState({
    startDate: null,
    bookingStartDate: null,
    bookingEndDate: null,
    startTimeDate: null,
    endTimeDate: null,
    startTime: "",
    endTime: ""
  });
  
  // Reset location when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetGlobalLocation());
    };
  }, []);

  // Update address fields when location changes
  useEffect(() => {
    if (location.city || location.state || location.lng || location.lat) {
      document.getElementById("locationName").value = location?.name || "";
      document.getElementById("line1").value = location?.address_line1 || "";
      document.getElementById("line2").value = location?.address_line2 || "";
      document.getElementById("city").value = location?.city || "";
      document.getElementById("state").value = location?.state || "";
      document.getElementById("postalCode").value = location?.pin_code || "";
    }
  }, [
    location.lat,
    location.lng,
    location.city,
    location.state,
    location.pin_code,
    location.address_line1,
    location.address_line2,
    location.name
  ]);
  
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

  // Function to handle form submission and post data
  const handleSendData = () => {
    // Get postal code and ensure it's exactly 6 characters
    const postalCode = document.getElementById("postalCode").value;
    if (postalCode.length !== 6) {
      alert("Postal code must be exactly 6 characters long");
      return;
    }

    // Ensure coordinates are valid numbers
    const longitude = location?.lng ? parseFloat(location.lng) : 0;
    const latitude = location?.lat ? parseFloat(location.lat) : 0;
    
    if (isNaN(longitude) || isNaN(latitude)) {
      alert("Invalid location coordinates. Please select a valid location.");
      return;
    }

    console.log("Location data:", location);
    console.log("Coordinates being sent:", [longitude, latitude]);

    // Collect all form data
    const allFormData = {
      step: 1,
      eventId: "",
      ownerUserId: document.getElementById("organiser").value,
      eventName: document.getElementById("eventName").value,
      handle: document.getElementById("handle").value,
      description: document.querySelector("#description .ql-editor").textContent,
      preRequisites: document.querySelector("#preRequisites .ql-editor").textContent,
      startDate: dates.startDate ? formatDate(dates.startDate) : null,
      bookingStartDate: dates.bookingStartDate ? formatDate(dates.bookingStartDate) : null,
      bookingEndDate: dates.bookingEndDate ? formatDate(dates.bookingEndDate) : null,
      startTime: dates.startTime,
      endTime: dates.endTime,
      maxParticipants: document.getElementById("maxParticipants").value,
      registrationFee: document.getElementById("registrationFee").value,
      instagramHandle: document.getElementById("instagramHandle").value,
      whatsappGroupLink: document.getElementById("whatsappGroupLink").value,
      eventLocation: {
        name: document.getElementById("locationName").value,
        address: {
          line1: document.getElementById("line1").value,
          line2: document.getElementById("line2").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          postalCode: postalCode,
          location: {
            coordinates: [longitude, latitude],
            type: "Point"
          }
        }
      },
      whatToExpect: formData.whatToExpect || [],
      ...formData
    };
    
    console.log("Form Data:", allFormData);
    
    // Call the API to create the event
    createEvent(allFormData);
  };

  // Helper function to format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <LocationSearchInput
            id="eventLocation.address.location"
            name="eventLocation.address.location"
          />
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
              selected={dates.startDate}
              onChange={(date) => setDates(prev => ({...prev, startDate: date}))}
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              selected={dates.bookingStartDate}
              onChange={(date) => setDates(prev => ({...prev, bookingStartDate: date}))}
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              selected={dates.bookingEndDate}
              onChange={(date) => setDates(prev => ({...prev, bookingEndDate: date}))}
              toggleCalendarOnIconClick
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              selected={dates.startTimeDate}
              onChange={(date) => setDates(prev => ({...prev, startTimeDate: date}))}
              toggleCalendarOnIconClick
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yy HH:mm"
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              selected={dates.endTimeDate}
              onChange={(date) => setDates(prev => ({...prev, endTimeDate: date}))}
              toggleCalendarOnIconClick
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yy HH:mm"
              className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
            />
          </>
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Time (24 hrs)</p>
          <input 
            type="time" 
            name="startTime" 
            id="startTime" 
            value={dates.startTime}
            onChange={(e) => setDates(prev => ({...prev, startTime: e.target.value}))}
            className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Enter Start Time' 
          />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>End Time (24 hrs)</p>
          <input 
            type="time" 
            name="endTime" 
            id="endTime" 
            value={dates.endTime}
            onChange={(e) => setDates(prev => ({...prev, endTime: e.target.value}))}
            className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Enter End Time' 
          />
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
        <WhatToExpectTable
          disabled={false}
          onChange={(data) => handleDataChange('whatToExpect', data)}
        />
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

      {/* Add Send button at the end of the form */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSendData}
          className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default BasicInfo
