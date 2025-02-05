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
import { IoMdTrash } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

import { imageUpload, uploadIcon, calenderIcon } from "../../Assests";
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
import { ROLES } from "../../Constant/app";
import Spinner from "../Common/Spinner";
import Button from "../Common/Button";
import TextError from "../Error/formError";
import Combopopover from "../Common/Combobox";
import { rolesWithTournamentOwnerAccess } from "../../Constant/tournament";

const requiredTournamentFields = (tournament) => {
  const {
    ownerUserId,
    tournamentId,
    tournamentName,
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
  } = tournament;

  const updatedTournamentLocation = {
    ...restOfAddress,
    location: locationWithOutExact,
  };

  return {
    ownerUserId,
    tournamentId,
    tournamentName,
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
          console.log("value", value);
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
      .required("Booking end date is required.")
      .test(
        "valid-booking-start-date",
        "Booking start Date must be greater than tournament start date.",
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
        "End date must be equal to or after the start date"
      )
      .test(
        "valid-booking-end-date",
        "Booking end Date must be greater than tournament start date",
        function (value) {
          const { startDate, endDate } = this.parent;
          const newStartDate = new Date(startDate).getTime();
          const newEndDate = new Date(endDate).getTime();
          const bookingDate = new Date(value).getTime();

          return bookingDate < newEndDate;
        }
      ),
    sponserName: yup.string(),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [initialState, setInitialState] = useState(initialValues);
  const { location } = useSelector((state) => state.location);
  const [cookies] = useCookies(["name", "userRole"]);
  const [selectedTags, setSelectedTags] = useState([]);
  const isAddInThePath = window.location.pathname.includes("add");
  const { isGettingALLTO, err_IN_TO, tournamentOwners, isGettingTags, tags } =
    useSelector((state) => state.Tournament);

  const { userRole } = useSelector((state) => state.auth);

  const { isSuccess, isGettingTournament } = useSelector(
    (state) => state.GET_TOUR
  );

  const currentPage = 1;
  const limit = 100;
  useEffect(() => {
    dispatch(getAll_TO({ currentPage, limit }));
    dispatch(getAllUniqueTags());
  }, []);

  useEffect(() => {
    const userRole = cookies?.userRole;
    if (!userRole) {
      dispatch(userLogout());
    }
  }, [tournamentOwners]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const user = tournamentOwners.owners?.find(
        (owner) => owner.id === values.ownerUserId
      );

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
      }

      resetForm();
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
      {({ isSubmitting }) => (
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
              />
              <TournamentAddress location={location} />
              <TournamentDescription isDisable={isDisable} />
              <TournamentDates />
              <TournamentFileUpload dispatch={dispatch} isDisable={isDisable} />
              <TournamentSponserTable isDisable={isDisable} />
              <TournamentBookingDates />
              <Button
                className="w-[200px] h-[60px] bg-[#1570EF] text-white ml-auto rounded-[8px]"
                type="submit"
                loading={isSubmitting}
                disabled={tournamentId && !isDisable}
              >
                Save and Continue
              </Button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

const TournamentBasicInfo = ({
  userName,
  userRole,
  tournamentOwners,
  isGettingALLTO,
  hasError,
}) => {
  const { setFieldError } = useFormikContext();
  useEffect(() => {
    if (hasError) {
      setFieldError("ownerUserId", "Error in getting the owners.");
    } else {
      setFieldError("ownerUserId", "");
    }
  }, [hasError, tournamentOwners]);

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
            value={userName}
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
            // onChange={(e) => {
            //   if (tournamentOwners.owners?.length > 0) {
            //     const selectedOwner = tournamentOwners.owners.find(
            //       (owner) => owner.name === e.target.value
            //     );
            //     if (selectedOwner) {
            //       setFieldValue("ownerUserId", selectedOwner.id);
            //     }
            //   }
            // }}
          >
            <option>Select Tournament Owner</option>
            {!isGettingALLTO && tournamentOwners?.owners?.length > 0
              ? tournamentOwners.owners.map((owner, index) => {
                  return (
                    <option key={owner.name} value={owner.id}>
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

const TournamentMetaData = ({ isGettingTags, uniqueTags, selectedTags }) => {
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
        isGettingTags={false}
        uniqueTags={[]}
        setFieldValue={setFieldValue}
        checkedTags={selectedTags}
        placeholder="Enter Tournament Tags"
        label="Tournament Tags"
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

const TournamentFileUpload = ({ dispatch, isDisable }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <DesktopBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        isDisable={isDisable}
      />
      <MobileBannerImageUpload
        values={values}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        dispatch={dispatch}
        isDisable={isDisable}
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
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previews, setPreviews] = useState([]);

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

    const maxSize = 1000 * 1024;
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerDesktopImages", "File should be less than 1 MB");
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
                  handleRemoveImageDesk(previews[0]?.preview);
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

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 1MB)</p>
            <Field name="bannerDesktopImages">
              {({ field }) => (
                <input
                  {...field}
                  id="bannerDesktopImages"
                  name="bannerDesktopImages"
                  onChange={(e) => handleFileUploadDesk(e)}
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
}) => {
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

    const maxSize = 1000 * 1024;
    if (uploadedFile.size > maxSize) {
      setFieldError("bannerMobileImages", "File should be less than 1 MB");
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
                  handleRemoveImageDesk(previews[0]?.preview);
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
            <Field name="bannerMobileImages">
              {({ field }) => (
                <input
                  {...field}
                  id="bannerMobileImages"
                  name="bannerMobileImages"
                  onChange={(e) => handleFileUploadMob(e)}
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

    const maxSize = 1000 * 1024;
    if (uploadedFile.size > maxSize) {
      setFieldError("sponserImage", "File should be less than 1 MB");
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
            Sponsers
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
                        <img
                          src={row.sponsorImage || imageUpload}
                          alt="sponsor logo"
                          className="w-8 h-8 "
                        />
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
                    <img
                      src={sponsorImage || imageUpload}
                      alt="sponsor logo"
                      className="w-8 h-8 "
                    />

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
          Booking Start Date
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
          Booking End Date
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
