import {
  Formik,
  ErrorMessage,
  Field,
  Form,
  FieldArray,
  useFormikContext,
} from "formik";

import TextError from "../Error/formError";
import { Amenities, Equipment } from "../../Constant/venue";
import { AiFillQuestionCircle } from "react-icons/ai";
import { uploadIcon, venueUploadImage } from "../../Assests";
import Button from "../Common/Button";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addVenue,
  getSingleVenue,
  updateVenue,
  getUniqueVenueTags,
} from "../../redux/Venue/venueActions";
import { ErrorModal } from "../Common/ErrorModal";
import { cleanUpError, showError } from "../../redux/Error/errorSlice";
import { SuccessModal } from "../Common/SuccessModal";
import { cleanUpSuccess, showSuccess } from "../../redux/Success/successSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Common/Spinner";
import LocationSearchInput from "../Common/LocationSearch";
import { uploadImage } from "../../redux/Upload/uploadActions";
import { resetVenueState } from "../../redux/Venue/addVenue";
import Combopopover from "../Common/Combobox";
import { venueImageSize } from "../../Constant/app";

const requiredVenueFields = (venue) => {
  const {
    name,
    location,
    handle,
    tags,
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
  } = venue;

  return {
    name,
    location,
    handle,
    tags,
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
  };
};

const hasSelectedDays = (days) => {
  return days.some((day) => !!day.day);
};

const validateTimes = (days) => {
  return days.every((day) => {
    if (day.day) {
      return !!day.openingTime && !!day.closingTime;
    }

    return true;
  });
};

const validateOpenAndCloseTime = (days) => {
  return days.every((day) => {
    if (day.day) {
      const openingTime = new Date(`1970-01-01T${day.openingTime}:00`);
      const closingTime = new Date(`1970-01-01T${day.closingTime}:00`);
      return openingTime < closingTime;
    }

    return true;
  });
};

const initialValues = {
  name: "",
  location: {
    type: "Point",
    coordinates: [],
  },
  handle: "",
  tags: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  },
  description: "",
  availableDays: [
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
    { day: "", openingTime: "", closingTime: "" },
  ],
  amenities: [],
  allDaysSelected: false,
  globalOpeningTime: "",
  globalClosingTime: "",
  equipments: [],
  bannerImages: [],
  layoutImages: [],
  rating: [],
  comments: [],
};

const VenueInfo = () => {
  const [allSelected, setAllSelected] = useState(false);
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required.")
      .min(3, "Name must be at least 3 characters long.")
      .max(50, "Name cannot exceed 50 characters."),
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
    address: yup.object().shape({
      line1: yup.string().notRequired(),
      line2: yup.string().notRequired(),
      city: yup.string().required("City is required."),
      state: yup.string().required("State is required."),
      postalCode: yup
        .string()
        .required("Postal Code is required.")
        .matches(/^\d{6}$/, "Postal Code must be 6 digits."),
    }),
    description: yup
      .string()
      .required("Description is required.")
      .max(500, "Description cannot exceed 500 characters."),

    availableDays:
      !allSelected &&
      yup
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
        ),
    allDaysSelected: yup.bool(),
    globalOpeningTime: allSelected
      ? yup.string().required("Opening time is required")
      : yup.string(),

    globalClosingTime: allSelected
      ? yup
          .string()
          .required("Closing time is required.")
          .test(
            "is-after-opening-time",
            "Closing time must be greater than opening time.",
            function (value) {
              const { globalOpeningTime } = this.parent;
              return globalOpeningTime < value;
            }
          )
      : yup.string(),

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.Venue);
  const { id } = useParams();
  const [initialState, setInitialState] = useState(initialValues);
  const { location } = useSelector((state) => state.Venue);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    try {
      !id
        ? await dispatch(addVenue(values)).unwrap()
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

      setAllSelected();

      setTimeout(() => {
        navigate("/venues");
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
      setInitialState({ ...initialState, ...values });
      setAllSelected(values.allDaysSelected);
      setSelectedTags(values.tags);
    }
  }, [venue, id]);

  useEffect(() => {
    const newState = { ...initialState };

    if (location.lat && location.lng) {
      newState.location = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
      setInitialState(newState);
    }

    if (location.city || location.state) {
      newState.address = {
        city: location.city,
        state: location.state,
        postalCode: location.pin_code,
        line1: location.address_line1,
        line2: location.address_line2,
      };
    }

    if (Object.keys(newState).length > 1) {
      setInitialState(newState);
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
      <Form>
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323] rounded-3xl py-[50px] px-[48px]">
          <ErrorModal />
          <SuccessModal />
          <VenueBasicInfo />
          <VenueAddress />
          <VenueMetaData
            isGettingTags={isGettingTags}
            uniqueTags={uniqueTags}
            selectedTags={selectedTags}
          />
          <VenueDescription />
          <VenueAvailableDays
            setAllSelected={setAllSelected}
            allSelected={allSelected}
          />
          <VenueAmenities />
          <VenueEquipments />
          <VenueBannerImage
            dispatch={dispatch}
            uploadData={uplodedData}
            isUploading={isUploading}
          />
          <VenueLayoutImage
            dispatch={dispatch}
            uploadData={uplodedData}
            isUploading={isUploading}
          />

          <Button
            className="w-[150px] h-[60px] bg-[#1570EF] ml-auto rounded-[8px] text-[#FFFFFF]"
            type="submit"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

const VenueBasicInfo = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] ">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="name"
        >
          Venue Name
        </label>
        <Field
          placeholder="Enter Venue Name"
          id="name"
          name="name"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="location"
        >
          Google Map
        </label>

        <LocationSearchInput id="location" name="location" />
        <ErrorMessage name="location.coordinates" component={TextError} />
      </div>
    </div>
  );
};

const VenueMetaData = ({ isGettingTags, uniqueTags, selectedTags }) => {
  const [venueHandle, setVenueHandle] = useState("");
  const { values, setFieldValue } = useFormikContext();

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
          placeholder="Enter Venue Handle"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={venueHandle}
        />
        <ErrorMessage name="handle" component={TextError} />
      </div>

      <Combopopover
        isGettingTags={isGettingTags}
        uniqueTags={uniqueTags}
        setFieldValue={setFieldValue}
        checkedTags={selectedTags}
      />

      <ErrorMessage name="tags" component={TextError} />
    </div>
  );
};

const VenueAddress = () => {
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

const VenueDescription = () => {
  return (
    <div className="grid grid-cols-1 gap-2 items-start">
      <p className=" text-[#232323] text-base leading-[19.36px] justify-self-start">
        Description
      </p>
      <Field
        id="description"
        name="description"
        placeholder="Enter Venue Description"
        className=" px-[19px] pt-[16px] h-[170px] border-[1px] border-[#DFEAF2] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        as="textarea"
      />
      <ErrorMessage
        name="description"
        component={TextError}
        className="items-center"
      />
    </div>
  );
};

const VenueAvailableDays = ({ setAllSelected, allSelected }) => {
  const { values, setFieldValue, errors } = useFormikContext();

  useEffect(() => {
    if (
      values.allDaysSelected &&
      (values.globalOpeningTime || values.globalClosingTime)
    ) {
      updateAllDays();
    }
  }, [
    values.allDaysSelected,
    values.globalOpeningTime,
    values.globalClosingTime,
  ]);
  const updateAllDays = () => {
    if (!values.allDaysSelected) return;

    const updatedDays = values.availableDays.map((day) => ({
      ...day,
      openingTime: values.globalOpeningTime,
      closingTime: values.globalClosingTime,
    }));

    setFieldValue("availableDays", updatedDays);
  };

  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-[#232323] text-base leading-[19.36px]">
        Available Days
      </p>

      <FieldArray name="availableDays">
        {({ form, remove, push }) => {
          return (
            <>
              <div className="grid grid-cols-2 w-full">
                <div className="flex gap-2.5 items-center">
                  <Field
                    type="checkbox"
                    checked={values.allDaysSelected}
                    id="allDaysSelected"
                    name="allDaysSelected"
                    className="w-4 h-4 outline-none"
                    onChange={(e) => {
                      setAllSelected(e.target.checked);
                      form.setFieldValue("allDaysSelected", e.target.checked);
                    }}
                  ></Field>
                  <label htmlFor="allDaysSelected">Select All days</label>
                </div>
                {form?.values?.allDaysSelected && (
                  <div className="grid grid-cols-2 w-full gap-2.5">
                    <label className="flex flex-col items-start gap-2.5">
                      Opening Time
                      <Field
                        type="time"
                        name="globalOpeningTime"
                        className="w-full px-3 py-2 border rounded"
                        onChange={(e) => {
                          form.setFieldValue(
                            "globalOpeningTime",
                            e.target.value
                          );
                        }}
                      />
                      <ErrorMessage
                        name="globalOpeningTime"
                        component={TextError}
                      />
                    </label>

                    <label className="flex flex-col items-start gap-2.5">
                      Closing Time
                      <Field
                        type="time"
                        name="globalClosingTime"
                        className="w-full px-3 py-2 border rounded"
                        onChange={(e) => {
                          form.setFieldValue(
                            "globalClosingTime",
                            e.target.value
                          );
                        }}
                      />
                      <ErrorMessage
                        name="globalClosingTime"
                        component={TextError}
                      />
                    </label>
                  </div>
                )}
              </div>

              {!form.values.allDaysSelected && (
                <div className="grid grid-cols-1 gap-2.5 w-full border rounded-[10px] border-[#DFEAF2] p-[20px] ">
                  {form?.values?.availableDays.map((dayObj, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-1 lg:grid-cols-3 gap-[10px] items-start "
                    >
                      <label className="flex flex-col items-start gap-2.5 justify-center">
                        Day
                        <Field
                          as="select"
                          name={`availableDays[${index}].day`}
                          className="w-full px-3 py-2 border rounded"
                        >
                          <option value="">Select Day</option>
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                          <option value="sunday">Sunday</option>
                        </Field>
                        <ErrorMessage
                          name={`availableDays[${index}].day`}
                          component={TextError}
                        />
                      </label>

                      <label className="flex flex-col items-start gap-2.5 justify-center">
                        Opening Time
                        <Field
                          type="time"
                          name={`availableDays[${index}].openingTime`}
                          className="w-full px-3 py-2 border rounded"
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
                        />
                        <ErrorMessage
                          name={`availableDays[${index}].closingTime`}
                          component={TextError}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        }}
      </FieldArray>
      <ErrorMessage name="availableDays" component={TextError} />
    </div>
  );
};

const VenueAmenities = () => {
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

const VenueEquipments = () => {
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

const VenueBannerImage = ({ dispatch, uploadData, isUploading }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const previewImages = values?.bannerImages?.length
      ? values.bannerImages.map((image) => ({
          preview: image.url,
        }))
      : [];
    setPreviews(previewImages);
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
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("bannerImages", "File should be a valid image type.");
      dispatch(
        showError({
          message: "File should be a valid image type.",
          onClose: "hideError",
        })
      );
      return;
    }

    if (values.bannerImages.length === 4) {
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
      setFieldError("bannerImages", "File should be less than 1 MB");
      dispatch(
        showError({
          message: "File should be less than 1 MB.",
          onClose: "hideError",
        })
      );
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();

      setPreviews((prev) => [
        ...prev,
        { preview: result.data.uploadedFileUrl },
      ]);
      const url = result.data.uploadedFileUrl;
      setFieldValue("bannerImages", [...values.bannerImages, { url }]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("bannerImages", err.data.message);
    }
  };
  return (
    <div className=" flex flex-col items-start gap-2.5">
      <p className="text-base leading-[19.36px] text-[#232323]">Upload Image</p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] h-[133px]">
        <div className="flex flex-wrap gap-2.5 h-[133px] overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`venueImage-${index}`}
            >
              <img
                key={index}
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded h-full w-[223px]"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px]">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 1MB)</p>
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
                />
              )}
            </FieldArray>
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="bannerImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
const VenueLayoutImage = ({ dispatch, uploadData, isUploading }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const previewImages = values?.layoutImages?.length
      ? values.layoutImages.map((image) => ({
          preview: image.url,
        }))
      : [];
    setPreviews(previewImages);
  }, [values?.layoutImages]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemoveImage = (index) => {
    const newBannerImages = values.layoutImages.filter((_, i) => i !== index);
    setFieldValue("layoutImages", newBannerImages);
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
      setFieldError("layoutImages", "File should be less than 1 MB");
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      setPreviews((prev) => [
        ...prev,
        { preview: result.data.uploadedFileUrl },
      ]);
      const url = result.data.uploadedFileUrl;
      setFieldValue("layoutImages", [...values.layoutImages, { url }]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("layoutImages", err.data.message);
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
              <img
                key={index}
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded h-full w-[223px]"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px]">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 1MB)</p>
            <FieldArray name="layoutImages">
              {({ form, field, meta }) => (
                <input
                  {...field}
                  id="layoutImages"
                  name="layoutImages"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                />
              )}
            </FieldArray>
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="layoutImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
export default VenueInfo;
