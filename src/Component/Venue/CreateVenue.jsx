import {
  Formik,
  ErrorMessage,
  Field,
  Form,
  FieldArray,
  useFormikContext,
} from "formik";
import ReactQuill from "react-quill";

import { useFormikContextFunction } from "../../Providers/formikContext";

import TextError from "../Error/formError";
import { Amenities, Equipment } from "../../Constant/venue";
import { AiFillQuestionCircle } from "react-icons/ai";
import { uploadIcon, venueUploadImage } from "../../Assests";
import Button from "../Common/Button";
import * as yup from "yup";
import { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addVenue,
  getSingleVenue,
  updateVenue,
  getUniqueVenueTags,
} from "../../redux/Venue/venueActions";
import { ErrorModal } from "../Common/ErrorModal";
import { showError } from "../../redux/Error/errorSlice";
import { SuccessModal } from "../Common/SuccessModal";
import { showSuccess } from "../../redux/Success/successSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Common/Spinner";
import LocationSearchInput from "../Common/LocationSearch";
import { uploadImage } from "../../redux/Upload/uploadActions";
import { resetVenueState } from "../../redux/Venue/addVenue";
import Combopopover from "../Common/Combobox";
import { phoneRegex, venueImageSize } from "../../Constant/app";
import { Switch } from "@headlessui/react";

const requiredVenueFields = (venue) => {
  const {
    name,
    handle,
    tags,
    phoneNumber,
    address,
    description,
    availableDays,
    amenities,
    allDaysSelected,
    globalOpeningTime,
    globalClosingTime,
    equipments,
    bannerImages,
    layoutImages,
    venueInfoUrl,
  } = venue;

  return {
    name,
    handle,
    tags,
    phoneNumber,
    address,
    description,
    availableDays,
    amenities,
    allDaysSelected,
    globalOpeningTime,
    globalClosingTime,
    equipments,
    bannerImages,
    layoutImages,
    venueInfoUrl,
  };
};

const hasSelectedDays = (days) => {
  return days.some((day) => !!day.day);
};

const validateTimes = (days) => {
  return days.every((day) => {
    if (day.day && day.active) {
      return !!day.openingTime && !!day.closingTime;
    }

    return true;
  });
};

const validateOpenAndCloseTime = (days) => {
  return days.every((day) => {
    if (day.day && day.active) {
      const openingTime = new Date(`1970-01-01T${day.openingTime}:00`);
      const closingTime = new Date(`1970-01-01T${day.closingTime}:00`);
      return openingTime < closingTime;
    }

    return true;
  });
};

const initialValues = {
  name: "",
  handle: "",
  venueInfoUrl: "",
  tags: [],
  phoneNumber: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    location: {
      type: "Point",
      coordinates: [],
    },
  },
  description: "",
  availableDays: [
    { day: "All days", openingTime: "", closingTime: "", active: false },
    { day: "monday", openingTime: "", closingTime: "", active: false },
    { day: "tuesday", openingTime: "", closingTime: "", active: false },
    { day: "wednesday", openingTime: "", closingTime: "", active: false },
    { day: "thursday", openingTime: "", closingTime: "", active: false },
    { day: "friday", openingTime: "", closingTime: "", active: false },
    { day: "saturday", openingTime: "", closingTime: "", active: false },
    { day: "sunday", openingTime: "", closingTime: "", active: false },
  ],
  amenities: [],
  equipments: [],
  bannerImages: [],
  layoutImages: [],
  rating: [],
  comments: [],
};

const VenueInfo = () => {
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required.")
      .min(3, "Name must be at least 3 characters long.")
      .max(50, "Name cannot exceed 50 characters."),
    handle: yup.string().required("Venue handle is required."),
    address: yup.object().shape({
      line1: yup
        .string()
        .notRequired()
        .max(100, "Line 1 of the address cannot exceed 50 characters."),
      line2: yup
        .string()
        .notRequired()
        .max(100, "Line 2 of the address cannot exceed 50 characters."),
      city: yup.string().required("City is required."),
      state: yup.string().required("State is required."),
      postalCode: yup
        .string()
        .required("Postal Code is required.")
        .matches(/^\d{6}$/, "Postal Code must be 6 digits."),
      location: yup.object().shape({
        type: yup
          .string()
          .oneOf(["Point"], "Location type must be 'Point'.")
          .required("Location type is required."),
        coordinates: yup
          .array()
          .of(yup.number().required("Each coordinate must be a number."))
          .length(2, "Location must be provided.")
          .required("Location is required."),
      }),
    }),
    description: yup.string().required("Description is required."),
    phoneNumber: yup
      .string()
      .optional()
      .test(
        "Invalid-phone-number",
        "Enter a valid phone number",
        function (value) {
          if (!value) {
            return true;
          }

          return phoneRegex.test(value);
        }
      ),
    availableDays: yup
      .array()
      .test(
        "at-least-one-day",
        "Please select at least one day",
        hasSelectedDays
      )
      .test(
        "valid-times",
        "Opening and closing times are required for selected days",
        validateTimes
      )
      .test(
        "compare-time",
        "Closing time should be greater than opening time.",
        validateOpenAndCloseTime
      )
      .test(
        "unique-days",
        "Each day must have unique opening and closing times, and no duplicate days are allowed.",
        function () {
          const { availableDays } = this.parent;
          const uniqueDays = new Set();

          for (const daySelected of availableDays) {
            if (daySelected.day) {
              if (uniqueDays.has(daySelected.day)) {
                return false;
              }
              uniqueDays.add(daySelected.day);
            }
          }
          return true;
        }
      ),

    amenities: yup
      .array()
      .of(yup.string())
      .min(1, "At least one amenity must be provided."),
    equipments: yup
      .array()
      .of(yup.string())
      .min(1, "At least one equipment item must be provided."),
    bannerImages: yup
      .array()
      .min(1, "At least one banner image must be uploaded."),

    layoutImages: yup
      .array()
      .min(1, "At least one layout image must be uploaded."),
    rating: yup.array().of(yup.number().min(0).max(5)),
    comments: yup.array().of(yup.string()),
  });

  const { setSubmitForm, setIsSubmitting } = useFormikContextFunction();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.Venue);
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const { id } = useParams();
  const [initialState, setInitialState] = useState(initialValues);
  const { location } = useSelector((state) => state.Venue);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    const filteredDays = values.availableDays.filter((days) => days.day);

    const updatedValues = { ...values, availableDays: filteredDays };

    try {
      !id
        ? await dispatch(addVenue(updatedValues)).unwrap()
        : await dispatch(updateVenue({ formData: values, id })).unwrap();

      resetForm();
      dispatch(
        showSuccess({
          message: id
            ? "Venue updated successfully"
            : "Venue added successfully",
          onClose: "hideSuccess",
        })
      );

      setTimeout(() => {
        !id ? navigate("/venues") : navigate(`/venues/${id}`);
      }, 2000);
    } catch (error) {
      dispatch(
        showError({
          message: error.data.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    } finally {
      setSubmitting(false);
      dispatch(resetVenueState());
    }
  };

  const {
    venue,
    isLoading: isGettingVenue,
    isSuccess,
  } = useSelector((state) => state.getVenues);

  const { isGettingTags, uniqueTags, tagError } = useSelector(
    (state) => state.getVenues
  );
  useEffect(() => {
    if (id) {
      dispatch(getSingleVenue(id));
    }
  }, [id]);

  useEffect(() => {
    dispatch(getUniqueVenueTags());
  }, []);

  useEffect(() => {
    if (venue && id && isSuccess) {
      const values = requiredVenueFields(venue);

      setInitialState({
        ...initialState,
        ...values,
        availableDays: values.availableDays,
      });

      setSelectedTags(values.tags);
    }
  }, [venue, id, isSuccess]);

  const { uplodedData, isUploading, isUploaded } = useSelector(
    (state) => state.upload
  );

  if (isGettingVenue) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => {
        setSubmitForm(() => submitForm);
        setIsSubmitting(isSubmitting);
        return (
          <Form>
            <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323] rounded-3xl py-[50px] px-[48px]">
              <ErrorModal />
              <SuccessModal />
              <VenueBasicInfo id={id} />
              <VenueAddress location={location} id={id} />
              <VenueMetaData
                isGettingTags={isGettingTags}
                uniqueTags={uniqueTags}
                selectedTags={selectedTags}
                id={id}
              />
              <VenueDescription id={id} />
              <VenueAvailableDays id={id} />
              <VenueAmenities id={id} />
              <VenueEquipments id={id} />
              <VenueBannerImage
                dispatch={dispatch}
                uploadData={uplodedData}
                isUploading={isUploading}
                id={id}
              />
              <VenueLayoutImage
                dispatch={dispatch}
                uploadData={uplodedData}
                isUploading={isUploading}
                id={id}
              />
              <Button
                className={`${
                  id
                    ? "hidden"
                    : "w-[150px] h-[60px] bg-[#1570EF] ml-auto rounded-[8px] text-[#FFFFFF]"
                }`}
                type="submit"
                loading={isLoading}
              >
                Save
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const VenueBasicInfo = ({ id }) => {
  const { setFieldValue } = useFormikContext();
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);

  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="name"
        >
          Venue Name
        </label>
        <Field
          disabled={id ? !venueEditMode : false}
          placeholder="Enter Venue Name"
          id="name"
          name="name"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5 w-full">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="address.location"
        >
          Google Map
        </label>

        <LocationSearchInput
          id="address.location"
          name="address.location"
          setFieldValue={setFieldValue}
          isEdit={id?true:false}
        />
        <ErrorMessage
          name="address.location.coordinates"
          component={TextError}
        />
      </div>
    </div>
  );
};

const VenueMetaData = ({ isGettingTags, uniqueTags, selectedTags, id }) => {
  const [venueHandle, setVenueHandle] = useState("");
  const { values, setFieldValue } = useFormikContext();
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  console.log("values venue", values);
  useEffect(() => {
    if (values.name) {
      const { name } = values;
      const handle = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setVenueHandle(handle);
      setFieldValue("handle", handle);
    }
  }, [values.name]);

  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="handle"
        >
          Venue Handle
        </label>
        <Field
          disabled={id ? !venueEditMode : false}
          placeholder="Enter Venue Handle"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setFieldValue("handle", e.target.value);
          }}
        />
        <ErrorMessage name="handle" component={TextError} />
      </div>

      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="venueInfoUrl"
        >
          Redirection Link
        </label>
        <Field
          disabled={id ? !venueEditMode : false}
          placeholder="Enter Venue redirection link"
          id="venueInfoUrl"
          name="venueInfoUrl"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setFieldValue("venueInfoUrl", e.target.value);
          }}
        />
        {/* <ErrorMessage name="handle" component={TextError} /> */}
      </div>

      <Combopopover
        isGettingTags={isGettingTags}
        uniqueTags={uniqueTags}
        setFieldValue={setFieldValue}
        checkedTags={selectedTags}
        placeholder="Enter Venue Tags"
        label="Venue Tags"
        id={id}
      />
      <ErrorMessage name="tags" component={TextError} />
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="phoneNumber"
        >
          Phone Number
        </label>
        <Field
          disabled={id ? !venueEditMode : false}
          placeholder="Enter Phone Number"
          id="phoneNumber"
          name="phoneNumber"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setFieldValue("phoneNumber", e.target.value);
          }}
          onWheel={(e) => e.target.blur()}
        />

        <ErrorMessage name="phoneNumber" component={TextError} />
      </div>
    </div>
  );
};

const VenueAddress = ({ location, id }) => {
  const { setFieldValue } = useFormikContext();
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  useEffect(() => {
    if (location.city || location.state) {
      setFieldValue("address.line1", location?.address_line1);
      setFieldValue("address.line2", location.address_line2);
      setFieldValue("address.city", location.city);
      setFieldValue("address.state", location.state);
      setFieldValue("address.postalCode", location.pin_code);
    }
  }, [
    location.lat,
    location.lng,
    location.city,
    location.state,
    location.pin_code,
    location.address_line1,
    location.address_line2,
  ]);
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-base leading-[19.36px] text-[#232323]">
        Venue Address
      </p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.line1">
            Line 1
          </label>
          <Field
            disabled={id ? !venueEditMode : false}
            placeholder="Enter Venue Address"
            id="address.line1"
            name="address.line1"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            // value={location.address_line1}
          />
          <ErrorMessage name="address.line1" component={TextError} />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.line2">
            Line 2
          </label>
          <Field
            disabled={id ? !venueEditMode : false}
            placeholder="Enter Venue Address"
            id="address.line2"
            name="address.line2"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            // value={location.address_line2}
          />
          <ErrorMessage name="address.line2" component={TextError} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.city">
            City
          </label>
          <Field
            disabled={id ? !venueEditMode : false}
            placeholder="Enter Venue Address"
            id="address.city"
            name="address.city"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            // value={location.city}
          />
          <ErrorMessage name="address.city" component={TextError} />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.state">
            State
          </label>
          <Field
            disabled={id ? !venueEditMode : false}
            placeholder="Enter Venue Address"
            id="address.state"
            name="address.state"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            // value={location.state}
          />
          <ErrorMessage name="address.state" component={TextError} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="address.postalCode"
          >
            Pincode
          </label>
          <Field
            disabled={id ? !venueEditMode : false}
            placeholder="Enter Venue Address"
            id="address.postalCode"
            name="address.postalCode"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            // value={location.pin_code}
          />
          <ErrorMessage name="address.postalCode" component={TextError} />
        </div>
      </div>
    </div>
  );
};

const VenueDescription = ({ id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.description) {
      setFieldValue("description", values.description);
    }
  }, [values.description]);

  return (
    <div className="grid grid-cols-1 gap-2 items-start">
      <p className=" text-[#232323] text-base leading-[19.36px] justify-self-start">
        Description
      </p>

      <ReactQuill
        theme="snow"
        id="description"
        name="description"
        placeholder="Enter Venue Description"
        onChange={(e) => {
          setFieldValue("description", e);
        }}
        className="custom-quill"
        value={values.description}
        readOnly={id ? !venueEditMode : false}
      />
      <ErrorMessage
        name="description"
        component={TextError}
        className="items-center"
      />
    </div>
  );
};

const VenueAvailableDays = ({ id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const { values, setFieldValue } = useFormikContext();
  const handleToggle = useCallback(
    (day, index) => {
      if (day === "All days") {
        const newAllDaysActive = !values.availableDays[index].active;
        setFieldValue(`availableDays[${index}].active`, newAllDaysActive);
        console.log(" new All days active", newAllDaysActive);

        if (newAllDaysActive) {
          const allDaysTimes = {
            openingTime: values.availableDays[index].openingTime,
            closingTime: values.availableDays[index].closingTime,
          };

          values.availableDays.forEach((_, i) => {
            if (i !== index) {
              setFieldValue(`availableDays[${i}].active`, true);
              setFieldValue(
                `availableDays[${i}].openingTime`,
                allDaysTimes.openingTime
              );
              setFieldValue(
                `availableDays[${i}].closingTime`,
                allDaysTimes.closingTime
              );
            }
          });
        }
      } else {
        const newActive = !values.availableDays[index].active;
        setFieldValue(`availableDays[${index}].active`, newActive);
      }
    },
    [setFieldValue, values.availableDays]
  );

  useEffect(() => {
    const allDaysIndex = values.availableDays.findIndex(
      (day) => day.day === "All days"
    );
    if (allDaysIndex === -1) return;

    const allDaysEntry = values.availableDays[allDaysIndex];
    const individualDays = values.availableDays.filter(
      (day) => day.day !== "All days"
    );

    const isAnyDayNotActive = individualDays.some((day) => !day.active);

    if (allDaysEntry.active) {
      values.availableDays.forEach((_, index) => {
        if (index !== allDaysIndex) {
          setFieldValue(
            `availableDays[${index}].openingTime`,
            allDaysEntry.openingTime
          );
          setFieldValue(
            `availableDays[${index}].closingTime`,
            allDaysEntry.closingTime
          );
        }
      });

      if (isAnyDayNotActive) {
        setFieldValue(`availableDays[${allDaysIndex}].active`, false);
      }
    }
  }, [
    values.availableDays[0].openingTime,
    values.availableDays[0].closingTime,
    values.availableDays,
  ]);

  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-[#232323] text-base leading-[19.36px]">
        Available Days
      </p>

      <FieldArray name="availableDays">
        {({ form, remove, push }) => {
          return (
            <div className="grid grid-cols-1 gap-2.5 w-full border rounded-[10px] border-[#DFEAF2] p-[20px] ">
              {form?.values?.availableDays.map((dayObj, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-1 lg:grid-cols-3 gap-[10px] items-center "
                >
                  <div className="flex gap-2.5">
                    <Switch
                      disabled={id ? !venueEditMode : false}
                      checked={dayObj.active}
                      onChange={() => {
                        handleToggle(dayObj.day, index);
                      }}
                      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                      />
                    </Switch>
                    <p>{dayObj.day}</p>
                  </div>
                  <label className="flex flex-col items-start gap-2.5 justify-center">
                    Opening Time
                    <Field
                      type="time"
                      name={`availableDays[${index}].openingTime`}
                      className="w-full px-3 py-2 border rounded"
                      disabled={(id ? !venueEditMode : false) || !dayObj.active}
                    />
                    <ErrorMessage
                      name={`availableDays[${index}].openingTime`}
                      component={TextError}
                    />
                  </label>
                  <label className="flex flex-col items-start gap-2.5">
                    Closing Time
                    <Field
                      type="time"
                      name={`availableDays[${index}].closingTime`}
                      className="w-full px-3 py-2 border rounded"
                      disabled={(id ? !venueEditMode : false) || !dayObj.active}
                    />
                    <ErrorMessage
                      name={`availableDays[${index}].closingTime`}
                      component={TextError}
                    />
                  </label>
                </div>
              ))}
            </div>
          );
        }}
      </FieldArray>
      <ErrorMessage name="availableDays" component={TextError} />
    </div>
  );
};

const VenueAmenities = ({ id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const { values } = useFormikContext();

  return (
    <div className="flex flex-col items-start gap-2.5">
      <div className="flex gap-[10px]">
        <p className="text-base leading-[19.36px] text-[#232323] ">Amenities</p>
        <AiFillQuestionCircle />
      </div>

      <FieldArray name="amenities">
        {({ push, remove, form }) => (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  p-[20px] gap-[20px] w-full border rounded-[10px] border-[#DFEAF2]">
            {Amenities.map((value, index) => {
              return (
                <label
                  className="text-[15px] text-[#232323] leading-[18px] flex items-center gap-[10px] p-[20px] shrink-0"
                  key={`value-${index}`}
                >
                  <Field
                    disabled={id ? !venueEditMode : false}
                    type="checkbox"
                    name="amenities"
                    value={value}
                    checked={values.amenities.includes(value)}
                    className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none checked:bg-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        push(value);
                      } else {
                        const idx = values.amenities.indexOf(value);
                        if (idx !== -1) remove(idx);
                      }
                    }}
                  />
                  {value}
                </label>
              );
            })}
          </div>
        )}
      </FieldArray>
      <ErrorMessage name="amenities" component={TextError} />
    </div>
  );
};

const VenueEquipments = ({ id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  return (
    <div className="flex flex-col items-start gap-2.5">
      <div className="flex gap-[10px]">
        <p className="text-base leading-[19.36px] text-[#232323] ">
          Equipments
        </p>
        <AiFillQuestionCircle />
      </div>

      <FieldArray name="equipments">
        {({ form }) => (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full border rounded-[10px] border-[#DFEAF2]">
            {Equipment.map((value, index) => {
              return (
                <div
                  key={value}
                  className="flex gap-[10px] items-center p-[17px] shrink-0"
                >
                  <label className="text-[15px] text-[#232323] leading-[18.15px]  flex items-center gap-[10px] p-[20px] ">
                    <Field
                      disabled={id ? !venueEditMode : false}
                      type="checkbox"
                      name="equipments"
                      checked={form.values.equipments.includes(value)}
                      value={value}
                      className=" w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
                    />
                    {value}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </FieldArray>
      <ErrorMessage name="equipments" component={TextError} />
    </div>
  );
};

const VenueBannerImage = ({ dispatch, uploadData, isUploading, id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const isDisabled = id ? !venueEditMode : false;
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  useEffect(() => {
    const previewMedia = values?.bannerImages?.length
      ? values.bannerImages.map((media) => ({
          preview: media.url,
          type: media.type || "image",
        }))
      : [];
    setPreviews(previewMedia);
  }, [values?.bannerImages]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemoveImage = (index) => {
    const newBannerImages = values.bannerImages.filter((_, i) => i !== index);
    setFieldValue("bannerImages", newBannerImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");

    const uploadedFile = e.target.files[0];
    const isImage = uploadedFile.type.startsWith("image/");
    const isVideo = uploadedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setFieldError("bannerImages", "Only images and videos are allowed.");
      dispatch(
        showError({
          message: "Only images and videos are allowed.",
          onClose: "hideError",
        })
      );
      return;
    }

    if (values.bannerImages.length >= 7) {
      dispatch(
        showError({
          message: "You can add up to 7 media files only.",
          onClose: "hideError",
        })
      );
      return;
    }

    try {
      const uploadIndex = previews.length;
      setUploadingIndex(uploadIndex);

      setPreviews((prev) => [...prev, { preview: null, isUploading: true }]);
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();

      const { url, type } = result?.data;
      // const mediaType = isVideo ? "video" : "image";

      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[uploadIndex] = { preview: url, type };
        return newPreviews;
      });
      setFieldValue("bannerImages", [...values.bannerImages, { url, type }]);
      setUploadingIndex(-1);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("bannerImages", err.data.message);

      setPreviews((prev) => prev.filter((_, i) => i !== uploadingIndex));
      setUploadingIndex(-1);
    }
  };

  return (
    <div className=" flex flex-col items-start gap-2.5">
      <p className="text-base leading-[19.36px] text-[#232323]">
        Venue Banners / Videos
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] min-h-[133px]">
        <div className="flex flex-wrap gap-2.5 min-h-[133px] overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`venueMedia-${index}`}
            >
              {previews[index]?.isUploading ? (
                // Show loading spinner when uploading
                <div className="flex items-center justify-center h-full w-[223px] bg-gray-100 rounded">
                  <Spinner className="w-8 h-8" />
                </div>
              ) : previews[index]?.type === "video" ? (
                // Render video if type is video
                <video
                  controls
                  src={previews[index]?.preview}
                  className="object-scale-down rounded h-full w-[223px]"
                />
              ) : (
                // Render image or placeholder
                <img
                  src={previews[index]?.preview || venueUploadImage}
                  alt={`Venue media ${index + 1}`}
                  className="object-scale-down rounded h-full w-[223px]"
                />
              )}

              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black cursor-pointer"
                  onClick={() => {
                    if (!isDisabled) {
                      handleRemoveImage(index);
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px] 1">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            {/* <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p> */}
            <p className="text-xs text-[#353535] mt-1">
              (Image size: 1200x600)
            </p>
            {!isDisabled && (
              <FieldArray name="bannerImages">
                {({ form, field, meta, push }) => (
                  <input
                    {...field}
                    id="bannerImages"
                    name="bannerImages"
                    onChange={(e) => handleFileUpload(e)}
                    value=""
                    type="file"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                    disabled={uploadingIndex !== -1} // Disable during upload
                  />
                )}
              </FieldArray>
            )}
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="bannerImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
const VenueLayoutImage = ({ dispatch, uploadData, isUploading, id }) => {
  const venueEditMode = useSelector((state) => state.Venue.venueEditMode);
  const isDisabled = id ? !venueEditMode : false;
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  useEffect(() => {
    const previewImages = values?.layoutImages?.length
      ? values.layoutImages.map((image) => ({
          preview: image.url,
          type: image.type,
        }))
      : [];
    setPreviews(previewImages);
  }, [values?.layoutImages]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemoveImage = (index) => {
    const newLayoutImages = values.layoutImages.filter((_, i) => i !== index);
    setFieldValue("layoutImages", newLayoutImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("layoutImages", "File should be a valid image type.");
      return;
    }

    if (values.layoutImages.length === 4) {
      dispatch(
        showError({
          message: "You can add up to 4 images only.",
          onClose: "hideError",
        })
      );
      return;
    }

    const maxSize = venueImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("layoutImages", "File should be less than 5 MB");
      return;
    }
    try {
      const uploadIndex = previews.length;
      setUploadingIndex(uploadIndex);
      setPreviews((prev) => [...prev, { preview: null, isUploading: true }]);

      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const { type, url } = result?.data;
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[uploadIndex] = { preview: url, type };
        return newPreviews;
      });
      setFieldValue("layoutImages", [...values.layoutImages, { url, type }]);
      setUploadingIndex(-1);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("layoutImages", err.data.message);
      0;

      setPreviews((prev) => prev.filter((_, i) => i !== uploadingIndex));
      setUploadingIndex(-1);
    }
  };
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className="text-base leading-[19.36px] text-[#232323]">Venue Layout</p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] h-[133px]">
        <div className="flex flex-wrap gap-2.5 h-[133px] overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`layoutImage-${index}`}
            >
              {previews[index]?.isUploading ? (
                // Show loading spinner when uploading
                <div className="flex items-center justify-center h-full w-[223px] bg-gray-100 rounded">
                  <Spinner className="w-8 h-8" />
                </div>
              ) : (
                <img
                  key={index}
                  src={previews[index]?.preview || venueUploadImage}
                  alt={`Venue upload ${index + 1}`}
                  className="object-scale-down rounded h-full w-[223px]"
                />
              )}

              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black cursor-pointer"
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px] 2">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <p className="text-xs text-[#353535] mt-1">(Image size: 800x400)</p>

            {!isDisabled && (
              <FieldArray name="layoutImages">
                {({ form, field, meta }) => (
                  <input
                    {...field}
                    id="layoutImages"
                    name="layoutImages"
                    onChange={(e) => {
                      // handleFileUpload(e);
                    }}
                    value=""
                    type="file"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                    disabled={uploadingIndex !== -1} // Disable during upload
                  />
                )}
              </FieldArray>
            )}
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="layoutImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
export default VenueInfo;
