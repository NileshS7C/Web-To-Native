import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import * as yup from "yup";

import useDebounce from "../../../Hooks/useDebounce";

import { toggleModal } from "../../../redux/tournament/eventSlice";
import { getAllVenues } from "../../../redux/Venue/venueActions";
import { resetGlobalLocation } from "../../../redux/Location/locationSlice";

import {
  addEventCategory,
  getAllCategories,
  getSingleCategory,
  updateEventCategory,
} from "../../../redux/tournament/tournamentActions";

import { crossIcon, calenderIcon } from "../../../Assests";
import Button from "../../Common/Button";

import {
  roundRobbinModeOptions,
  tournamentEvent,
} from "../../../Constant/tournament";
import TextError from "../../Error/formError";

import { formattedDate, parseDate } from "../../../utils/dateUtils";
import { ImSpinner8 } from "react-icons/im";
import LocationSearchInput from "../../Common/LocationSearch";
import ErrorBanner from "../../Common/ErrorBanner";

import { RxCrossCircled } from "react-icons/rx";
import {
  ComboboxOptions,
  ComboboxOption,
  Combobox,
  Label,
  ComboboxInput,
  ComboboxButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const requiredCategoryFields = (category) => {
  const {
    categoryName,
    format,
    type,
    roundRobinMode,
    registrationFee,
    maxPlayers,
    minPlayers,
    skillLevel,
    categoryLocation,
    categoryStartDate,
  } = category;

  return {
    categoryName,
    format,
    type,
    roundRobinMode,
    registrationFee,
    maxPlayers,
    minPlayers,
    skillLevel,
    categoryLocation,
    categoryStartDate,
  };
};

const initialValues = {
  categoryName: "",
  format: "",
  type: "",
  roundRobinMode: "simple",
  registrationFee: 1,
  maxPlayers: 0,
  minPlayers: 1,
  skillLevel: "",
  categoryLocation: {
    handle: "",
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
  },
  categoryStartDate: "",
};

export const EventCreationModal = () => {
  const [isVenueFinal, setIsVenueFinal] = useState(false);
  const [venueNotListed, setVenueNotListed] = useState(false);
  const validationSchema = yup.object().shape({
    categoryName: yup
      .string()
      .required("Category name is required")
      .min(3, "Category name should be minimum 3 characters")
      .max(50, "Category name cannot exceed more than 50 characters."),
    format: yup.string().required("Event format is required."),
    type: yup.string().required("Event category is required."),
    roundRobinMode: yup.string().optional(),
    registrationFee: yup
      .number()
      .required("Registration fee is required.")
      .min(1, "Registration fee should be greater than 0"),
    maxPlayers: yup.number().optional(),
    minPlayers: yup.number().required("Minimum players is required."),
    skillLevel: yup.string().optional(),
    categoryLocation:
      venueNotListed &&
      yup.object().shape({
        address: yup.object().shape({
          line1: yup.string().required("Line 1 is required."),
          line2: yup.string().notRequired(),
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
              .length(2, "Coordinates must contain exactly two numbers.")
              .required("Location is required."),
          }),
        }),
      }),
    categoryStartDate: yup.date().optional(),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showModal } = useSelector((state) => state.event);
  const { venues, totalVenues } = useSelector((state) => state.getVenues);
  const browserLocation = useLocation();
  const searchParams = new URLSearchParams(browserLocation.search);
  const categoryId = searchParams.get("category");
  const { location } = useSelector((state) => state.location);
  const [initialState, setInitialState] = useState(initialValues);
  const [isVenueDecided, setIsVenueDecided] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVenueData, setSelectedVenueData] = useState(null);

  const { tournamentId } = useParams();
  const { category, loadingSingleCategory, singleCategorySuccess } =
    useSelector((state) => state.event);

  const checkVenueOption = (state) => {
    state === "not_decided" ? setIsVenueFinal(false) : setIsVenueFinal(true);
  };

  const getLocation = (data) => {
    setSelectedVenueData(data);
  };

  const isVenueNotListed = (value) => {
    setVenueNotListed(value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setHasError(false);
      let updatedLocation;

      if (selectedVenueData?.address) {
        const {
          location: { is_location_exact, ...locationWithOutExact },
          ...restOfAddress
        } = selectedVenueData.address;
        const updatedAddress = {
          ...restOfAddress,
          location: locationWithOutExact,
        };

        updatedLocation = {
          address: updatedAddress,
          venueImage: selectedVenueData.image,
          handle: selectedVenueData.name,
        };
      }

      const updatedValues = {
        ...values,
        categoryLocation: venueNotListed
          ? values?.categoryLocation
          : updatedLocation,
        categoryStartDate:
          values?.categoryStartDate && formattedDate(values?.categoryStartDate),
      };

      !isVenueFinal && delete values["categoryLocation"];

      setSubmitting(true);
      const result = !categoryId
        ? await dispatch(
            addEventCategory({
              formData: updatedValues,
              id: tournamentId,
            })
          ).unwrap()
        : await dispatch(
            updateEventCategory({
              formData: updatedValues,
              id: tournamentId,
            })
          ).unwrap();

      if (!result.responseCode) {
        dispatch(toggleModal());
        dispatch(
          getAllCategories({
            currentPage: 1,
            limit: 10,
            id: tournamentId,
          })
        );
      }

      resetForm();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(" err occured in saving the form", error);
      }
      setHasError(true);
      setErrorMessage(error?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      dispatch(resetGlobalLocation());
      setHasError(false);
    }
    if (categoryId && !showModal) {
      searchParams.delete("category");
      navigate(`${browserLocation?.pathname}?${searchParams?.toString()}`, {
        replace: true,
      });
    }
  }, [showModal, categoryId]);

  useEffect(() => {
    if (categoryId && tournamentId) {
      dispatch(
        getSingleCategory({ tour_Id: tournamentId, eventId: categoryId })
      );
    }
  }, [categoryId, tournamentId]);

  let updatedCategory;

  useEffect(() => {
    if (categoryId && tournamentId && singleCategorySuccess) {
      updatedCategory = requiredCategoryFields(category);
      setInitialState((prevState) => ({
        ...prevState,
        ...updatedCategory,
        categoryStartDate: parseDate(updatedCategory?.categoryStartDate),
      }));

      updatedCategory?.categoryLocation
        ? setIsVenueDecided(true)
        : setIsVenueDecided(false);
    } else {
      setInitialState({});
    }
  }, [categoryId, tournamentId, singleCategorySuccess]);

  return (
    <Dialog
      open={showModal}
      onClose={() => {
        setInitialState({});
        dispatch(toggleModal());
      }}
      className="relative z-10 "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed  inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[70%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="w-full bg-[#FFFFFF] px-[20px] h-full overflow-y-hidden">
                <AddEventTitle />
                {loadingSingleCategory && (
                  <ImSpinner8 className="w-[40px] h-[40px] m-auto animate-spin" />
                )}

                {hasError && <ErrorBanner message={errorMessage} />}
                {!loadingSingleCategory && (
                  <Formik
                    enableReinitialize
                    initialValues={initialState}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="grid grid-col-1 gap-[20px]">
                          <EventName />
                          <EventFormat />
                          <RegistrationFee />
                          <SelectPlayers />
                          <SelectSkillLevel />
                          <VenueSelection
                            venues={venues}
                            total={totalVenues}
                            location={location}
                            checkVenueOption={checkVenueOption}
                            isVenueDecided={isVenueDecided}
                            getLocation={getLocation}
                            isVenueNotListed={isVenueNotListed}
                            updatedCategory={updatedCategory}
                          />
                          <EventTimings />
                          <div className="grid justify-self-end gap-[10px]">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-white text-[14px] leading-[17px] text-[#232323] ml-auto"
                                onClick={() => dispatch(toggleModal())}
                              >
                                Close
                              </Button>
                              <Button
                                className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                                type="submit"
                                loading={isSubmitting}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
const AddEventTitle = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between mb-[30px] mx-[20px]">
      <p className="text-[18px] leading-[21.7px] font-[600] text-[#343C6A]">
        Add New Event
      </p>
      <button onClick={() => dispatch(toggleModal())} className="shadow-sm ">
        <img src={crossIcon} alt="close" className="w-5 h-5" />
      </button>
    </div>
  );
};

const EventName = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label className="text-base leading-[19.36px]" htmlFor="categoryName">
        Event Name
      </label>
      <Field
        placeholder="Enter Event Name"
        id="categoryName"
        name="categoryName"
        className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
      />

      <ErrorMessage name="categoryName" component={TextError} />
    </div>
  );
};

const EventFormat = () => {
  const { values } = useFormikContext();
  const [isRoundRobinSelected, setIsRoundRobinSelected] = useState(false);

  useEffect(() => {
    if (values?.format) {
      setIsRoundRobinSelected(() => {
        return values?.format === "RR";
      });
    }
  }, [values]);

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323] "
          htmlFor="format"
        >
          Event Format
        </label>

        <Field
          name="format"
          id="format"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          as="select"
        >
          {tournamentEvent.format.map((format, index) => (
            <option
              key={`${format.name}`}
              value={index === 0 ? "" : format.shortName}
              className={index !== 0 ? "text-[#232323]" : ""}
            >
              {format.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="format" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323]"
          htmlFor="type"
        >
          Event Category
        </label>
        <Field
          className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          as="select"
          name="type"
          id="type"
        >
          {tournamentEvent.category.map((format, index) => (
            <option
              key={`${format.name}`}
              value={index === 0 ? "" : format.shortName}
              className={index !== 0 ? "text-[#232323]" : ""}
            >
              {format.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="type" component={TextError} />
      </div>

      {isRoundRobinSelected && (
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-base leading-[19.36px] text-[#232323]"
            htmlFor="roundRobinMode"
          >
            Round Robin Type
          </label>
          <Field
            className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            as="select"
            name="roundRobinMode"
            id="roundRobinMode"
          >
            {roundRobbinModeOptions.map((mode) => {
              return (
                <option value={mode?.id} key={mode?.id}>
                  {mode?.name}
                </option>
              );
            })}
          </Field>
          <ErrorMessage name="roundRobinMode" component={TextError} />
        </div>
      )}
    </div>
  );
};

const RegistrationFee = () => {
  return (
    <div className="grid grid-cols-1 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323] "
          htmlFor="registrationFee"
        >
          Registration Fees
        </label>
        <Field
          placeholder="Enter Registration Fees"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="registrationFee"
          name="registrationFee"
          type="number"
          onWheel={(e) => e.target.blur()}
        />
      </div>
      <ErrorMessage name="registrationFee" component={TextError} />
    </div>
  );
};

const SelectPlayers = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323] "
          htmlFor="minPlayers"
        >
          Min Players
        </label>
        <Field
          placeholder="Enter Registration Fees"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="minPlayers"
          name="minPlayers"
          type="number"
        />
        <ErrorMessage name="minPlayers" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323] "
          htmlFor="maxPlayers"
        >
          Max Players
        </label>
        <Field
          placeholder="Max Players Count"
          className="w-full text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="maxPlayers"
          id="maxPlayers"
          type="number"
        />
        <ErrorMessage name="maxPlayers" component={TextError} />
      </div>
    </div>
  );
};

const SelectSkillLevel = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label
        className="text-base leading-[19.36px] text-[#232323] "
        htmlFor="skillLevel"
      >
        Skill level
      </label>

      <Field
        name="skillLevel"
        id="skillLevel"
        className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        as="select"
      >
        {tournamentEvent.skillLevels.map((format, index) => (
          <option
            key={`${format}`}
            value={index === 0 ? "" : format?.toLowerCase()}
            className={index !== 0 ? "text-[#232323]" : ""}
          >
            {format}
          </option>
        ))}
      </Field>
      <ErrorMessage name="skillLevel" component={TextError} />
    </div>
  );
};

const VenueSelection = ({
  venues,
  total,
  location,
  checkVenueOption,
  isVenueDecided,
  getLocation,
  isVenueNotListed,
  updatedCategory,
}) => {
  const dispatch = useDispatch();
  const [isVenueNotAvailable, setIsVenueNotAvailable] = useState(false);
  const [currentCheckBox, setCurrentCheckBox] = useState("");
  const [venueNotListed, setVenueNotListed] = useState(false);

  const handleCheckBox = (e) => {
    setIsVenueNotAvailable(e.target.checked);
    setVenueNotListed(e.target.checked);
    isVenueNotListed(e.target.checked);
  };

  useEffect(() => {
    if (venueNotListed) {
      dispatch(resetGlobalLocation());
    }
  }, [venueNotListed]);

  useEffect(() => {
    if (isVenueDecided) {
      setCurrentCheckBox("decided");
    } else {
      setCurrentCheckBox("not_decided");
    }
  }, [isVenueDecided]);

  return (
    <div className="grid grid-cols-1 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <p className="text-base leading-[19.36px] text-[#232323] ">
          Venue Selection
        </p>
        <div className="flex gap-[50px] w-full">
          <div className="flex gap-[10px] items-center">
            <input
              type="checkbox"
              id="venue_final"
              name="venue"
              className="w-4 h-4  border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
              checked={currentCheckBox === "decided"}
              onChange={(e) => {
                if (e.target.checked) {
                  setCurrentCheckBox("decided");
                  checkVenueOption("decided");
                  setIsVenueNotAvailable(false);
                }
              }}
            />
            <label
              htmlFor="venue"
              className="text-[15px] text-[#718EBF] leading-[18px]"
            >
              Venue is Finalized
            </label>
          </div>
          <div className="flex gap-[10px] items-center">
            <input
              type="checkbox"
              id="venue_NFinal"
              name="venue"
              className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
              checked={currentCheckBox === "not_decided"}
              onChange={(e) => {
                if (e.target.checked) {
                  setCurrentCheckBox("not_decided");
                  checkVenueOption("not_decided");
                }
              }}
            />
            <label
              htmlFor="venue"
              className="text-[15px] text-[#718EBF] leading-[18px]"
            >
              To be Decided
            </label>
          </div>
        </div>
      </div>

      {currentCheckBox === "decided" && (
        <div className="flex flex-col gap-2 w-full">
          {/* <VenueSearch
            isVenueNotAvailable={isVenueNotAvailable}
            venues={venues}
            total={total}
          /> */}

          <ComboboxForVenuesList
            isVenueNotAvailable={isVenueNotAvailable}
            venueNotListed={venueNotListed}
            getLocation={getLocation}
            updatedCategory={updatedCategory}
          />

          <div className="flex gap-[10px] items-center">
            <input
              type="checkbox"
              id="Venue_NF"
              name="venue_NF"
              className=" w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
              onChange={(e) => {
                handleCheckBox(e);
              }}
              checked={isVenueNotAvailable}
            />
            <label
              htmlFor="Venue_NF"
              className="text-[15px] text-[#718EBF] leading-[18px]"
            >
              Venue is not listed?{" "}
            </label>
          </div>

          {isVenueNotAvailable && (
            <div className="flex flex-col gap-2.5 w-full">
              <div className="grid grid-cols-2 gap-[30px] items-center w-full">
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <label
                    className=" text-[#232323] text-base leading-[19.36px]"
                    htmlFor="categoryLocation.handle"
                  >
                    Venue Name
                  </label>
                  <Field
                    placeholder="Enter Venue Name"
                    id="categoryLocation.handle"
                    name="categoryLocation.handle"
                    className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="categoryLocation.handle"
                    component={TextError}
                  />
                </div>
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <label
                    className=" text-[#232323] text-base leading-[19.36px]"
                    htmlFor="location"
                  >
                    Google Map
                  </label>

                  <LocationSearchInput
                    id="categoryLocation.location"
                    name="categoryLocation.location"
                  />
                  <ErrorMessage
                    name="categoryLocation.coordinates"
                    component={TextError}
                  />
                </div>
              </div>

              <AddVenueAddress
                location={location}
                venueNotListed={isVenueNotAvailable}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EventTimings = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-[16px] leading-[19.3px] text-[#232323]"
          htmlFor="categoryStartDate"
        >
          Approximate Date
        </label>
        <div className="relative">
          <Field name="categoryStartDate">
            {({ field, form }) => (
              <>
                <DatePicker
                  id="categoryStartDate"
                  name="categoryStartDate"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  selected={field.value ? new Date(field.value) : null}
                  className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("categoryStartDate", date);
                    }
                  }}
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>

        <ErrorMessage name="categoryStartDate" component={TextError} />
      </div>
      {/* <div className="flex flex-col items-start gap-2.5">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-[16px] leading-[19.3px] text-[#232323]">
            Select Time
          </label>
          <input
            placeholder="Select Date"
            type="time"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> */}
    </div>
  );
};

const AddVenueAddress = ({ location }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (location.city || location.state) {
      setFieldValue("categoryLocation.address.line1", location?.address_line1);
      setFieldValue(
        "categoryLocation.address.location.coordinates[0]",
        location?.lng
      );
      setFieldValue(
        "categoryLocation.address.location.coordinates[1]",
        location?.lat
      );
      setFieldValue("categoryLocation.address.location.type", "Point");
      setFieldValue("categoryLocation.address.line2", location.address_line2);
      setFieldValue("categoryLocation.address.city", location.city);
      setFieldValue("categoryLocation.address.state", location.state);
      setFieldValue("categoryLocation.address.postalCode", location.pin_code);
    }
  }, [
    location?.lat,
    location?.lng,
    location?.city,
    location?.state,
    location?.pin_code,
    location?.address_line1,
    location?.address_line2,
  ]);

  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-base leading-[19.36px] text-[#232323]">
        Venue Address
      </p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.address.line1"
          >
            Line 1
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="categoryLocation.address.line1"
            name="categoryLocation.address.line1"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="categoryLocation.address.line1"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.address.line2"
          >
            Line 2
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="categoryLocation.address.line2"
            name="categoryLocation.address.line2"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="categoryLocation.address.line2"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.address.city"
          >
            City
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="categoryLocation.address.city"
            name="categoryLocation.address.city"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="categoryLocation.address.city"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.address.state"
          >
            State
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="categoryLocation.address.state"
            name="categoryLocation.address.state"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="categoryLocation.address.state"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.address.postalCode"
          >
            Pincode
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="categoryLocation.address.postalCode"
            name="categoryLocation.address.postalCode"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="categoryLocation.address.postalCode"
            component={TextError}
          />
        </div>
        {/* <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="categoryLocation.venueImage"
          >
            Upload Venue Image
          </label>
          <div className=" flex relative ">
            <img
              src={values.categoryLocation?.venueImage || imageUpload}
              alt="sponsor logo"
              className="min-w-full h-[40px] cursor-pointer"
            />
            <Field name="categoryLocation.venueImage">
              {({ form, field }) => (
                <input
                  {...field}
                  id="categoryLocation.venueImage"
                  name="categoryLocation.venueImage"
                  onChange={(e) => {
                    const files = e.target.files[0];
                    const url = window.URL.createObjectURL(files);
                    form.setFieldValue("categoryLocation.venueImage", url);
                  }}
                  value=""
                  type="file"
                  className="absolute  w-8 h-8  inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                  multiple={false}
                />
              )}
            </Field>
          </div>
        </div> */}
      </div>
    </div>
  );
};

function isReachedBottom(element) {
  return (
    Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <=
    1
  );
}

function ComboboxForVenuesList({
  isVenueNotAvailable,
  venueNotListed,
  getLocation,
  updatedCategory,
}) {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const browserLocation = useLocation();
  const { venues, totalVenues } = useSelector((state) => state.getVenues);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [updatedVenues, setUpdatedVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const selectedFilter = "PUBLISHED";
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const debounceCalls = useDebounce(query, 300);
  const searchParams = new URLSearchParams(browserLocation.search);
  const categoryId = searchParams.get("category");
  const handleRemoveVenue = () => {
    setSelectedPerson(null);
  };

  useEffect(() => {
    if (selectedPerson) {
      const { address } = selectedPerson;
      getLocation({
        address,
        name: selectedPerson?.name,
        image: selectedPerson?.bannerImages?.[0].url,
      });
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (venueNotListed) {
      setSelectedPerson(null);
    }
  }, [venueNotListed]);

  useEffect(() => {
    const getVenueByName = async () => {
      try {
        setCurrentPage(1);
        setIsLoading(true);
        setHasError(false);

        if (scrollContainerRef.current) {
          scrollPositionRef.current = scrollContainerRef.current.scrollTop;
        }
        const result = await dispatch(
          getAllVenues({ currentPage, selectedFilter, limit: 10, name: query })
        ).unwrap();

        if (!result.responseCode) {
          setUpdatedVenues(result.data.venues);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length > 3 && debounceCalls) {
      getVenueByName();
    }
  }, [debounceCalls]);

  useEffect(() => {
    const getInitialVenues = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const result = await dispatch(
          getAllVenues({ currentPage, selectedFilter, limit: 10 })
        ).unwrap();

        if (!result.responseCode) {
          setUpdatedVenues(result.data.venues);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!query.length) {
      getInitialVenues();
    }
  }, [query]);

  useEffect(() => {
    const getMoreVenues = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        if (scrollContainerRef.current) {
          scrollPositionRef.current = scrollContainerRef.current.scrollTop;
        }
        const nextPage = currentPage + 1;
        const result = await dispatch(
          getAllVenues({ currentPage: nextPage, selectedFilter, limit: 10 })
        ).unwrap();

        if (!result.responseCode) {
          setUpdatedVenues((prev) => [...prev, ...result.data.venues]);
        }
        setCurrentPage(nextPage);

        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollPositionRef.current;
          }
        });
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
        setReachedBottom(false);
      }
    };

    if (reachedBottom && totalVenues > updatedVenues.length) {
      getMoreVenues();
    }
  }, [reachedBottom, currentPage, totalVenues]);

  const handleScroll = (e) => {
    const checkBottom = isReachedBottom(e.target);
    setReachedBottom(checkBottom);
  };

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(person) => {
        setQuery("");
        setSelectedPerson(person);
      }}
    >
      <Label className="block text-sm/6 font-medium text-gray-900">Venue</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full px-[30px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search venue"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onBlur={() => setQuery("")}
          displayValue={selectedPerson?.name ?? ""}
          disabled={isVenueNotAvailable}
        />

        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          {!isVenueNotAvailable && (
            <ChevronUpDownIcon
              className="size-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </ComboboxButton>

        <ComboboxOptions
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
          onScroll={handleScroll}
          ref={scrollContainerRef}
        >
          {!isLoading && !hasError ? (
            updatedVenues.length > 0 &&
            updatedVenues.map((venue) => (
              <ComboboxOption
                key={venue._id}
                value={venue}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                onChange={() => {
                  setSelectedPerson(venue);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={venue?.bannerImages[0]?.url ?? ""}
                      alt={`${venue.name}_image`}
                      width="50px"
                      height="50px"
                    />
                    <span className="block truncate group-data-selected:font-semibold text-lg text-[#718EBF]">
                      {venue.name}
                    </span>
                  </div>

                  <p className="flex justify-between text-lg text-[#718EBF]">
                    <span>{venue.address.line1 || venue.address.line2}</span>
                    {","}
                    <span>{venue.address.city}</span>
                    {","}
                    <span>{venue.address.state}</span>
                    {","}
                    <span>{venue.address.postalCode}</span>
                  </p>

                  <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </ComboboxOption>
            ))
          ) : (
            <ImSpinner8 className="flex m-auto min-h-full animate-spin w-[50px] h-[50px]" />
          )}

          {hasError && (
            <div className="flex justify-center">
              <p className="text-lg text-red-700">
                Some error has occured while getting the venues. Please try
                again.
              </p>
            </div>
          )}
          {!venues?.length && (
            <div className="flex justify-center">
              <p className="text-lg text-black-800">No venues found.</p>
            </div>
          )}
        </ComboboxOptions>
      </div>

      {selectedPerson && !categoryId && (
        <div className="flex items-center justify-between bg-gray-200 mt-3 w-auto max-w-fit rounded-lg p-2">
          <img
            src={selectedPerson?.bannerImages[0]?.url}
            alt="Selected Venue logo"
            className="w-[40px] h-[40px]"
          />
          <div className="flex flex-col items-center justify-between gap-2  text-xs">
            <p>{selectedPerson?.name}</p>
            <div className="flex  items-center divide-x divide-black">
              <span className="pl-1 pr-1">
                {selectedPerson?.address?.line1}
              </span>
              <span className="pl-1 pr-1">{selectedPerson?.address?.city}</span>
              <span className="pl-1 pr-1">
                {selectedPerson?.address?.state}
              </span>
              <span className="pl-1 pr-1">
                {selectedPerson?.address?.postalCode}
              </span>
            </div>
          </div>
          <RxCrossCircled
            className="cursor-pointer"
            onClick={handleRemoveVenue}
          />
        </div>
      )}
    </Combobox>
  );
}

VenueSelection.propTypes = {
  venues: PropTypes.array,
  total: PropTypes.number,
  location: PropTypes.object,
  checkVenueOption: PropTypes.bool,
  isVenueDecided: PropTypes.bool,
  getLocation: PropTypes.func,
  isVenueNotListed: PropTypes.bool,
  updatedCategory: PropTypes.object,
};

ComboboxForVenuesList.propTypes = {
  isVenueNotAvailable: PropTypes.bool,
};

AddVenueAddress.propTypes = {
  location: PropTypes.object,
};
