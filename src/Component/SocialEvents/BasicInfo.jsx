import React from 'react'
import { useOwnerDetailsContext } from '../../Providers/onwerDetailProvider'; 
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { calenderIcon } from '../../Assests';
import SponsorTable from './SponsorTable';
import ReactQuill from 'react-quill';
import { useCreateEvent } from '../../Hooks/SocialEventsHooks';

const BasicInfo = () => {
  const { tournamentOwners } = useOwnerDetailsContext();
  const { isGettingTags, tags, isGettingALLTO, err_IN_TO } = useSelector((state) => state.Tournament);
  console.log(`🚀 || BasicInfo.jsx:9 || BasicInfo || tags:`, tags);
  console.log(`🚀 || BasicInfo.jsx:9 || BasicInfo || err_IN_TO:`, err_IN_TO);
  console.log(`🚀 || BasicInfo.jsx:9 || BasicInfo || isGettingALLTO:`, isGettingALLTO);
  console.log(`🚀 || BasicInfo.jsx:9 || BasicInfo || isGettingTags:`, isGettingTags);
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
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Event Name' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event handle</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Event handle' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Google Map</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Google maps' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-base leading-[19.36px] text-[#232323]'>Event Address</p>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Location Name</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Location Name' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Line 1</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Line 1' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Line 2</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Line 2' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>City</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter City' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>State</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter State' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Pincode</p>
          <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Pincode' />
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Date</p>
          {/* <input type="text" name="eventName" id="eventName" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Pincode' /> */}
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
            // selected={field.value ? new Date(field.value) : null}
            // onChange={(date) => {
            //   if (date) {
            //     form.setFieldValue("bookingStartDate", date);
            //   }
            // }}
            // disabled={disabled}
            />
            {/* <img
              src={calenderIcon}
              alt="calenderIcon"
              className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
            /> */}
          </>
        </div>

        <div className='flex flex-col items-start gap-3 relative'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>End Date</p>
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

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Maximum Participants</p>
          <input type="number" name="max-participants" id="max-participants" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter max participants' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Registration fee</p>
          <input type="number" name="registration fee" id="registration fee" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Registration Fee' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>Start Time (24 hrs)</p>
          <input type="time" name="start-time" id="start-time" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Start Time' />
        </div>

        <div className='flex flex-col items-start gap-3'>
          <p className='text-sm leading-[16.36px] text-[#232323]'>End Time (24 hrs)</p>
          <input type="time" name="start-time" id="start-time" className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter End Time' />
        </div>
      </div>

      <div className='flex flex-col items-start gap-3 mt-3'>
        <SponsorTable />
      </div>

      <div className="grid grid-cols-1 gap-2">
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
        placeholder="Enter Tournament Description"
        // onChange={(e) => {
        //   setFieldValue("description", e);
        // }}
        className="custom-quill"
        // value={values?.description}
        // readOnly={disabled}
      />
    </div>


    </div>
  )
}

export default BasicInfo