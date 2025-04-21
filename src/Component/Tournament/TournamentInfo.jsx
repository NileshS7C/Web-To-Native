import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

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

import { editRow, setFormOpen } from "../../redux/tournament/addTournament";
import {
  deleteUploadedImage,
  uploadImage,
} from "../../redux/Upload/uploadActions";
import {
  addTournamentStepOne,
  getAll_TO,
  getAllUniqueTags,
} from "../../redux/tournament/tournamentActions";
import { userLogout } from "../../redux/Authentication/authActions";
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

import { MdDeleteOutline } from "react-icons/md";

const requiredTournamentFields = (tournament) => {
  const {
    ownerUserId,
    tournamentId,
    tournamentName,
    preRequisites,
    tournamentLocation: {
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
    instagramHandle,
    whatToExpect,
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
    tournamentLocation: { address: updatedTournamentLocation },
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
    instagramHandle,
    whatToExpect,
  };
};

const initialValues = {
  step: 1,
  ownerUserId: "",
  tournamentId: "",
  tournamentName: "",
  tournamentLocation: {
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
  whatToExpect: [{ title: "", description: "" }],
};

export const TournamentInfo = ({ tournament, status, isDisable }) => {
  const validationSchema = yup.object({
    ownerUserId: yup.string().required("Name is required"),
    tournamentName: yup.string().required("Please provide a tournament name."),
    tournamentLocation: yup.object().shape({
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

          return bookingDate < newEndDate;
        }
      ),
    sponserName: yup.string(),
    instagramHandle: yup.string().nullable(),
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
  const [cookies] = useCookies(["name", "userRole"]);
  const [selectedTags, setSelectedTags] = useState([]);
  const isAddInThePath = window.location.pathname.includes("add");
  const { isGettingALLTO, err_IN_TO, tournamentOwners, isGettingTags, tags } =
    useSelector((state) => state.Tournament);

  const { singleTournamentOwner = {} } = useOwnerDetailsContext();

  const { userRole } = useSelector((state) => state.auth);

  const { isSuccess, isGettingTournament } = useSelector(
    (state) => state.GET_TOUR
  );
  const { userRole: role } = useSelector((state) => state.auth);

  const currentPage = 1;
  const limit = 100;

  useEffect(() => {
    const userRole = cookies?.userRole || role;
    if (!userRole) {
      dispatch(userLogout());
    }
    if (rolesWithTournamentOwnerAccess.includes(userRole)) {
      dispatch(getAll_TO({ currentPage, limit }));
    }
    dispatch(getAllUniqueTags());
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      let user;

      if (rolesWithTournamentOwnerAccess.includes(cookies?.userRole)) {
        user = tournamentOwners.owners?.find(
          (owner) => owner.name === values.ownerUserId
        );
      } else if (cookies?.userRole === "TOURNAMENT_OWNER") {
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
        addTournamentStepOne(updatedValues)
      ).unwrap();

      dispatch(
        showSuccess({
          message: tournamentId
            ? "Tournament updated successfully."
            : "Tournament added successfully.",
          onClose: "hideSuccess",
        })
      );

      if (!result.responseCode && isAddInThePath) {
        dispatch(setFormOpen("event"));
        navigate(`/tournaments/${result?.data?.tournament._id}/add`);
        resetForm();
      }
    } catch (error) {
      console.log(" error", error);

      dispatch(
        showError({
          message: error.data.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess && tournamentId && Object.keys(tournament).length > 0) {
      const updatedTournament = requiredTournamentFields(tournament);
      const owner =
        tournamentOwners?.owners?.find(
          (owner) => owner.id === updatedTournament.ownerUserId
        ) ?? null;

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
    >
      {({ isSubmitting, submitForm }) => {
        setSubmitForm(() => submitForm);
        setIsSubmitting(isSubmitting);
        return (
          <Form>
            <fieldset disabled={!isDisable}>
              <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323]">
                <ErrorModal />
                <SuccessModal />
                <TournamentBasicInfo
                  userName={cookies?.name || ""}
                  userRole={cookies?.userRole || userRole}
                  tournamentOwners={tournamentOwners}
                  isGettingALLTO={isGettingALLTO}
                  hasError={err_IN_TO}
                />
                <TournamentMetaData
                  isGettingTags={isGettingTags}
                  uniqueTags={tags}
                  selectedTags={selectedTags}
                  tournamentId={tournamentId}
                />
                <TournamentAddress location={location} />
                <TournamentDescription isDisable={isDisable} />
                <TournamentPrerequisite isDisable={isDisable} />
                <TournamentInstagramHandle isDisable={isDisable} />
                <TournamentWhatToExpect isDisable={isDisable} />
                <TournamentDates />
                <TournamentFileUpload
                  dispatch={dispatch}
                  isDisable={isDisable}
                  tournamentId={tournamentId}
                />
                <TournamentSponserTable isDisable={isDisable} />
                <TournamentBookingDates />
                <TournamentGallery dispatch={dispatch} tournamentId={tournamentId}/>
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
  tournamentId
}) => {
  const { setFieldError, values, setFieldValue } = useFormikContext();
  const { singleTournamentOwner } = useSelector((state) => state.GET_TOUR);
  useEffect(() => {
    if (hasError) {
      setFieldError("ownerUserId", "Error in getting the owners.");
    } else {
      setFieldError("ownerUserId", "");
    }
  }, [hasError, tournamentOwners]);

  useEffect(() => {
    if (userName && userRole === "TOURNAMENT_OWNER") {
      setFieldValue("ownerUserId", userName);
    }
  }, [userName]);

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      {!rolesWithTournamentOwnerAccess.includes(userRole) ? (
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-base leading-[19.36px]" htmlFor="ownerUserId">
            Tournament Organizer Name
          </label>
          <Field
            placeholder="Organizer Name"
            id="ownerUserId"
            name="ownerUserId"
            disabled
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ singleTournamentOwner?.name } 
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
    <div className="grid grid-cols-2 gap-[30px] w-full">
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
        />
        <ErrorMessage
          name="tournamentLocation.address.location.coordinates"
          component={TextError}
        />
      </div>
    </div>
  );
};
const TournamentAddress = ({ location }) => {
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
        Tournament Address
      </p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.line1"
          >
            Line 1
          </label>
          <Field
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
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.city"
          >
            City
          </label>
          <Field
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
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="tournamentLocation.address.postalCode"
          >
            Pincode
          </label>
          <Field
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

const TournamentDescription = ({ isDisable }) => {
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
        readOnly={!isDisable}
      />
      ;
    </div>
  );
};

const TournamentPrerequisite = ({ isDisable }) => {
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
        readOnly={!isDisable}
      />
      ;
    </div>
  );
};

const TournamentInstagramHandle = ({ isDisable }) => {
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
      />
      <ErrorMessage name="instagramHandle" component={TextError} />
    </div>
  );
};

const TournamentWhatToExpect = ({ isDisable }) => {
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
        {isDisable && (
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add New
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full border-collapse rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Description</th>
              {isDisable && <th className="border p-2 text-center">Actions</th>}
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
                    disabled={!isDisable}
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
                    disabled={!isDisable}
                  />
                  <ErrorMessage
                    name={`whatToExpect.${index}.description`}
                    component={TextError}
                  />
                </td>
                {isDisable && (
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

const TournamentFileUpload = ({ dispatch, isDisable,tournamentId }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <DesktopBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        isDisable={isDisable}
        tournamentId={tournamentId}
      />
      <MobileBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        isDisable={isDisable}
        tournamentId={tournamentId}
      />
    </div>
  );
};

const DesktopBannerImageUpload = ({
  values,
  setFieldValue,
  setFieldError,
  dispatch,
  isDisable,
  tournamentId
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previews, setPreviews] = useState([]);

  const tournamentEditMode = useSelector((state) => state.GET_TOUR.tournamentEditMode);
  const isDisabled=tournamentId ? !tournamentEditMode : false;
  useEffect(() => {
    const previewImages = values?.bannerDesktopImages?.length
      ? [{ preview: values.bannerDesktopImages }]
      : [];

    setPreviews(previewImages);
  }, [values?.bannerDesktopImages]);

  const handleRemoveImageDesk = (value) => {
    dispatch(deleteUploadedImage(value[0]));
    setPreviews([]);
    setIsError(false);
    setErrorMessage("");
  };

  const handleFileUploadDesk = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError(
        "bannerDesktopImages",
        "File should be a valid image type."
      );
      setErrorMessage("File should be a valid image type.");
      return;
    }

    const maxSize = venueImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerDesktopImages", "File should be less than 5 MB");
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
                 if(!isDisabled){
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
                    if(!isDisabled){
                      handleFileUploadDesk(e);
                    }
                   }
                  }
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                  multiple={false}
                  disabled={!isDisable}
                />
              )}
            </Field>
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
  isDisable,
  tournamentId
}) => {
  const tournamentEditMode = useSelector((state) => state.GET_TOUR.tournamentEditMode);
  const isDisabled = tournamentId ? !tournamentEditMode : false;
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const previewImages = values?.bannerMobileImages?.length
      ? [{ preview: values.bannerMobileImages }]
      : [];

    setPreviews(previewImages);
  }, [values?.bannerMobileImages]);

  const handleRemoveImageDesk = (value) => {
    dispatch(deleteUploadedImage(value[0]));
    setPreviews([]);
    setIsError(false);
    setErrorMessage("");
  };

  const handleFileUploadMob = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("bannerMobileImages", "File should be a valid image type.");
      setErrorMessage("File should be a valid image type.");
      return;
    }

    const maxSize = venueImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerMobileImages", "File should be less than 5 MB");
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
                  if(!isDisabled){
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
                    if(!isDisabled){
                      handleFileUploadMob(e);
                    }
                  }}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                  disabled={!isDisable}
                />
              )}
            </Field>
          </>
        )}
      </div>
      <ErrorMessage name="bannerMobileImages" component={TextError} />
    </div>
  );
};

const TournamentSponserTable = ({ isDisable }) => {
  const dispatch = useDispatch();
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorImage, setSponsorImage] = useState("");
  const { setFieldError } = useFormikContext();
  const { editRowIndex } = useSelector((state) => state.Tournament);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (e) => {
    setIsError(false);

    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("sponserImage", "File should be a valid image type.");
      setErrorMessage("File should be a valid image type.");
      return;
    }

    const maxSize = venueImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("sponserImage", "File should be less than 5 MB");
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      const url = result.data.url;
      setSponsorImage(url);
      setErrorMessage(result?.message);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("sponsors.sponserImage", err.data.message);
    }
  };

  return (
    <FieldArray name="sponsors">
      {({ push, remove, form }) => (
        <div className="grid grid-cols-1  gap-2.5">
          <p className="text-base text-[#232323] justify-self-start">
            Sponsors
          </p>
          <table className="border-[1px] border-[#EAECF0] rounded-[8px] table-auto">
            <thead>
              <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b-[1px] h-[44px] ">
                <th className="text-left p-2">S.No.</th>
                <th className="text-left p-2">Sponsor Logo</th>
                <th className="text-left p-2">Sponser Name</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {form.values.sponsors.length > 0 &&
                form.values.sponsors.map((row, index) => (
                  <tr
                    className="text-sm text-[#667085] "
                    key={`sponsors.${index}.sponserImage`}
                  >
                    <td className="text-left p-2">{index + 1}</td>
                    <td className=" text-left p-2">
                      <div className=" flex relative ">
                        <div className="block text-center">
                          <img
                            src={row.sponsorImage || imageUpload}
                            alt="sponsor logo"
                            className="w-8 h-8 "
                          />
                          <p className="text-[11px] text-[#353535]">
                            (Image Size: 200x200)
                          </p>
                        </div>
                        <Field name={`sponsors.${index}.sponserImage`}>
                          {({ form, field }) => (
                            <input
                              {...field}
                              id={`sponsors.${index}.sponserImage`}
                              name={`sponsors.${index}.sponserImage`}
                              onChange={(e) => {
                                const files = e.target.files[0];
                                const url = window.URL.createObjectURL(files);
                                form.setFieldValue(
                                  `sponsors.${index}.sponsorImage`,
                                  url
                                );
                              }}
                              value=""
                              type="file"
                              className="absolute  w-8 h-8  inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                              multiple={false}
                              disabled={!isDisable}
                            />
                          )}
                        </Field>
                      </div>
                    </td>
                    <td className="text-left p-2">
                      <Field name={`sponsors.${index}.sponsorName`}>
                        {({ form, field }) => {
                          return (
                            <input
                              {...field}
                              id={`sponsors.${index}.sponsorName`}
                              name={`sponsors.${index}.sponsorName`}
                              placeholder="Enter Sponsor Name"
                              className="w-[80%] px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={editRowIndex !== index}
                              readOnly={editRowIndex !== index}
                            />
                          );
                        }}
                      </Field>
                    </td>
                    <td className="text-left p-2">
                      {isDisable && (
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

              <tr
                className="text-sm text-[#667085] "
                key="sponsors.sponserImage"
              >
                <td className="text-left p-2">
                  {form.values.sponsors.length + 1}
                </td>
                <td className=" text-left p-2">
                  <div className=" flex relative ">
                    <div className="block text-center">
                      <img
                        src={sponsorImage || imageUpload}
                        alt="sponsor logo"
                        className="w-8 h-8 "
                      />
                      <p className="text-[11px] text-[#353535]">
                        (Image Size: 200x200)
                      </p>
                    </div>
                    <input
                      id="sponserImage"
                      name="sponserImage"
                      // onChange={(e) => {
                      //   const files = e.target.files[0];
                      //   const url = window.URL.createObjectURL(files);
                      //   setSponsorImage(url);
                      // }}
                      onChange={(e) => handleFileUpload(e)}
                      value=""
                      type="file"
                      className="absolute  w-8 h-8  inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                      multiple={false}
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
                  />
                </td>

                <td>
                  <Button
                    className="w-[60px] h-[40px] rounded-[8px] text-white"
                    type="button"
                    onClick={() => {
                      push({ sponsorImage, sponsorName });
                      setSponsorImage("");
                      setSponsorName("");
                    }}
                    disabled={!sponsorName || !sponsorImage}
                  >
                    ADD
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </FieldArray>
  );
};

const TournamentDates = () => {
  const [showStartDate, setShowStartDate] = useState(false);
  const toggleDates = () => {
    setShowStartDate(true);
  };
  return (
    <div className="grid grid-cols-2 gap-[30px]">
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

const TournamentBookingDates = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
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

const TournamentGallery = ({ dispatch ,tournamentId}) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  const tournamentEditMode = useSelector((state) => state.GET_TOUR.tournamentEditMode);
  const isDisabled = tournamentId ? !tournamentEditMode : false;
  useEffect(() => {
    const previewImages = values?.tournamentGallery?.length
      ? values.tournamentGallery.map((url) => ({
          preview: url,
        }))
      : [];
    setPreviews(previewImages);
  }, [values?.tournamentGallery]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("tournamentGallery", "File should be a valid image type.");
      return;
    }

    if (values.tournamentGallery.length === 4) {
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
      setFieldError("tournamentGallery", "File should be less than 5 MB");
      return;
    }
    try {
      const result = await dispatch(uploadImage(uploadedFile)).unwrap();
      setPreviews((prev) => [...prev, { preview: result?.data?.url }]);
      const url = result?.data?.url;
      setFieldValue("tournamentGallery", [...values.tournamentGallery, url]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("tournamentGallery", err.data.message);
    }
  };
  return (
    <div className="flex flex-col items-start gap-2.5 ">
      <p className="text-base leading-[19.36px] text-[#232323]">
        Tournament Gallery
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] min-h-[133px]">
        <div className="flex flex-wrap gap-2.5 min-h-[133px] w-full overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`tournamentGallery-${index}`}
            >
              <img
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded h-full w-[223px]"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    if(!isDisabled){
                      handleRemoveImage(index);
                    }
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

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <p className="text-xs text-[#353535] mt-1">(Image size: 600x600)</p>

            <FieldArray name="tournamentGallery">
              {({ form, field, meta }) => (
                <input
                  {...field}
                  id="tournamentGallery"
                  name="tournamentGallery"
                  onChange={(e) => {
                    if(!isDisabled){
                      handleFileUpload(e);
                    }
                  }}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                />
              )}
            </FieldArray>
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
};

TournamentBasicInfo.propTypes = {
  userRole: PropTypes.string,
  userName: PropTypes.string,
  tournamentOwners: PropTypes.array,
  isGettingALLTO: PropTypes.bool,
  hasError: PropTypes.bool,
};

TournamentMetaData.propTypes = {
  isGettingTags: PropTypes.bool,
  uniqueTags: PropTypes.array,
  selectedTags: PropTypes.array,
};

TournamentFileUpload.propTypes = {
  dispatch: PropTypes.func,
  isDisable: PropTypes.bool,
};

DesktopBannerImageUpload.propTypes = {
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldError: PropTypes.func,
  dispatch: PropTypes.func,
  isDisable: PropTypes.bool,
};

MobileBannerImageUpload.propTypes = {
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldError: PropTypes.func,
  dispatch: PropTypes.func,
  isDisable: PropTypes.bool,
};
TournamentAddress.propTypes = {
  location: PropTypes.array,
};

TournamentSponserTable.propTypes = {
  isDisable: PropTypes.bool,
};
TournamentWhatToExpect.propTypes = {
  isDisable: PropTypes.bool,
};
