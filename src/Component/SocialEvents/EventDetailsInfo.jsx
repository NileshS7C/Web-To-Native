import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'
import { useGetEventById, useUpdateEvent } from '../../Hooks/SocialEventsHooks';
import ReactQuill from 'react-quill';
import SponsorTable from './SponsorTable';
import WhatToExpectTable from './WhatToExpectTable';
import BannerDesktopTable from './BannerDesktopTable';
import BannerMobileTable from './BannerMobileTable';
import EventGalleryTable from './EventGalleryTable';
import PreviousEventVideosTable from './PreviousEventVideosTable';
import DatePicker from 'react-datepicker';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextError from "../Error/formError";
import { resetGlobalLocation } from "../../redux/Location/locationSlice";
import LocationSearchInput from "../Common/LocationSearch";
import { Toast } from "../Common/Toast";

// Validation Schema
const validationSchema = Yup.object({
  eventName: Yup.string().required('Event name is required'),
  handle: Yup.string().required('Event handle is required'),
  locationName: Yup.string().required('Location name is required'),
  line1: Yup.string().required('Address line 1 is required'),
  line2: Yup.string().required('Address line 2 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^\d{6}$/, 'Postal code must be exactly 6 digits'),
  startDate: Yup.date()
    .required('Event start date is required')
    .nullable()
    .typeError('Please select a valid date'),
  bookingStartDate: Yup.date()
    .required('Registration start date is required')
    .nullable()
    .typeError('Please select a valid date'),
  bookingEndDate: Yup.date()
    .required('Registration end date is required')
    .nullable()
    .typeError('Please select a valid date'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
  maxParticipants: Yup.number()
    .required('Maximum participants is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  registrationFee: Yup.number()
    .required('Registration fee is required')
    .min(0, 'Registration fee cannot be negative'),
  bannerDesktopImages: Yup.array().min(1, 'Desktop banner images are required'),
  bannerMobileImages: Yup.array().min(1, 'Mobile banner images are required'),
});

const FormInput = ({ label, name, type = "text", placeholder, className = "", styles, ...props }) => (
  <div className={`flex flex-col items-start gap-3 ${styles}`}>
    <p className='text-base leading-[19.36px] text-[#232323] capitalize'>{label}</p>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);

const EventDetailsInfo = ({ isEdit, setIsEdit }) => {
  const { eventId } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const ownerId = useSelector((state) => state.user.id);
  const { data, isLoading, isError } = useGetEventById(eventId, ownerId);
  const { mutate: updateEvent } = useUpdateEvent();
  const { location } = useSelector((state) => state.location);
  const [formData, setFormData] = useState({
    sponsors: [],
    bannerDesktopImages: [],
    bannerMobileImages: [],
    eventGallery: [],
    previousEventVideos: [],
    whatToExpect: []
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isErrorToast, setIsErrorToast] = useState(false);

  const event = data?.event;

  // Convert string dates to Date objects for DatePicker
  const initialValues = useMemo(() => ({
    eventName: event?.eventName || "",
    handle: event?.handle || "",
    locationName: event?.eventLocation?.name || "",
    line1: event?.eventLocation?.address?.line1 || "",
    line2: event?.eventLocation?.address?.line2 || "",
    city: event?.eventLocation?.address?.city || "",
    state: event?.eventLocation?.address?.state || "",
    postalCode: event?.eventLocation?.address?.postalCode || "",
    startDate: event?.startDate ? new Date(event.startDate.split('/').reverse().join('-')) : null,
    bookingStartDate: event?.bookingStartDate ? new Date(event.bookingStartDate.split('/').reverse().join('-')) : null,
    bookingEndDate: event?.bookingEndDate ? new Date(event.bookingEndDate.split('/').reverse().join('-')) : null,
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    maxParticipants: event?.maxParticipants || "",
    registrationFee: event?.registrationFee || "",
    instagramHandle: event?.instagramHandle || "",
    whatsappGroupLink: event?.whatsappGroupLink || "",
    tags: event?.tags?.join(', ') || "",
    description: event?.description || "",
    preRequisites: event?.preRequisites || "",
    bannerDesktopImages: event?.bannerDesktopImages || [],
    bannerMobileImages: event?.bannerMobileImages || []
  }), [event]);

  // Reset location when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetGlobalLocation());
    };
  }, [dispatch]);

  // Initialize formData with event data
  useEffect(() => {
    if (event) {
      setFormData({
        sponsors: event.sponsors || [],
        bannerDesktopImages: event.bannerDesktopImages || [],
        bannerMobileImages: event.bannerMobileImages || [],
        eventGallery: event.eventGallery || [],
        previousEventVideos: event.previousEventVideos || [],
        whatToExpect: event.whatToExpect || []
      });
    }
  }, [event]);

  // Generate event handle from event name
  const generateHandle = (eventName) => {
    if (!eventName) return "";
    return eventName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleDataChange = (field, data, setFieldValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: data
    }));
    if (setFieldValue && (field === 'bannerDesktopImages' || field === 'bannerMobileImages')) {
      setFieldValue(field, data);
    }
  };

  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    console.log("🚀 ~ EventDetailsInfo ~ Form Submission Initiated", {
      formValues: values,
      step: "SEND_BUTTON_CLICKED"
    });

    // Ensure coordinates are valid numbers
    const longitude = location?.lng ? parseFloat(location.lng) : 0;
    const latitude = location?.lat ? parseFloat(location.lat) : 0;

    if (isNaN(longitude) || isNaN(latitude)) {
      console.log("❌ ~ EventDetailsInfo ~ Location Validation Failed", {
        longitude,
        latitude,
        step: "LOCATION_VALIDATION_FAILED"
      });
      setFieldError('locationName', 'Invalid location coordinates. Please select a valid location.');
      setSubmitting(false);
      setShowToast(true);
      setToastMessage('Invalid location coordinates. Please select a valid location.');
      setIsErrorToast(true);
      return;
    }

    // Process tags - convert comma-separated string to array
    const processedTags = values.tags
      ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Collect all form data
    const allFormData = {
      step: 1,
      eventId: eventId,
      eventName: values.eventName || "",
      ownerUserId: ownerId,
      handle: values.handle || "",
      description: values.description || "",
      preRequisites: values.preRequisites || "",
      startDate: values.startDate ? formatDate(values.startDate) : null,
      bookingStartDate: values.bookingStartDate ? formatDate(values.bookingStartDate) : null,
      bookingEndDate: values.bookingEndDate ? formatDate(values.bookingEndDate) : null,
      startTime: values.startTime || "",
      endTime: values.endTime || "",
      maxParticipants: parseInt(values.maxParticipants) || 0,
      registrationFee: parseFloat(values.registrationFee) || 0,
      instagramHandle: values.instagramHandle || "",
      whatsappGroupLink: values.whatsappGroupLink || "",
      tags: processedTags,
      eventLocation: {
        name: values.locationName,
        address: {
          line1: values.line1,
          line2: values.line2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          location: {
            coordinates: [longitude, latitude],
            type: "Point"
          }
        }
      },
      whatToExpect: formData.whatToExpect || [],
      ...formData
    };

    console.log("🚀 ~ EventDetailsInfo ~ Form Data Collected", {
      allFormData,
      additionalFormData: formData,
      step: "FORM_DATA_COLLECTION_COMPLETE"
    });

    updateEvent(allFormData, {
      onSuccess: (data) => {
        console.log("🎉 ~ EventDetailsInfo ~ Event Updated Successfully", {
          responseData: data,
          step: "EVENT_UPDATE_SUCCESS"
        });
        setShowToast(true);
        setToastMessage('Event updated successfully!');
        setIsErrorToast(false);
        // Add a small delay before navigation to allow the toast to be seen
        setTimeout(() => {
          navigate('/social-events');
        }, 1500);
      },
      onError: (error) => {
        console.error("❌ ~ EventDetailsInfo ~ Event Update Failed", {
          error: error,
          formData: allFormData,
          step: "EVENT_UPDATE_ERROR"
        });
        setShowToast(true);
        setToastMessage(error?.message || 'Failed to update event. Please try again.');
        setIsErrorToast(true);
        setSubmitting(false);
      }
    });
    setSubmitting(false);
  };

  // Helper function to format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load event details. Please try again later.</span>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        // Update location fields when location changes
        useEffect(() => {
          if (location.city || location.state || location.lng || location.lat) {
            setFieldValue('locationName', location?.name || '');
            setFieldValue('line1', location?.address_line1 || '');
            setFieldValue('line2', location?.address_line2 || '');
            setFieldValue('city', location?.city || '');
            setFieldValue('state', location?.state || '');
            setFieldValue('postalCode', location?.pin_code || '');
          }
        }, [location, setFieldValue]);

        return (
          <Form className={`${!isEdit ? 'pointer-events-none opacity-60' : ''}`}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px] mt-4'>
              <div className='flex flex-col items-start gap-3'>
                <p className='text-base leading-[19.36px] text-[#232323]'>Event name</p>
                <Field
                  type="text"
                  name="eventName"
                  placeholder="Enter Event Name"
                  className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => {
                    const eventName = e.target.value;
                    setFieldValue('eventName', eventName);
                    setFieldValue('handle', generateHandle(eventName));
                  }}
                />
                <ErrorMessage name="eventName" component="div" className="text-red-500 text-sm" />
              </div>

              <FormInput
                label="Event handle"
                name="handle"
                placeholder="Enter Event handle"
              />

              <FormInput
                label="Tags"
                name="tags"
                placeholder="Enter tags separated by commas"
              />

              <div className='flex flex-col items-start gap-3 md:w-[48%] col-span-1 md:col-span-2'>
                <p className='text-base leading-[19.36px] text-[#232323]'>Google Map</p>
                <LocationSearchInput
                  id="eventLocation.address.location"
                  name="eventLocation.address.location"
                />
              </div>

              <div className='flex flex-col items-start gap-3'>
                <p className='text-base leading-[19.36px] text-[#232323]'>Event Address</p>
                <p className='text-sm leading-[16.36px] text-[#232323]'>Location Name</p>
                <Field
                  type="text"
                  name="locationName"
                  placeholder="Enter Location Name"
                  className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <ErrorMessage name="locationName" component="div" className="text-red-500 text-sm" />
              </div>

              <FormInput
                label="Line 1"
                name="line1"
                placeholder="Enter Line 1"
                styles={'justify-end'}
              />

              <FormInput
                label="Line 2"
                name="line2"
                placeholder="Enter Line 2"
              />

              <FormInput
                label="City"
                name="city"
                placeholder="Enter City"
              />

              <FormInput
                label="State"
                name="state"
                placeholder="Enter State"
              />

              <div className='flex flex-col items-start gap-3'>
                <p className='text-base leading-[19.36px] text-[#232323]'>Pincode</p>
                <Field
                  type="text"
                  name="postalCode"
                  placeholder="Enter Pincode"
                  className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onKeyPress={(e) => {
                    // Only allow numbers
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength="6"
                />
                <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='flex flex-col items-start gap-3 relative'>
                <p className='text-sm leading-[16.36px] text-[#232323]'>Registration Start Date</p>
                <Field name="bookingStartDate">
                  {({ form, field }) => (
                    <>
                      <DatePicker
                        id="bookingStartDate"
                        name="bookingStartDate"
                        placeholderText="Select date"
                        startDate=""
                        toggleCalendarOnIconClick
                        className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minDate={new Date()}
                        dateFormat="dd/MM/yy"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (date) {
                            form.setFieldValue("bookingStartDate", date);
                          }
                        }}
                      />
                    </>
                  )}
                </Field>
                <ErrorMessage name="bookingStartDate" component={TextError} />
              </div>

              <div className='flex flex-col items-start gap-3 relative'>
                <p className='text-sm leading-[16.36px] text-[#232323]'>Registration End Date</p>
                <Field name="bookingEndDate">
                  {({ form, field }) => (
                    <>
                      <DatePicker
                        id="bookingEndDate"
                        name="bookingEndDate"
                        placeholderText="Select date"
                        startDate=""
                        toggleCalendarOnIconClick
                        className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minDate={new Date()}
                        dateFormat="dd/MM/yy"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (date) {
                            form.setFieldValue("bookingEndDate", date);
                          }
                        }}
                      />
                    </>
                  )}
                </Field>
                <ErrorMessage name="bookingEndDate" component={TextError} />
              </div>

              <FormInput
                label="Start Time (24 hrs)"
                name="startTime"
                type="time"
                placeholder="Enter Start Time"
              />

              <FormInput
                label="End Time (24 hrs)"
                name="endTime"
                type="time"
                placeholder="Enter End Time"
              />

              <div className='flex flex-col items-start gap-3 relative'>
                <p className='text-sm leading-[16.36px] text-[#232323]'>Start Date</p>
                <Field name="startDate">
                  {({ field, form }) => (
                    <>
                      <DatePicker
                        id="startDate"
                        name="startDate"
                        placeholderText="Select date"
                        toggleCalendarOnIconClick
                        selected={field.value ? new Date(field.value) : null}
                        className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minDate={new Date()}
                        dateFormat="dd/MM/yy"
                        onChange={(date) => {
                          if (date) {
                            form.setFieldValue("startDate", date);
                          }
                        }}
                      />
                    </>
                  )}
                </Field>
                <ErrorMessage name="startDate" component={TextError} />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-3 md:gap-[30px] mt-4'>

              <FormInput
                label="Maximum Participants"
                name="maxParticipants"
                type="number"
                placeholder="Enter max participants"
              />
              <FormInput
                label="Registration fee"
                name="registrationFee"
                type="number"
                step="0.01"
                placeholder="Enter Registration Fee"
              />

              <FormInput
                label="Instagram Handle"
                name="instagramHandle"
                placeholder="Enter Instagram Handle"
              />

              <FormInput
                label="WhatsApp Group Link"
                name="whatsappGroupLink"
                placeholder="Enter WhatsApp Group Link"
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
                value={values.description}
                onChange={(content) => setFieldValue('description', content)}
                placeholder="Enter Event Description"
                className="custom-quill"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
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
                value={values.preRequisites}
                onChange={(content) => setFieldValue('preRequisites', content)}
                placeholder="Enter Pre-requisites"
                className="custom-quill"
              />
              <ErrorMessage name="preRequisites" component="div" className="text-red-500 text-sm" />
            </div>

            <div className='flex flex-col items-start gap-3 mt-3'>
              <WhatToExpectTable
                disabled={false}
                data={formData.whatToExpect}
                onChange={(data) => handleDataChange('whatToExpect', data)}
              />
            </div>

            <div className='flex flex-col items-start gap-3 mt-3'>
              <SponsorTable
                disabled={false}
                data={formData.sponsors}
                onChange={(data) => handleDataChange('sponsors', data)}
              />
            </div>

            <div className='flex flex-col md:flex-row items-start gap-3 mt-3'>
              <div className='w-full md:w-1/2'>
                <BannerDesktopTable
                  disabled={false}
                  data={formData.bannerDesktopImages}
                  onChange={(data) => handleDataChange('bannerDesktopImages', data, setFieldValue)}
                />
                <ErrorMessage name="bannerDesktopImages" component={TextError} />
              </div>

              <div className='w-full md:w-1/2'>
                <BannerMobileTable
                  disabled={false}
                  data={formData.bannerMobileImages}
                  onChange={(data) => handleDataChange('bannerMobileImages', data, setFieldValue)}
                />
                <ErrorMessage name="bannerMobileImages" component={TextError} />
              </div>
            </div>

            <div className='flex flex-col items-start gap-3 mt-3'>
              <EventGalleryTable
                disabled={false}
                data={formData.eventGallery}
                onChange={(data) => handleDataChange('eventGallery', data)}
              />
            </div>

            <div className='flex flex-col items-start gap-3 mt-3'>
              <PreviousEventVideosTable
                disabled={false}
                data={formData.previousEventVideos}
                onChange={(data) => handleDataChange('previousEventVideos', data)}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>

            {showToast && (
              <Toast
                successMessage={!isErrorToast ? toastMessage : null}
                error={isErrorToast ? toastMessage : null}
                onClose={() => setShowToast(false)}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
}

export default EventDetailsInfo