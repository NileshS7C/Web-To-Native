import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  FieldArray,
} from "formik";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoMdTrash, IoIosCloseCircleOutline, IoMdAdd } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

import {
  imageUpload,
  uploadIcon,
  calenderIcon,
  venueUploadImage,
} from "../../Assests";
import "react-datepicker/dist/react-datepicker.css";

import { editRow, setFormOpen,resetEditRow } from "../../redux/tournament/addTournament";
import {
  deleteUploadedImage,
  uploadImage,
} from "../../redux/Upload/uploadActions";
import {
  addTournamentStepOne,
  getAll_TO,
  getAllUniqueTags,
  getSingleTournament,
} from "../../redux/tournament/tournamentActions";
import { showError } from "../../redux/Error/errorSlice";
import { showSuccess } from "../../redux/Success/successSlice";

import LocationSearchInput from "../Common/LocationSearch";
import { ErrorModal } from "../Common/ErrorModal";
import { SuccessModal } from "../Common/SuccessModal";
import { formattedDate, parseDate } from "../../utils/dateUtils";
import { ROLES, venueImageSize } from "../../Constant/app";
import Spinner from "../Common/Spinner";
import Button from "../Common/Button";
import TextError from "../Error/formError";
import Combopopover from "../Common/Combobox";
import { rolesWithTournamentOwnerAccess } from "../../Constant/tournament";
import { useFormikContextFunction } from "../../Providers/formikContext";
import { useOwnerDetailsContext } from "../../Providers/onwerDetailProvider";
import { deleteImages } from "../../redux/Upload/uploadActions";
import { MdDeleteOutline } from "react-icons/md";
import {
  resetDeletedImages,
  setDeletedImages,
} from "../../redux/Upload/uploadImage";
import { useRef } from "react";
import { setWasCancelled } from "../../redux/tournament/getTournament";
import "../Tournament/TournamentQuill.css";
const requiredTournamentFields = (tournament) => {
  const {
    ownerUserId,
    tournamentId,
    tournamentName,
    preRequisites,
    tournamentLocation: {
      name,
      address: {
        location: { is_location_exact, ...locationWithOutExact },
        ...restOfAddress
      },
    },
    handle,
    tags,
    description,
    startDate,
    endDate,
    bannerDesktopImages,
    bannerMobileImages,
    bookingStartDate,
    bookingEndDate,
    sponsors,
    tournamentGallery,
    whatToExpect,
    whatsappGroupLink,
    instagramHandle
  } = tournament;

  const updatedTournamentLocation = {
    ...restOfAddress,
    location: locationWithOutExact,
  };

  return {
    ownerUserId,
    tournamentId,
    tournamentName,
    preRequisites,
    tournamentLocation: { name,address: updatedTournamentLocation },
    handle,
    tags,
    description,
    startDate,
    endDate,
    bannerDesktopImages,
    bannerMobileImages,
    bookingStartDate,
    bookingEndDate,
    sponsors,
    tournamentGallery,
    whatToExpect,
    whatsappGroupLink,
    instagramHandle
  };
};

const initialValues = {
  step: 1,
  ownerUserId: "",
  tournamentId: "",
  tournamentName: "",
  tournamentLocation: {
    name,
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
  preRequisites: "",
  handle: "",
  tags: [],
  description: "",
  startDate: null,
  endDate: null,
  bannerDesktopImages: [],
  bannerMobileImages: [],
  bookingStartDate: null,
  bookingEndDate: null,
  sponsors: [],
  tournamentGallery: [],
  instagramHandle: "",
  whatsappGroupLink: "",
  whatToExpect: [{ title: "", description: "" }],
};

export const TournamentInfo = ({ tournament, status, isDisable, disabled }) => {
  const {
    singleTournamentOwner,
    tournamentOwners,
    tournamentOwnerUserId,
    rolesAccess,
  } = useOwnerDetailsContext();
  const validationSchema = yup.object({
    ownerUserId: yup.string().required("Name is required"),
    tournamentName: yup.string().required("Please provide a tournament name."),
    tournamentLocation: yup.object().shape({
      name: yup.string().optional(),
      address: yup.object().shape({
        line1: yup.string().notRequired(),
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
            .length(2, "Location must be provided.")
            .required("Location is required."),
        }),
      }),
    }),

    handle: yup.string().required(),
    description: yup.string(),
    startDate: yup.date().required("Please provide the tournament start date."),

    endDate: yup
      .date()
      .nullable()
      .required("Please provide the tournament End date.")
      .test(
        "is-after-today",
        "Tournament end date must be today or later.",
        (value) => !value || value >= new Date()
      )
      .min(
        yup.ref("startDate"),
        "Tournament end date must be equal to or after the start date."
      ),

    bannerImage: yup.object().shape({
      desktop: yup
        .mixed()
        .test("file-size", "Desktop banner image is too large", (value) => {
          if (!value) return true;

          return !value || (value && value?.size <= 1000 * 1024); // 100 KB
        })
        .test(
          "file-type",
          "Desktop banner image should be of valid image type",
          (value) => {
            if (!value) return true;
            return (
              value &&
              ["image/jpeg", "image/png", "image/gif"].includes(value?.type)
            );
          }
        ),

      mobile: yup
        .mixed()
        .test("file-size", "Mobile banner image is too large", (value) => {
          if (!value) return true;
          return !value || value.size <= 500 * 1024; // 100kb
        })
        .test(
          "file-type",
          "Mobile banner image should be of valid image type",
          (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/gif"].includes(
              value.type
            );
          }
        ),
    }),

    sponserImage: yup
      .mixed()
      .test("file-size", "Sponser banner image is too large", (value) => {
        if (!value) return true;
        return value.size <= 100 * 1024; // 100 KB
      })
      .test(
        "file-type",
        "Sponser banner image should be of valid image type",
        (value) => {
          if (!value) return true;
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        }
      ),

    bookingStartDate: yup
      .date()
      .nullable()
      .required("Booking start date is required.")
      .test(
        "valid-booking-start-date",
        "Booking start Date must be before the tournament start date.",
        function (value) {
          const { startDate, endDate } = this.parent;
          const newStartDate = new Date(startDate).getTime();
          const newEndDate = new Date(endDate).getTime();
          const bookingDate = new Date(value).getTime();

          return newStartDate > bookingDate && bookingDate < newEndDate;
        }
      ),
    bookingEndDate: yup
      .date()
      .nullable()
      .required("Booking end date is required.")
      .min(
        yup.ref("bookingStartDate"),
        "Booking end date must be after the booking start date and before the tournament start date"
      )
      .test(
        "valid-booking-end-date",
        "Booking end Date must be after the booking start date and before the tournament start date",
        function (value) {
          const { startDate, endDate } = this.parent;
          const newStartDate = new Date(startDate).getTime();
          const newEndDate = new Date(endDate).getTime();
          const bookingDate = new Date(value).getTime();

          return bookingDate < newEndDate && bookingDate < newStartDate;
        }
      ),
    sponserName: yup.string(),
    instagramHandle: yup.string().nullable(),
    whatsappGroupLink: yup
      .string()
      .nullable(),
    whatToExpect: yup.array().of(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
      })
    ),
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const { setSubmitForm, setIsSubmitting } = useFormikContextFunction();
  const [initialState, setInitialState] = useState(initialValues);
  const { location } = useSelector((state) => state.location);
  const [selectedTags, setSelectedTags] = useState([]);
  const isAddInThePath = window.location.pathname.includes("add");
  const { isGettingTags, tags, isGettingALLTO, err_IN_TO } = useSelector(
    (state) => state.Tournament
  );

  const {  userInfo } = useSelector((state) => state.auth);
  // console.log(userInfo);
  const { deletedImages } = useSelector((state) => state.upload);
  const { isSuccess, isGettingTournament, tournamentEditMode, wasCancelled } =
    useSelector((state) => state.GET_TOUR);
  const formikRef = useRef();
  useEffect(() => {
    dispatch(getAllUniqueTags());
  }, []);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      let user;

      if (rolesWithTournamentOwnerAccess.includes(rolesAccess?.tournament)) {
        user = tournamentOwners.owners?.find(
          (owner) => owner.name === values.ownerUserId
        );
      } else if (["TOURNAMENT_OWNER","TOURNAMENT_BOOKING_OWNER"].includes(rolesAccess?.tournament)) {
        user = singleTournamentOwner
          ? { id: singleTournamentOwner.id }
          : { id: "" };
      }
      const updatedValues = {
        ...values,
        ownerUserId: user.id,
        startDate: formattedDate(values.startDate),
        endDate: formattedDate(values.endDate),
        bookingStartDate: formattedDate(values.bookingStartDate),
        bookingEndDate: formattedDate(values.bookingEndDate),
      };
      const result = await dispatch(
        addTournamentStepOne({ formData: updatedValues })
      ).unwrap();

      dispatch(
        showSuccess({
          message: tournamentId
            ? "Tournament updated successfully."
            : "Tournament added successfully.",
          onClose: "hideSuccess",
        })
      );

      if (deletedImages?.length > 0) {
        dispatch(deleteImages(deletedImages));
      }
      setInitialState(values);
      if (!result.responseCode && isAddInThePath) {
        dispatch(setFormOpen("event"));
        dispatch(getSingleTournament({ tournamentId, ownerId: user.id }));
        navigate(`/tournaments/${result?.data?.tournament._id}/add`);
        resetForm();
      }
      dispatch(resetEditRow());
    } catch (error) {
      console.log(" error", error);

      dispatch(
        showError({
          message: error?.data?.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      dispatch(resetDeletedImages());
    }
  };
   
  
  useEffect(() => {
   
    if (isSuccess && tournamentId && Object.keys(tournament).length > 0) {
      const updatedTournament = requiredTournamentFields(tournament);
      const owner = rolesWithTournamentOwnerAccess.includes(
        rolesAccess?.tournament
      )
        ? tournamentOwners?.owners?.find(
            (owner) => owner.id === updatedTournament.ownerUserId
          ) ?? null
        : singleTournamentOwner;
      if (owner) {
        const ownerName = owner.name;
        setInitialState((prevState) => ({
          ...prevState,
          ...updatedTournament,
          ownerUserId: ownerName,
          tournamentId,
          startDate: parseDate(updatedTournament?.startDate),
          endDate: parseDate(updatedTournament?.endDate),
          bookingStartDate: parseDate(updatedTournament?.bookingStartDate),
          bookingEndDate: parseDate(updatedTournament?.bookingEndDate),
        }));

        setSelectedTags(updatedTournament?.tags);
      }
    }
  }, [tournament, tournamentId, isSuccess, tournamentOwners]);
  useEffect(() => {
    if (!tournamentEditMode && wasCancelled) {
      handleCancel();
    }
    setWasCancelled(false);
  }, [tournamentEditMode]);
  useEffect(() => {
    return () => {
      dispatch(resetDeletedImages());
    };
  }, []);
  if (isGettingTournament) {
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
      innerRef={formikRef}
    >
      {({ isSubmitting, submitForm }) => {
        setSubmitForm(() => submitForm);
        setIsSubmitting(isSubmitting);
        return (
          <Form>
            <fieldset>
              <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323]">
                <ErrorModal />
                <SuccessModal />
                <TournamentBasicInfo
                  userName={userInfo?.name || ""}
                  userRole={rolesAccess?.tournament}
                  tournamentOwners={tournamentOwners}
                  isGettingALLTO={isGettingALLTO}
                  hasError={err_IN_TO}
                  tournamentId={tournamentId}
                  isDisable={isDisable}
                  disabled={disabled}
                />
                <TournamentMetaData
                  isGettingTags={isGettingTags}
                  uniqueTags={tags}
                  selectedTags={selectedTags}
                  tournamentId={tournamentId}
                  disabled={disabled}
                />
                <TournamentAddress location={location} disabled={disabled} />
                <TournamentDescription disabled={disabled} />
                <TournamentPrerequisite disabled={disabled} />
                <TournamentInstagramHandle disabled={disabled} />
                <TournamentWhatsappHandle disabled={disabled}/>
                <TournamentWhatToExpect disabled={disabled} />
                <TournamentDates disabled={disabled} />
                <TournamentFileUpload
                  dispatch={dispatch}
                  tournamentId={tournamentId}
                  disabled={disabled}
                />
                <TournamentSponserTable disabled={disabled} />
                <TournamentBookingDates disabled={disabled} />
                <TournamentGallery
                  dispatch={dispatch}
                  tournamentId={tournamentId}
                  disabled={disabled}
                />
                <Button
                  className={`w-[200px] h-[60px] bg-[#1570EF] text-white ml-auto rounded-[8px] ${
                    status !== "DRAFT" && tournamentId ? "hidden" : ""
                  }`}
                  type="submit"
                  loading={isSubmitting}
                  disabled={tournamentId && !isDisable}
                >
                  Save and Continue
                </Button>
              </div>
            </fieldset>
          </Form>
        );
      }}
    </Formik>
  );
};

const TournamentBasicInfo = ({
  userName,
  userRole,
  tournamentOwners,
  isGettingALLTO,
  hasError,
  tournamentId,
  disabled,
}) => {
  const { setFieldError, values, setFieldValue } = useFormikContext();
  const { singleTournamentOwner } = useSelector((state) => state.GET_TOUR);
  const {rolesAccess}=useOwnerDetailsContext();
  useEffect(() => {
    if (hasError) {
      setFieldError("ownerUserId", "Error in getting the owners.");
    } else {
      setFieldError("ownerUserId", "");
    }
  }, [hasError, tournamentOwners]);

  useEffect(() => {
    if (singleTournamentOwner && ["TOURNAMENT_OWNER", "TOURNAMENT_BOOKING_OWNER"].includes(userRole)) {
      setFieldValue("ownerUserId", singleTournamentOwner.name);
    }
  }, []);
  return (
    <div className="grid grid-col-1 md:grid-cols-2 gap-3 md:gap-[30px]">
      {!rolesWithTournamentOwnerAccess.includes(rolesAccess?.tournament) ? (
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-base leading-[19.36px]" htmlFor="ownerUserId">
            Tournament Organizer Name
          </label>
          <Field
            placeholder="Organizer Name"
            id="ownerUserId"
            name="ownerUserId"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={singleTournamentOwner?.name}
            disabled={true}
          />

          <ErrorMessage name="ownerUserId" component={TextError} />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-base leading-[19.36px]" htmlFor="ownerUserId">
            Tournament Organizer Name
          </label>
          <Field
            as="select"
            placeholder="Organizer Name"
            id="ownerUserId"
            name="ownerUserId"
            className="w-full px-[19px] border-[1px]
          border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none
          focus:ring-2 focus:ring-blue-500"
            disabled={tournamentId ? true : false}
          >
            <option>Select Tournament Owner</option>
            {!isGettingALLTO && tournamentOwners?.owners?.length > 0
              ? tournamentOwners.owners.map((owner, index) => {
                  return (
                    <option key={`${owner.name}_${index}`} value={owner.name}>
                      {owner.name}
                    </option>
                  );
                })
              : []}

            {isGettingALLTO && <ImSpinner2 width="20px" height="20px" />}
          </Field>
          <ErrorMessage name="ownerUserId" component={TextError} />
        </div>
      )}

      <div className="flex flex-col items-start gap-2.5">
        <label className="text-base leading-[19.36px]" htmlFor="tournamentName">
          Tournament Name
        </label>
        <Field
          disabled={disabled}
          placeholder="Enter Tournament Name"
          id="tournamentName"
          name="tournamentName"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="tournamentName" component={TextError} />
      </div>
    </div>
  );
};

const TournamentMetaData = ({
  isGettingTags,
  uniqueTags,
  selectedTags,
  tournamentId,
  disabled,
}) => {
  const [tournamentHandle, setTournamentVenueHandle] = useState("");
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    const { tournamentName = "" } = values;
    if (values.tournamentName) {
      const handle = tournamentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setTournamentVenueHandle(handle);
      setFieldValue("handle", handle);
    }
  }, [values.tournamentName]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="handle"
        >
          Tournament Handle
        </label>
        <Field
          placeholder="Enter Venue Handle"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setFieldValue("handle", e.target.value);
          }}
          disabled={disabled}
        />
        <ErrorMessage name="handle" component={TextError} />
      </div>

      <Combopopover
        isGettingTags={isGettingTags}
        uniqueTags={uniqueTags}
        setFieldValue={setFieldValue}
        checkedTags={selectedTags}
        placeholder="Enter Tournament Tags"
        label="Tournament Tags"
        id={tournamentId}
        disabled={disabled}
      />

      <ErrorMessage name="tags" component={TextError} />

      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="tournamentLocation.address.location"
        >
          Google Map
        </label>

        <LocationSearchInput
          id="tournamentLocation.address.location"
          name="tournamentLocation.address.location"
          disabled={disabled}
        />
        <ErrorMessage
          name="tournamentLocation.address.location.coordinates"
          component={TextError}
        />
      </div>
    </div>
  );
};
const TournamentAddress = ({ location, disabled }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (location.city || location.state || location.lng || location.lat) {
      setFieldValue(
        "tournamentLocation.address.line1",
        location?.address_line1
      );
      setFieldValue(
        "tournamentLocation.address.location.coordinates[0]",
        location?.lng
      );
      setFieldValue(
        "tournamentLocation.address.location.coordinates[1]",
        location?.lat
      );

      setFieldValue("tournamentLocation.address.line2", location.address_line2);
      setFieldValue("tournamentLocation.address.city", location.city);
      setFieldValue("tournamentLocation.address.state", location.state);
      setFieldValue("tournamentLocation.address.postalCode", location.pin_code);
      setFieldValue("tournamentLocation.name",location.name)
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
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-base leading-[19.36px] text-[#232323]">
        Tournament Address
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.name"
          >
            Location Name
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Location Name"
            id="tournamentLocation.name"
            name="tournamentLocation.name"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tuornamentLocation.name"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.line1"
          >
            Line 1
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Tournament Address"
            id="tournamentLocation.address.line1"
            name="tournamentLocation.address.line1"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tournamentLocation.address.line1"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.line2"
          >
            Line 2
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Venue Address"
            id="tournamentLocation.address.line2"
            name="tournamentLocation.address.line2"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tournamentLocation.address.line2"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.city"
          >
            City
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Tournament Address"
            id="tournamentLocation.address.city"
            name="tournamentLocation.address.city"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tournamentLocation.address.city"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.state"
          >
            State
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Venue Address"
            id="tournamentLocation.address.state"
            name="tournamentLocation.address.state"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tournamentLocation.address.state"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.postalCode"
          >
            Pincode
          </label>
          <Field
            disabled={disabled}
            placeholder="Enter Venue Address"
            id="tournamentLocation.address.postalCode"
            name="tournamentLocation.address.postalCode"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="tournamentLocation.address.postalCode"
            component={TextError}
          />
        </div>
      </div>
    </div>
  );
};

const TournamentDescription = ({ disabled }) => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (values.description) {
      setFieldValue("description", values.description);
    }
  }, [values.description]);
  return (
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
        onChange={(e) => {
          setFieldValue("description", e);
        }}
        className="custom-quill"
        value={values?.description}
        readOnly={disabled}
      />
    </div>
  );
};

const TournamentPrerequisite = ({ disabled }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="grid grid-cols-1 gap-2">
      <label
        className="text-base leading-[19.36px] justify-self-start"
        htmlFor="preRequisites"
      >
        Prerequisite
      </label>
      <ReactQuill
        theme="snow"
        id="preRequisites"
        name="preRequisites"
        placeholder="Enter Tournament Prerequisites"
        onChange={(e) => {
          setFieldValue("preRequisites", e);
        }}
        className="custom-quill"
        value={values?.preRequisites}
        readOnly={disabled}
      />
    </div>
  );
};

const TournamentInstagramHandle = ({ disabled }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="grid grid-cols-1 gap-2">
      <label
        className="text-base leading-[19.36px] justify-self-start"
        htmlFor="instagramHandle"
      >
        Instagram Handle
      </label>
      <Field
        placeholder="Enter Instagram Handle"
        id="instagramHandle"
        name="instagramHandle"
        className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      <ErrorMessage name="instagramHandle" component={TextError} />
    </div>
  );
};

const TournamentWhatsappHandle = ({ disabled }) => {
  

  return (
    <div className="grid grid-cols-1 gap-2">
      <label
        className="text-base leading-[19.36px] justify-self-start"
        htmlFor="whatsappGroupLink"
      >
        Whatsapp Group Link
      </label>
      <Field
        placeholder="Enter Whatsapp Group link"
        id="whatsappGroupLink"
        name="whatsappGroupLink"
        className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      <ErrorMessage name="whatsappGroupLink" component={TextError} />
    </div>
  );
};

const TournamentWhatToExpect = ({ disabled }) => {
  const { values, setFieldValue } = useFormikContext();

  const handleAddRow = () => {
    setFieldValue("whatToExpect", [
      ...values.whatToExpect,
      { title: "", description: "" },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedWhatToExpect = values.whatToExpect.filter(
      (_, i) => i !== index
    );
    setFieldValue("whatToExpect", updatedWhatToExpect);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-base leading-[19.36px]">What to Expect</p>
        <button
          type="button"
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={disabled}
        >
          Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-[700px] w-full border-collapse rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Description</th>
              {!disabled && <th className="border p-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {values.whatToExpect.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <Field
                    name={`whatToExpect.${index}.title`}
                    placeholder="Enter title"
                    className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={disabled}
                  />
                  <ErrorMessage
                    name={`whatToExpect.${index}.title`}
                    component={TextError}
                  />
                </td>
                <td className="border p-2">
                  <Field
                    name={`whatToExpect.${index}.description`}
                    placeholder="Enter description"
                    className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={disabled}
                  />
                  <ErrorMessage
                    name={`whatToExpect.${index}.description`}
                    component={TextError}
                  />
                </td>
                {!disabled && (
                  <td className="border p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        disabled={values.whatToExpect.length === 1}
                      >
                        <MdDeleteOutline className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TournamentFileUpload = ({ dispatch, tournamentId, disabled }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  // Determine if the current path includes "add",
  // which indicates the user is in tournament creation mode.
  // This flag is used to control image deletion behavior:
  // - In "add" mode: images are deleted immediately when removed.
  // - In "edit" mode: images are deleted on save.
  const isAddInThePath = window.location.pathname.includes("add");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px]">
      <DesktopBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        tournamentId={tournamentId}
        disabled={disabled}
        isAddInThePath={isAddInThePath}
      />
      <MobileBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        tournamentId={tournamentId}
        disabled={disabled}
        isAddInThePath={isAddInThePath}
      />
    </div>
  );
};

const DesktopBannerImageUpload = ({
  values,
  setFieldValue,
  setFieldError,
  dispatch,
  tournamentId,
  disabled,
  isAddInThePath,
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { deletedImages } = useSelector((state) => state.upload);

  useEffect(() => {
    const previewImages = values?.bannerDesktopImages?.length
      ? [{ preview: values.bannerDesktopImages }]
      : [];

    setPreviews(previewImages);
  }, [values?.bannerDesktopImages]);

  const handleRemoveImageDesk = (value) => {
    if (isAddInThePath) {
      dispatch(deleteUploadedImage(value[0]));
    } else dispatch(setDeletedImages([...deletedImages, value[0]]));
    setPreviews([]);
    setIsError(false);
    setErrorMessage("");
    setFieldValue("bannerDesktopImages", []);
  };

  const handleFileUploadDesk = async (e) => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError(
        "bannerDesktopImages",
        "File should be a valid image type."
      );
      setErrorMessage("File should be a valid image type.");
      setIsLoading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerDesktopImages", "File size should be less than 5MB");
      setErrorMessage("File size should be less than 5MB");
      setIsLoading(false);
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      setPreviews((prev) => [...prev, { preview: result?.data?.url }]);
      const url = result.data.url;
      setFieldValue("bannerDesktopImages", [url]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("bannerDesktopImages", err.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative flex flex-col items-start gap-2.5 ">
      <label
        className="text-base leading-[19.36px]"
        htmlFor="bannerDesktopImages"
      >
        Banner Image (Desktop)
      </label>

      <div className="relative flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <ImSpinner2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-[#5B8DFF] mt-2">Uploading...</p>
          </div>
        ) : (
          <>
            {previews[0]?.preview && (
              <>
                <img
                  src={previews[0]?.preview || ""}
                  className="absolute inset-0 object-scale-down rounded h-full w-full z-100"
                  alt="desktop banner"
                />
                {previews[0]?.preview && (
                  <IoMdTrash
                    className="absolute right-0 top-0 w-6 h-6 z-100 text-black  cursor-pointer shadow-lg"
                    onClick={() => {
                      if (!disabled) {
                        handleRemoveImageDesk(previews[0]?.preview);
                      }
                    }}
                  />
                )}
              </>
            )}

            {!previews[0]?.preview && (
              <>
                <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

                <p className="text-sm text-[#5B8DFF]">
                  Click to upload{" "}
                  <span className="text-sm text-[#353535] "> or drag and drop</span>
                </p>

                <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
                <p className="text-xs text-[#353535] mt-1">
                  (Image Size: 1200x600)
                </p>
                <Field name="bannerDesktopImages">
                  {({ field }) => (
                    <input
                      {...field}
                      id="bannerDesktopImages"
                      name="bannerDesktopImages"
                      onChange={(e) => {
                        handleFileUploadDesk(e);
                      }}
                      value=""
                      type="file"
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                      multiple={false}
                      disabled={disabled}
                    />
                  )}
                </Field>
              </>
            )}
          </>
        )}
      </div>

      <ErrorMessage name="bannerDesktopImages" component={TextError} />
    </div>
  );
};

const MobileBannerImageUpload = ({
  values,
  setFieldValue,
  setFieldError,
  dispatch,
  tournamentId,
  disabled,
  isAddInThePath,
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { deletedImages } = useSelector((state) => state.upload);

  useEffect(() => {
    const previewImages = values?.bannerMobileImages?.length
      ? [{ preview: values.bannerMobileImages }]
      : [];

    setPreviews(previewImages);
  }, [values?.bannerMobileImages]);

  const handleRemoveImageDesk = (value) => {
    if (isAddInThePath) {
      dispatch(deleteUploadedImage(value[0]));
    } else dispatch(setDeletedImages([...deletedImages, value[0]]));
    setPreviews([]);
    setIsError(false);
    setErrorMessage("");
    setFieldValue("bannerMobileImages", []);
  };

  const handleFileUploadMob = async (e) => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("bannerMobileImages", "File should be a valid image type.");
      setErrorMessage("File should be a valid image type.");
      setIsLoading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerMobileImages", "File size should be less than 5MB");
      setErrorMessage("File size should be less than 5MB");
      setIsLoading(false);
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();

      setPreviews((prev) => [...prev, { preview: result?.data?.url }]);
      const url = result?.data?.url;
      setFieldValue("bannerMobileImages", [url]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("bannerMobileImages", err.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative flex flex-col items-start gap-2.5 ">
      <label
        className="text-base leading-[19.36px]"
        htmlFor="bannerMobileImages"
      >
        Banner Image (Mobile)
      </label>

      <div className="relative flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <ImSpinner2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-[#5B8DFF] mt-2">Uploading...</p>
          </div>
        ) : (
          <>
            {previews[0]?.preview && (
              <>
                <img
                  src={previews[0]?.preview || ""}
                  className="absolute inset-0 object-scale-down rounded h-full w-full z-100"
                />
                {previews[0]?.preview && (
                  <IoMdTrash
                    className="absolute right-0 top-0 w-6 h-6 z-100 text-black  cursor-pointer shadow-lg"
                    onClick={() => {
                      if (!disabled) {
                        handleRemoveImageDesk(previews[0]?.preview);
                      }
                    }}
                  />
                )}
              </>
            )}

            {!previews[0]?.preview && (
              <>
                <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

                <p className="text-sm text-[#5B8DFF]">
                  Click to upload{" "}
                  <span className="text-sm text-[#353535] "> or drag and drop</span>
                </p>

                <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
                <p className="text-xs text-[#353535] mt-1">(Image Size: 800x400)</p>

                <Field name="bannerMobileImages">
                  {({ field }) => (
                    <input
                      {...field}
                      id="bannerMobileImages"
                      name="bannerMobileImages"
                      onChange={(e) => {
                        handleFileUploadMob(e);
                      }}
                      value=""
                      type="file"
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                      disabled={disabled}
                    />
                  )}
                </Field>
              </>
            )}
          </>
        )}
      </div>
      <ErrorMessage name="bannerMobileImages" component={TextError} />
    </div>
  );
};

const TournamentSponserTable = ({ disabled }) => {
  const dispatch = useDispatch();
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorImage, setSponsorImage] = useState("");
  const { setFieldError } = useFormikContext();
  const { editRowIndex } = useSelector((state) => state.Tournament);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    const uploadedFile = e.target.files[0];
    
    if (!uploadedFile) {
      setIsLoading(false);
      return;
    }

    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("sponserImage", "File should be a valid image type.");
      setErrorMessage("File should be a valid image type.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (uploadedFile.size > maxSize) {
      setFieldError("sponserImage", "File size should be less than 5MB");
      setErrorMessage("File size should be less than 5MB");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const url = result.data.url;
      setSponsorImage(url);
      setErrorMessage("");
      setIsError(false);
      return url;
    } catch (err) {
      setErrorMessage(err.data?.message || "Error uploading image");
      setIsError(true);
      setFieldError("sponsors.sponserImage", err.data?.message || "Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FieldArray name="sponsors">
      {({ push, remove, form }) => (
        <div className="grid grid-cols-1 gap-2.5">
          <p className="text-base text-[#232323] justify-self-start">
            Sponsors
          </p>
          <div className="overflow-x-auto rounded-md w-full">
            <table className="border-[1px] border-[#EAECF0] rounded-[8px] table-auto min-w-[700px] w-full">
              <thead>
                <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b-[1px] h-[44px]">
                  <th className="text-left p-2">S.No.</th>
                  <th className="text-left p-2">Sponsor Logo</th>
                  <th className="text-left p-2">Sponsor Name</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {form.values.sponsors.length > 0 &&
                  form.values.sponsors.map((row, index) => (
                    <tr
                      className="text-sm text-[#667085]"
                      key={`sponsors.${index}.sponsorImage`}
                    >
                      <td className="text-left p-2">{index + 1}</td>
                      <td className="text-left p-2">
                        <div className="flex relative">
                          <div className="block text-center">
                            {isLoading && editRowIndex === index ? (
                              <div className="flex flex-col items-center justify-center">
                                <ImSpinner2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-xs text-[#5B8DFF] mt-1">Uploading...</p>
                              </div>
                            ) : (
                              <img
                                src={row.sponsorImage || imageUpload}
                                alt="sponsor logo"
                                className="w-8 h-8"
                              />
                            )}
                            <p className="text-[11px] text-[#353535]">
                              (Image Size: 200x200)
                            </p>
                          </div>
                          <Field name={`sponsors.${index}.sponsorImage`}>
                            {({ form, field }) => (
                              <input
                                {...field}
                                id={`sponsors.${index}.sponsorImage`}
                                name={`sponsors.${index}.sponsorImage`}
                                onChange={async (e) => {
                                  const url = await handleFileUpload(e);
                                  form.setFieldValue(
                                    `sponsors.${index}.sponsorImage`,
                                    url
                                  );
                                }}
                                value=""
                                type="file"
                                className="absolute w-8 h-8 inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                                multiple={false}
                                disabled={disabled || editRowIndex !== index}
                              />
                            )}
                          </Field>
                        </div>
                      </td>
                      <td className="text-left p-2">
                        <Field name={`sponsors.${index}.sponsorName`}>
                          {({ form, field }) => (
                            <input
                              {...field}
                              id={`sponsors.${index}.sponsorName`}
                              name={`sponsors.${index}.sponsorName`}
                              placeholder="Enter Sponsor Name"
                              className="w-[80%] px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={disabled || editRowIndex !== index}
                              readOnly={disabled || editRowIndex !== index}
                            />
                          )}
                        </Field>
                      </td>
                      <td className="text-left p-2">
                        {!disabled && (
                          <div className="flex gap-4">
                            <RiDeleteBin6Line
                              className="w-4 h-4 cursor-pointer"
                              onClick={() => {
                                dispatch(
                                  deleteUploadedImage(
                                    form?.values?.sponsors[index]?.sponsorImage
                                  )
                                );
                                remove(index);
                              }}
                            />
                            <MdOutlineModeEditOutline
                              className="w-4 h-4 cursor-pointer"
                              onClick={() => {
                                dispatch(editRow(index));
                              }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                <tr className="text-sm text-[#667085]" key="sponsors.new">
                  <td className="text-left p-2">
                    {form.values.sponsors.length + 1}
                  </td>
                  <td className="text-left p-2">
                    <div className="flex relative">
                      <div className="block text-center">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center">
                            <ImSpinner2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-xs text-[#5B8DFF] mt-1">Uploading...</p>
                          </div>
                        ) : (
                          <img
                            src={sponsorImage || imageUpload}
                            alt="sponsor logo"
                            className="w-8 h-8"
                          />
                        )}
                        <p className="text-[11px] text-[#353535]">
                          (Image Size: 200x200)
                        </p>
                      </div>
                      <input
                        id="sponsorImage"
                        name="sponsorImage"
                        onChange={(e) => {
                          handleFileUpload(e);
                        }}
                        value=""
                        type="file"
                        className="absolute w-8 h-8 inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                        multiple={false}
                        disabled={disabled}
                      />
                    </div>
                  </td>
                  <td className="text-left p-2">
                    <input
                      id="sponsorName"
                      name="sponsorName"
                      placeholder="Enter Sponsor Name"
                      className="w-[80%] px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setSponsorName(e.target.value);
                      }}
                      value={sponsorName}
                      disabled={disabled}
                    />
                  </td>
                  <td className="text-left p-2">
                    <Button
                      className="w-[60px] h-[40px] rounded-[8px] text-white"
                      type="button"
                      onClick={() => {
                        push({ sponsorImage, sponsorName });
                        setSponsorImage("");
                        setSponsorName("");
                      }}
                      disabled={disabled}
                    >
                      ADD
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="sponsors" component={TextError} />
        </div>
      )}
    </FieldArray>
  );
};

const TournamentDates = ({ disabled }) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const toggleDates = () => {
    setShowStartDate(true);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-base leading-[19.36px]" htmlFor="startDate">
          Tournament Start Date
        </label>
        <div className="relative">
          <Field name="startDate">
            {({ field, form }) => (
              <>
                <DatePicker
                  id="startDate"
                  name="startDate"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  selected={field.value ? new Date(field.value) : null}
                  className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                  dateFormat="dd/MM/yy"
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("startDate", date);
                    }
                  }}
                  disabled={disabled}
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
        <ErrorMessage name="startDate" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-base leading-[19.36px]" htmlFor="endDate">
          Tournament End Date
        </label>
        <div className="relative">
          <Field name="endDate">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="endDate"
                  name="endDate"
                  placeholderText="Select date"
                  selected={field.value ? new Date(field.value) : null}
                  toggleCalendarOnIconClick
                  className=" w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                  dateFormat="dd/MM/yy"
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("endDate", date);
                    }
                  }}
                  disabled={disabled}
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
        <ErrorMessage name="endDate" component={TextError} />
      </div>
    </div>
  );
};

const TournamentBookingDates = ({ disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <label
          className="text-base leading-[19.36px]"
          htmlFor="bookingStartDate"
        >
          Registration Start Date
        </label>

        <div className="relative">
          <Field name="bookingStartDate">
            {({ form, field }) => (
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
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("bookingStartDate", date);
                    }
                  }}
                  disabled={disabled}
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
        <ErrorMessage name="bookingStartDate" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-base leading-[19.36px]" htmlFor="bookingEndDate">
          Registration End Date
        </label>
        <div className="relative">
          <Field name="bookingEndDate">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="bookingEndDate"
                  name="bookingEndDate"
                  placeholderText="Select date"
                  startDate=""
                  toggleCalendarOnIconClick
                  className=" w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                  dateFormat="dd/MM/yy"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("bookingEndDate", date);
                    }
                  }}
                  disabled={disabled}
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
        <ErrorMessage name="bookingEndDate" component={TextError} />
      </div>
    </div>
  );
};

const TournamentGallery = ({ dispatch, tournamentId, disabled }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  const tournamentEditMode = useSelector(
    (state) => state.GET_TOUR.tournamentEditMode
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const previewImages = values?.tournamentGallery?.length
      ? values.tournamentGallery.map((url) => ({
          preview: url,
        }))
      : [];
    setPreviews(previewImages);
  }, [values?.tournamentGallery]);

  const handleRemoveImage = (index) => {
    const newBannerImages = values.tournamentGallery.filter(
      (_, i) => i !== index
    );
    setFieldValue("tournamentGallery", newBannerImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const handleFileUpload = async (e) => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    const uploadedFile = e.target.files[0];
    
    if (!uploadedFile) {
      setIsLoading(false);
      return;
    }

    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("tournamentGallery", "File should be a valid image type.");
      setErrorMessage("File should be a valid image type.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (values.tournamentGallery.length === 4) {
      dispatch(
        showError({
          message: "You can add up to 4 images only.",
          onClose: "hideError",
        })
      );
      setIsLoading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (uploadedFile.size > maxSize) {
      setFieldError("tournamentGallery", "File size should be less than 5MB");
      setErrorMessage("File size should be less than 5MB");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      setPreviews((prev) => [...prev, { preview: result?.data?.url }]);
      const url = result?.data?.url;
      setFieldValue("tournamentGallery", [...values.tournamentGallery, url]);
      setErrorMessage("");
      setIsError(false);
    } catch (err) {
      setErrorMessage(err.data?.message || "Error uploading image");
      setIsError(true);
      setFieldError("tournamentGallery", err.data?.message || "Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2.5 mb-2">
      <p className="text-base leading-[19.36px] text-[#232323]">
        Tournament Gallery
      </p>

      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-2.5 w-full overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex flex-none w-[48%] md:w-[30%] lg:w-[23%] gap-3"
              key={`tournamentGallery-${index}`}
            >
              <img
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded w-full h-auto"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    if (!disabled) {
                      handleRemoveImage(index);
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-start gap-2.5 w-full h-[133px]">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <ImSpinner2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-[#5B8DFF] mt-2">Uploading...</p>
              </div>
            ) : (
              <>
                <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

                <p className="text-sm text-[#5B8DFF]">
                  Click to upload{" "}
                  <span className="text-sm text-[#353535] "> or drag and drop</span>
                </p>

                <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
                <p className="text-xs text-[#353535] mt-1">(Image size: 600x600)</p>

                <FieldArray name="tournamentGallery">
                  {({ form, field, meta }) => (
                    <input
                      {...field}
                      id="tournamentGallery"
                      name="tournamentGallery"
                      onChange={(e) => {
                        handleFileUpload(e);
                      }}
                      value=""
                      type="file"
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                      disabled={disabled}
                    />
                  )}
                </FieldArray>
              </>
            )}
          </div>
          {isError && <TextError>{errorMessage}</TextError>}
          <ErrorMessage name="tournamentGallery" component={TextError} />
        </div>
      </div>
    </div>
  );
};

TournamentGallery.propTypes = {
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
};

TournamentBasicInfo.propTypes = {
  userRole: PropTypes.string,
  userName: PropTypes.string,
  tournamentOwners: PropTypes.array,
  isGettingALLTO: PropTypes.bool,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
};

TournamentMetaData.propTypes = {
  isGettingTags: PropTypes.bool,
  uniqueTags: PropTypes.array,
  selectedTags: PropTypes.array,
  disabled: PropTypes.bool,
};

TournamentFileUpload.propTypes = {
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
};

DesktopBannerImageUpload.propTypes = {
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldError: PropTypes.func,
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
};

MobileBannerImageUpload.propTypes = {
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldError: PropTypes.func,
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
};
TournamentAddress.propTypes = {
  location: PropTypes.array,
};

TournamentSponserTable.propTypes = {
  disabled: PropTypes.bool,
};
TournamentWhatToExpect.propTypes = {
  disabled: PropTypes.bool,
};
