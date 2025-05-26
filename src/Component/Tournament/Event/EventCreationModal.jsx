import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleVenue } from "../../../redux/Venue/venueActions";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import useDebounce from "../../../Hooks/useDebounce";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
import { toggleModal } from "../../../redux/tournament/eventSlice";
import {
  getAllVenues,
  getSearchVenues,
} from "../../../redux/Venue/venueActions";
import { resetGlobalLocation } from "../../../redux/Location/locationSlice";

import {
  addEventCategory,
  getAllCategories,
  getSingleCategory,
  updateEventCategory,
} from "../../../redux/tournament/tournamentActions";

import { crossIcon, calenderIcon } from "../../../Assests";
import Button from "../../Common/Button";

import { tournamentEvent } from "../../../Constant/tournament";

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
import { nanoid } from "nanoid";
import { useOwnerDetailsContext } from "../../../Providers/onwerDetailProvider";

const requiredCategoryFields = (category) => {
  const {
    categoryName,
    format,
    type,
    registrationFee,
    maxPlayers,
    minPlayers,
    skillLevel,
    categoryLocation,
    categoryStartDate,
    totalSets,
  } = category;

  return {
    categoryName,
    format,
    type,
    registrationFee,
    maxPlayers,
    minPlayers,
    skillLevel,
    categoryLocation,
    categoryStartDate,
    totalSets,
  };
};

const initialValues = {
  categoryName: "",
  format: "",
  type: "",
  roundRobinMode: "",
  registrationFee: 1,
  maxPlayers: 0,
  minPlayers: 1,
  skillLevel: "",
  consolationFinal: false,
  numberOfGroups: "1",
  totalSets: "",
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
  const modalContentRef = useRef(null);
  const validationSchema = yup.object().shape({
    categoryName: yup
      .string()
      .required("Category name is required")
      .min(3, "Category name should be minimum 3 characters")
      .max(50, "Category name cannot exceed more than 50 characters."),
    format: yup.string().required("Event format is required."),
    type: yup.string().required("Event category is required."),
    roundRobinMode: yup.string().optional(),
    consolationFinal: yup.boolean().optional(),
    numberOfGroups: yup
      .string()
      .default("1")
      .when("format", {
        is: "RR",
        then: (schema) =>
          schema.required("Number of groups is required in Round Robin format"),
        otherwise: (schema) => schema.optional(),
      }),
    totalSets: yup.string().optional(),
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
  const {rolesAccess}=useOwnerDetailsContext()
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
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
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
          handle: selectedVenueData?.handle,
          name: selectedVenueData?.name,
        };
      }
      let location = {};
      if (venueNotListed && isVenueFinal) {
        const handle = values?.categoryLocation.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        location = { ...values.categoryLocation, handle: handle };
      }
      const updatedValues = {
        ...values,
        categoryLocation: !isVenueFinal
          ? {}
          : venueNotListed
          ? location || {}
          : updatedLocation || {},
        categoryStartDate:
          values?.categoryStartDate && formattedDate(values?.categoryStartDate),
      };
      // Check if values are falsy and remove them from updatedValues
      switch (updatedValues?.format) {
        case "SE":
        case "HYBRID":
          delete updatedValues.numberOfGroups;
          delete updatedValues.grandFinalsDE;
          delete updatedValues.roundRobinMode;
          break;
        case "DE":
          delete updatedValues.numberOfGroups;
          delete updatedValues.roundRobinMode;
          break;
        case "RR":
          delete updatedValues.grandFinalsDE;
          break;
      }

      // Delete falsy values
      [
        "numberOfGroups",
        "grandFinalsDE",
        "roundRobinMode",
        "totalSets",
      ].forEach((key) => {
        if (!updatedValues?.[key]) {
          delete updatedValues[key];
        }
      });

      !isVenueFinal && delete values["categoryLocation"];

      setSubmitting(true);
      const result = !categoryId
        ? await dispatch(
            addEventCategory({
              formData: updatedValues,
              id: tournamentId,
              type: rolesAccess?.tournament,
            })
          ).unwrap()
        : await dispatch(
            updateEventCategory({
              formData: updatedValues,
              id: tournamentId,
              categoryId: categoryId,
              type: rolesAccess?.tournament,
            })
          ).unwrap();

      if (!result.responseCode) {
        dispatch(toggleModal());
        dispatch(
          getAllCategories({
            currentPage: 1,
            limit: 10,
            id: tournamentId,
            type:rolesAccess?.tournament
          })
        );
      }

      resetForm();
    } catch (error) {
      setHasError(true);
      setErrorMessage(error?.data?.message || "Something went wrong.");
      scrollToTop();
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
        getSingleCategory({ tour_Id: tournamentId, eventId: categoryId ,type:rolesAccess?.tournament})
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
        numberOfGroups: category?.numberOfGroups.toString() || "",
        grandFinalsDE: category?.grandFinalsDE || "",
        roundRobinMode: category?.roundRobinMode || "",
        totalSets: category?.totalSets.toString() || "",
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
        <div className="flex min-h-full items-center justify-center px-4 py-2 text-center sm:items-center sm:p-0">
          <DialogPanel
            ref={modalContentRef}
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-[95%] sm:max-w-[85%] max-h-[90vh]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto"
          >
            <div>
              <div
                className="w-full bg-[#FFFFFF] px-[20px] h-full "
                ref={modalContentRef}
              >
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
                        <div className="flex flex-col md:grid grid-col-1 gap-[20px]">
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
                            categoryLocation={
                              initialState?.categoryLocation || null
                            }
                          />
                          <EventTimings />
                          <div className="">
                            <div className="flex gap-2 justify-end mb-4">
                              <Button
                                type="button"
                                className="py-2 px-5 rounded-[10px] shadow-md bg-white text-[14px] leading-[17px] text-[#232323]"
                                onClick={() => dispatch(toggleModal())}
                              >
                                Close
                              </Button>
                              <Button
                                className="py-2 px-5 rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF]"
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
  const { values, setFieldValue } = useFormikContext();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px]">
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
      {values?.format === "RR" && (
        <>
          <div className="flex flex-col items-start gap-2">
            <label
              className="text-base leading-[19.36px] text-black  font-medium"
              htmlFor="roundRobinMode"
            >
              Participant Play Count
            </label>
            <Field
              className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              as="select"
              name="roundRobinMode"
              id="roundRobinMode"
            >
              {tournamentEvent.roundRobinMode.map((mode) => (
                <option value={mode?.shortName} key={mode?.id}>
                  {mode?.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="roundRobinMode" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label
              className="text-base leading-[19.36px] text-black  font-medium"
              htmlFor="numberOfGroups"
            >
              Number of group
            </label>
            <Field
              placeholder="Enter Number Of Groups in Round Robin"
              id="numberOfGroups"
              name="numberOfGroups"
              className="text-[#718EBF] w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              min={1}
              max={1}
            />

            <ErrorMessage name="numberOfGroups" component={TextError} />
          </div>
        </>
      )}

      {values?.format === "DE" && (
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-base leading-[19.36px] text-[#232323]  font-medium"
            htmlFor="grandFinalsDE"
          >
            Grand Finals
          </label>
          <Field
            className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            as="select"
            name="grandFinalsDE"
            id="grandFinalsDE"
          >
            {tournamentEvent.grandFinalsDE.map((mode) => (
              <option value={mode?.shortName} key={mode?.id}>
                {mode?.name}
              </option>
            ))}
          </Field>
          <ErrorMessage name="grandFinalsDE" component={TextError} />
        </div>
      )}
      <div className="flex flex-col items-start gap-2">
        <label
          className="text-base leading-[19.36px] text-black  font-medium"
          htmlFor="totalSets"
        >
          Number of Sets
        </label>
        <Field
          className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          as="select"
          name="totalSets"
          id="totalSets"
        >
          {tournamentEvent.numberOfSets.map((set) => (
            <option value={set?.shortName} key={nanoid()}>
              {set?.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="totalSets" />
      </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-base leading-[19.36px] text-[#232323] "
          htmlFor="minPlayers"
        >
          Min Players
        </label>
        <Field
          placeholder="Min Player Count"
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
  categoryLocation,
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
          <ComboboxForVenuesList
            isVenueNotAvailable={isVenueNotAvailable}
            venueNotListed={venueNotListed}
            getLocation={getLocation}
            updatedCategory={updatedCategory}
            categoryLocation={categoryLocation}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] items-center w-full">
                <div className="flex flex-col items-start gap-2.5 w-full">
                  <label
                    className=" text-[#232323] text-base leading-[19.36px]"
                    htmlFor="categoryLocation.name"
                  >
                    Venue Name
                  </label>
                  <Field
                    placeholder="Enter Venue Name"
                    id="categoryLocation.name"
                    name="categoryLocation.name"
                    className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="categoryLocation.name"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-[16px] leading-[19.3px] text-[#232323]"
          htmlFor="categoryStartDate"
        >
          Event Date
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
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
  categoryLocation = null,
}) {
  const dispatch = useDispatch();
  const browserLocation = useLocation();
  const searchParams = new URLSearchParams(browserLocation.search);
  const categoryId = searchParams.get("category");
  const {rolesAccess}=useOwnerDetailsContext()

  // Query & Debounce
  const [query, setQuery] = useState("");
  const debounceCalls = useDebounce(query, 300);

  // Selected Venue
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Venue Data
  const [updatedVenues, setUpdatedVenues] = useState([]);
  const [totalVenues, setTotalVenues] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Scroll Refs
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const selectedFilter = "PUBLISHED";

  const handleRemoveVenue = () => {
    setSelectedPerson(null);
    getLocation({});
  };

  useEffect(() => {
    if (selectedPerson) {
      const { address } = selectedPerson;
      getLocation({
        address,
        name: selectedPerson?.name,
        image: selectedPerson?.bannerImages?.[0].url,
        handle: selectedPerson?.handle,
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
          getSearchVenues({
            currentPage: 1,
            selectedFilter,
            limit: 10,
            name: query,
            userRole: rolesAccess?.tournament,
          })
        ).unwrap();

        if (!result.responseCode) {
          setUpdatedVenues(result.data.venues);
          setTotalVenues(result?.data?.total || 0);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (debounceCalls) {
      getVenueByName();
    }
  }, [debounceCalls]);

  useEffect(() => {
    const getInitialVenues = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setCurrentPage(1);

        const result = await dispatch(
          getSearchVenues({
            currentPage: 1,
            selectedFilter,
            limit: 10,
            name: query,
            userRole: rolesAccess?.tournament,
          })
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
      if (isFetchingMore || updatedVenues.length >= totalVenues) return;

      try {
        setIsFetchingMore(true);
        setHasError(false);

        const nextPage = currentPage + 1;
        const result = await dispatch(
          getSearchVenues({
            currentPage: nextPage,
            selectedFilter,
            limit: 10,
            name: query,
            userRole: rolesAccess?.tournament,
          })
        ).unwrap();

        if (!result.responseCode) {
          const newVenues = [...updatedVenues, ...result.data.venues];
          const uniqueVenues = Array.from(
            new Map(newVenues.map((v) => [v._id, v])).values()
          );
          setUpdatedVenues(uniqueVenues);
          setCurrentPage(nextPage);
          setTotalVenues(result?.data?.total || 0);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsFetchingMore(false);
        setReachedBottom(false);
      }
    };

    if (
      reachedBottom &&
      !isLoading &&
      !isFetchingMore &&
      totalVenues > updatedVenues.length
    ) {
      getMoreVenues();
    }
  }, [
    reachedBottom,
    currentPage,
    totalVenues,
    updatedVenues.length,
    query,
    isLoading,
    isFetchingMore,
  ]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
    if (isAtBottom) {
      setReachedBottom(true);
    }
  };

  useEffect(() => {
    if (
      categoryId &&
      categoryLocation &&
      Object.keys(categoryLocation).length > 0
    ) {
      const temp = {
        ...categoryLocation,
        bannerImages: [{ url: categoryLocation?.venueImage }],
        name: categoryLocation?.name || "temp",
      };
      setSelectedPerson(temp);
    }
  }, []);

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
                className="group relative cursor-default py-3 px-4 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                onChange={() => {
                  setSelectedPerson(venue);
                }}
              >
                <div className="flex flex-col w-full">
                  <span className="block truncate group-data-selected:font-semibold text-lg text-[#718EBF] mb-1">
                    {venue.name}
                  </span>
                  <p className="text-sm text-[#718EBF] break-words">
                    {[
                      venue.address.line1 || venue.address.line2,
                      venue.address.city,
                      venue.address.state,
                      venue.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))
          ) : (
            <ImSpinner8 className="flex m-auto min-h-full animate-spin w-[50px] h-[50px]" />
          )}

          {hasError && (
            <div className="flex justify-center p-4">
              <p className="text-lg text-red-700">
                Some error has occurred while getting the venues. Please try
                again.
              </p>
            </div>
          )}
          {!updatedVenues?.length && !isLoading && (
            <div className="flex justify-center p-4">
              <p className="text-lg text-black-800">No venues found.</p>
            </div>
          )}
        </ComboboxOptions>
      </div>

      {selectedPerson && (
        <div className="w-full p-4 border border-gray-200 rounded-lg mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <img
                src={selectedPerson?.bannerImages?.[0]?.url}
                alt={selectedPerson?.name}
                className="w-full sm:w-32 h-32 object-cover rounded-md"
              />
              <button
                onClick={handleRemoveVenue}
                className="absolute top-2 right-2 sm:-top-2 sm:-right-2 bg-gray-500 text-white rounded-full p-1 shadow-md hover:bg-gray-600"
              >
                <RxCrossCircled className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <h3 className="text-lg font-medium mb-1">
                {selectedPerson?.name}
              </h3>
              <p className="text-sm text-gray-600 break-words">
                {selectedPerson?.address?.line1}
                {selectedPerson?.address?.line2
                  ? `, ${selectedPerson?.address?.line2}`
                  : ""}
              </p>
              <p className="text-sm text-gray-600">
                {selectedPerson?.address?.city},{" "}
                {selectedPerson?.address?.state} -{" "}
                {selectedPerson?.address?.postalCode}
              </p>
            </div>
          </div>
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
  categoryLocation: PropTypes.object,
};

ComboboxForVenuesList.propTypes = {
  isVenueNotAvailable: PropTypes.bool,
};

AddVenueAddress.propTypes = {
  location: PropTypes.object,
};
