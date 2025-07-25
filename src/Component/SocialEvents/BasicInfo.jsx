import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import SponsorTable from './SponsorTable';
import WhatToExpectTable from './WhatToExpectTable';
import BannerDesktopTable from './BannerDesktopTable';
import BannerMobileTable from './BannerMobileTable';
import EventGalleryTable from './EventGalleryTable';
import PreviousEventVideosTable from './PreviousEventVideosTable';
import ReactQuill from 'react-quill';
import { useCreateEvent, useEventOwnerData } from '../../Hooks/SocialEventsHooks';
import LocationSearchInput from "../Common/LocationSearch";
import { resetGlobalLocation } from "../../redux/Location/locationSlice";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextError from "../Error/formError";

// Validation Schema
const validationSchema = Yup.object({
  organiser: Yup.string().required('Event organiser is required'),
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

const FormSelect = ({ label, name, options, placeholder, className = "" }) => (
  <div className='flex flex-col items-start gap-3'>
    <p className='text-base leading-[19.36px] text-[#232323] capitalize'>{label}</p>
    <Field
      as="select"
      name={name}
      className={`w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);

const BasicInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: createEvent } = useCreateEvent();

  // Add state for API error handling
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    sponsors: [],
    bannerDesktopImages: [],
    bannerMobileImages: [],
    eventGallery: [],
    previousEventVideos: [],
    whatToExpect: []
  });

  // Use the new event owner data hook instead of tournament owners
  const { eventOwners, singleEventOwner, isLoading: isLoadingOwners, userRole } = useEventOwnerData();
  const { location } = useSelector((state) => state.location);

  // Memoize initial form values to prevent unnecessary re-renders and form resets
  const initialValues = useMemo(() => ({
    organiser: "",
    eventName: "",
    handle: "",
    locationName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    startDate: null,
    bookingStartDate: null,
    bookingEndDate: null,
    startTime: "",
    endTime: "",
    maxParticipants: "",
    registrationFee: "",
    instagramHandle: "",
    whatsappGroupLink: "",
    tags: "",
    description: "",
    preRequisites: "",
    bannerDesktopImages: [],
    bannerMobileImages: []
  }), []); // Empty dependency array - only initialize once

  // Reset location when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetGlobalLocation());
    };
  }, [dispatch]);

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
    // Clear any previous API errors
    setApiError('');

    console.log("🚀 ~ BasicInfo ~ Send Button Clicked - Form Submission Initiated", {
      formValues: values,
      step: "SEND_BUTTON_CLICKED"
    });

    // Ensure coordinates are valid numbers
    const longitude = location?.lng ? parseFloat(location.lng) : 0;
    const latitude = location?.lat ? parseFloat(location.lat) : 0;

    // Validate that we have a valid organiser selected
    if (!values.organiser) {
      setFieldError('organiser', 'Please select an event organiser');
      setSubmitting(false);
      return;
    }

    console.log("🚀 ~ BasicInfo ~ Location Validation", {
      longitude,
      latitude,
      location,
      isValidLongitude: !isNaN(longitude),
      isValidLatitude: !isNaN(latitude),
      step: "LOCATION_VALIDATION"
    });

    if (isNaN(longitude) || isNaN(latitude)) {
      console.log("❌ ~ BasicInfo ~ Location Validation Failed", {
        longitude,
        latitude,
        step: "LOCATION_VALIDATION_FAILED"
      });
      setFieldError('locationName', 'Invalid location coordinates. Please select a valid location.');
      setSubmitting(false);
      return;
    }

    // Process tags - convert comma-separated string to array
    const processedTags = values.tags
      ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Collect all form data
    const allFormData = {
      step: 1,
      eventId: "",
      ownerUserId: values.organiser || "",
      eventName: values.eventName || "",
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

    console.log("🚀 ~ BasicInfo ~ Form Data Collected", {
      allFormData,
      additionalFormData: formData,
      step: "FORM_DATA_COLLECTION_COMPLETE"
    });

    console.log("🚀 ~ BasicInfo ~ Form Submission Started", {
      formData: allFormData,
      step: "FORM_VALIDATION_PASSED"
    });

    createEvent(allFormData, {
      onSuccess: (data) => {
        console.log("🎉 ~ BasicInfo ~ Event Created Successfully", {
          responseData: data,
          eventId: data?.eventId,
          eventObject: data?.event,
          eventObjectId: data?.event?._id,
          step: "EVENT_CREATION_SUCCESS"
        });

        // Try to get eventId from different possible locations in response
        const eventId = data?.eventId || data?.event?._id || data?.event?.id;

        console.log("🚀 ~ BasicInfo ~ Event ID Resolution", {
          eventId,
          fromEventId: data?.eventId,
          fromEventObjectId: data?.event?._id,
          fromEventObjectIdAlt: data?.event?.id,
          step: "EVENT_ID_RESOLUTION"
        });

        // Navigate to acknowledgement page with the event ID
        if (eventId) {
          console.log("🚀 ~ BasicInfo ~ Navigating to Acknowledgement", {
            eventId: eventId,
            ownerUserId: values.organiser,
            navigationPath: `/social-events/${eventId}/acknowledgement`,
            step: "NAVIGATION_TO_ACKNOWLEDGEMENT"
          });

          // Store ownerUserId in localStorage for acknowledgement page
          localStorage.setItem(`event_${eventId}_ownerUserId`, values.organiser);

          navigate(`/social-events/${eventId}/acknowledgement`);
        } else {
          console.log("❌ ~ BasicInfo ~ No Event ID in Response", {
            responseData: data,
            checkedPaths: {
              eventId: data?.eventId,
              eventObjectId: data?.event?._id,
              eventObjectIdAlt: data?.event?.id
            },
            step: "MISSING_EVENT_ID"
          });
        }

        setSubmitting(false);
      },
      onError: (error) => {
        console.error("❌ ~ BasicInfo ~ Event Creation Failed", {
          error: error,
          formData: allFormData,
          step: "EVENT_CREATION_ERROR"
        });

        // Extract error message from the error object
        let errorMessage = 'An error occurred while creating the event. Please try again.';

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        // Set the API error to display near the submit button
        setApiError(errorMessage);
        setSubmitting(false);
      }
    });
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => {
        // Auto-populate organiser field for event owners
        useEffect(() => {
          if (userRole === 'EVENT_OWNER' && singleEventOwner && !values.organiser) {
            setFieldValue('organiser', singleEventOwner.id);
          }
        }, [userRole, singleEventOwner, values.organiser, setFieldValue]);

        // Update location fields when location changes, but only if location fields are empty
        // This prevents overwriting user-entered data
        useEffect(() => {
          if (location.city || location.state || location.lng || location.lat) {
            // Only update if the field is currently empty to avoid overwriting user input
            if (!values.locationName) setFieldValue('locationName', location?.name || '');
            if (!values.line1) setFieldValue('line1', location?.address_line1 || '');
            if (!values.line2) setFieldValue('line2', location?.address_line2 || '');
            if (!values.city) setFieldValue('city', location?.city || '');
            if (!values.state) setFieldValue('state', location?.state || '');
            if (!values.postalCode) setFieldValue('postalCode', location?.pin_code || '');
          }
        }, [location, setFieldValue, values.locationName, values.line1, values.line2, values.city, values.state, values.postalCode]);

        return (
          <Form>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px] mt-4'>
              <FormSelect
                label="Event Organiser name"
                name="organiser"
                placeholder={isLoadingOwners ? "Loading organisers..." : "Select Organiser"}
                options={(() => {
                  if (userRole === 'ADMIN') {
                    // For admin users, show all event owners
                    return eventOwners?.map(owner => ({
                      value: owner.id,
                      label: owner.name
                    })) || [];
                  } else if (userRole === 'EVENT_OWNER' && singleEventOwner) {
                    // For event owners, show only their own details
                    return [{
                      value: singleEventOwner.id,
                      label: singleEventOwner.name
                    }];
                  }
                  return [];
                })()}
                disabled={isLoadingOwners || (userRole === 'EVENT_OWNER')}
              />

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
                className="capitalize"
                placeholder="Enter Line 1"
                styles="justify-end"
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
                label="Event Start Time (24 hrs)"
                name="startTime"
                type="time"
                placeholder="Enter Start Time"
              />

              <FormInput
                label="Event End Time (24 hrs)"
                name="endTime"
                type="time"
                placeholder="Enter End Time"
              />

              <div className='flex flex-col items-start gap-3 relative'>
                <p className='text-sm leading-[16.36px] text-[#232323]'>Event Start Date</p>
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
                onChange={(data) => handleDataChange('whatToExpect', data)}
              />
            </div>

            <div className='flex flex-col items-start gap-3 mt-3'>
              <SponsorTable
                disabled={false}
                onChange={(data) => handleDataChange('sponsors', data)}
              />
            </div>

            <div className='flex flex-col md:flex-row items-start gap-3 mt-3'>
              <div className='w-full md:w-1/2'>
                <BannerDesktopTable
                  disabled={false}
                  onChange={(data) => handleDataChange('bannerDesktopImages', data, setFieldValue)}
                />
                <ErrorMessage name="bannerDesktopImages" component={TextError} />
              </div>

              <div className='w-full md:w-1/2'>
                <BannerMobileTable
                  disabled={false}
                  onChange={(data) => handleDataChange('bannerMobileImages', data, setFieldValue)}
                />
                <ErrorMessage name="bannerMobileImages" component={TextError} />
              </div>
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

            <div className="flex flex-col items-end mt-6 gap-3">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>

              {/* Display API Error Message */}
              {apiError && (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-center py-3 relative">
                    <div className="">
                      <p className="text-sm font-medium text-red-800">
                        Error creating event
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {apiError}
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 p-2 text-sm text-red-500">
                      <button
                        type="button"
                        onClick={() => setApiError('')}
                        className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default BasicInfo