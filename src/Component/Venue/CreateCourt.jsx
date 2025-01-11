import { Formik, Form, ErrorMessage, Field, useFormikContext } from "formik";
import * as yup from "yup";
import TextError from "../Error/formError";
import { useDispatch, useSelector } from "react-redux";
import { uploadIcon } from "../../Assests";
import { BiX } from "react-icons/bi";
import { removeFiles, updateFiles } from "../../redux/tournament/addTournament";
import Button from "../Common/Button";
import { courtFeatures } from "../../Constant/venue";
import {
  createCourt,
  getCourt,
  updateCourt,
} from "../../redux/Venue/venueActions";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorModal } from "../Common/ErrorModal";
import { cleanUpError, showError } from "../../redux/Error/errorSlice";
import {
  cleanUpSuccess,
  hideSuccess,
  showSuccess,
} from "../../redux/Success/successSlice";
import { SuccessModal } from "../Common/SuccessModal";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { uploadImage } from "../../redux/Upload/uploadActions";
import Spinner from "../Common/Spinner";
import { resetCourtState, setCourtName } from "../../redux/Venue/addCourt";
import { courtImageSize } from "../../Constant/app";

const requiredVenueFields = (court) => {
  const {
    courtName,
    courtNumber,
    features,
    desktopBannerImages,
    mobileBannerImages,
    price,
  } = court;

  return {
    courtName,
    courtNumber,
    features,
    desktopBannerImages,
    mobileBannerImages,
    price,
  };
};

//  .of(
//       yup.object({
//         url: yup
//           .mixed()
//           .nullable()
//           .required("Desktop banner image is required.")
//           .test("file-size", "Desktop banner image is too large", (value) => {

//             if (!value) return true;

//             // Check file size: 100 KB max
//             return value?.length <= 100 * 1024; // 100 KB
//           })
//           .test(
//             "file-type",
//             "Desktop banner image should be of valid image type",
//             (value) => {
//               if (!value.length) return true;
//               return (
//                 value &&
//                 ["image/jpeg", "image/png", "image/gif"].includes(value?.type)
//               );
//             }
//           ),
//       })
//     )
//     .nullable(),

const validationSchema = yup.object().shape({
  courtName: yup
    .string()
    .required()
    .min(3, "Name must be at least 3 characters long.")
    .max(50, "Name cannot exceed 50 characters."),

  courtNumber: yup
    .number()
    .required()
    .min(1, "Court Number should be greater than 0"),
  features: yup.array().min(1, "At least feature should be selected"),
  price: yup.number().required().min(1, "Price should be greater than 1"),

  desktopBannerImages: yup.array().min(1, "Desktop banner image is required."),

  mobileBannerImages: yup.array().min(1, "Mobile banner image is required."),
});

const initialValues = {
  courtName: "",
  courtNumber: 1,
  features: [],
  price: 1,
  desktopBannerImages: [],
  mobileBannerImages: [],
};

export const CourtCreation = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, isGettingCourt, court, isSuccess } = useSelector(
    (state) => state.addCourt
  );
  const [initialState, setInitialState] = useState(initialValues);
  const isAddCourtPathName = window.location.pathname.includes("add-court");
  const isEditCourtPathName = window.location.pathname.includes("edit-court");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    try {
      !isAddCourtPathName
        ? await dispatch(createCourt({ formData: values, id: id })).unwrap()
        : await dispatch(updateCourt({ formData: values, id: id })).unwrap();
      resetForm();
      dispatch(
        showSuccess({
          message: isAddCourtPathName
            ? "Court updated successfully"
            : "Court added successfully",
          onClose: "hideSuccess",
        })
      );
      setInitialState(initialValues);
      setTimeout(() => {
        navigate("/venues");
        dispatch(hideSuccess());
      }, 2000);
    } catch (err) {
      dispatch(
        showError({
          message: err.data.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    } finally {
      dispatch(resetCourtState());
    }
  };

  useEffect(() => {
    if (id && isEditCourtPathName) {
      dispatch(getCourt(id));
    }
  }, [id, isEditCourtPathName]);

  useEffect(() => {
    if (court && id && isSuccess && isEditCourtPathName) {
      const courtData = requiredVenueFields(court);
      setInitialState({ ...initialState, ...courtData });
      dispatch(setCourtName(courtData.courtName));
    }
  }, [court, id, isEditCourtPathName]);

  if (isGettingCourt) {
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
          <CourtDetails />
          <CourtFileUpload dispatch={dispatch} />
          <CourtFeatures />
          <CourtPrice />
          <ErrorModal />
          <SuccessModal />
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

const CourtDetails = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] ">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="courtName"
        >
          CourtName
        </label>
        <Field
          placeholder="Enter Court Name"
          id="courtName"
          name="courtName"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="courtName" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="courtNumber"
        >
          Court No.
        </label>
        <Field
          placeholder="Enter Court Number"
          id="courtNumber"
          name="courtNumber"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
        />
        <ErrorMessage name="courtNumber" component={TextError} />
      </div>
    </div>
  );
};

const CourtFileUpload = ({ dispatch }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (values?.desktopBannerImages?.length) {
      setPreviews(
        values.desktopBannerImages.map((image) => ({ preview: image.url }))
      );
    } else {
      setPreviews([]);
    }
  }, [values.desktopBannerImages]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemoveImageDesk = () => {
    setPreviews([]);
  };
  const handleFileUploadDesk = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError(
        "desktopBannerImages",
        "File should be a valid image type."
      );
      dispatch(
        showError({
          message: "File should be a valid image type.",
          onClose: "hideError",
        })
      );
      return;
    }

    const maxSize = courtImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("desktopBannerImages", "File should be less than 500 KB");
      dispatch(
        showError({
          message: "File should be less than 500 KB.",
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
      setFieldValue("desktopBannerImages", [
        ...values.desktopBannerImages,
        { url },
      ]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("desktopBannerImages", err.data.message);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className=" relative flex flex-col items-start gap-2.5 ">
        <label className="text-xs text-[#232323]" htmlFor="desktopBannerImages">
          Banner Image (Desktop)
        </label>
        <div className="relative flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
          {previews[0]?.preview && (
            <>
              <img
                src={previews[0]?.preview || ""}
                className="absolute inset-0 object-scale-down rounded h-full w-full z-100"
              />
              {previews[0]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 top-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    handleRemoveImageDesk();
                  }}
                />
              )}
            </>
          )}{" "}
          {!previews[0]?.preview && (
            <>
              <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

              <p className="text-sm text-[#5B8DFF]">
                Click to upload{" "}
                <span className="text-sm text-[#353535] ">
                  {" "}
                  or drag and drop
                </span>
              </p>

              <p className="text-xs text-[#353535] mt-1">
                (Max. File size: 5MB)
              </p>

              <Field name="desktopBannerImages">
                {({ form, field, meta }) => (
                  <input
                    {...field}
                    id="desktopBannerImages"
                    name="desktopBannerImages"
                    onChange={(e) => handleFileUploadDesk(e)}
                    value=""
                    type="file"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                    multiple={false}
                    accept="image/jpeg, image/png,image/gif"
                  />
                )}
              </Field>
            </>
          )}
        </div>

        <ErrorMessage name="desktopBannerImages" component={TextError} />
      </div>

      <MobileBannerImage dispatch={dispatch} />

      {isError && <TextError>{errorMessage}</TextError>}
    </div>
  );
};

const MobileBannerImage = ({ dispatch }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (values?.mobileBannerImages?.length) {
      setPreviews(
        values.mobileBannerImages.map((image) => ({ preview: image.url }))
      );
    } else {
      setPreviews([]);
    }
  }, [values.mobileBannerImages]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemoveImageMob = () => {
    setPreviews([]);
  };
  const handleFileUploadMob = async (e) => {
    setIsError(false);
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      setFieldError("mobileBannerImages", "File should be a valid image type.");
      dispatch(
        showError({
          message: "File should be a valid image type.",
          onClose: "hideError",
        })
      );
      return;
    }

    const maxSize = courtImageSize;
    if (uploadedFile.size > maxSize) {
      setFieldError("mobileBannerImages", "File should be less than 500 KB");
      dispatch(
        showError({
          message: "File should be less than 500 KB",
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
      setFieldValue("mobileBannerImages", [
        ...values.desktopBannerImages,
        { url },
      ]);
    } catch (err) {
      setErrorMessage(err.data?.message);
      setIsError(true);
      setFieldError("mobileBannerImages", err.data.message);
    }
  };
  return (
    <div className="relative flex flex-col items-start gap-2.5 ">
      <label className="text-xs text-[#232323]" htmlFor="mobileBannerImages">
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
              <IoIosCloseCircleOutline
                className="absolute right-0 top-0 w-6 h-6 z-100 text-black  cursor-pointer "
                onClick={() => {
                  handleRemoveImageMob();
                }}
              />
            )}
          </>
        )}

        {!previews[0]?.preview && (
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <Field name="mobileBannerImages">
              {({ form, field }) => (
                <input
                  {...field}
                  id="mobileBannerImages"
                  name="mobileBannerImages"
                  onChange={(e) => handleFileUploadMob(e)}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                  accept="image/jpeg, image/png,image/gif"
                />
              )}
            </Field>
          </div>
        )}
      </div>

      {isError && <TextError>{errorMessage}</TextError>}
      <ErrorMessage name="mobileBannerImages" component={TextError} />
    </div>
  );
};

const CourtFeatures = () => {
  const { form, values } = useFormikContext();

  return (
    <div className="flex justify-between">
      {courtFeatures.map((feature) => (
        <label
          key={feature}
          className="flex items-center gap-2 text-[15px] leading-[18.15px] text-[#232323]"
          htmlFor="features"
        >
          <Field
            type="checkbox"
            name="features"
            id="features"
            value={feature}
            checked={values.features.includes(feature)}
            className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
          />
          {feature}
        </label>
      ))}
    </div>
  );
};

const CourtPrice = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label
        className=" text-[#232323] text-base leading-[19.36px]"
        htmlFor="price"
      >
        Rate (Per Hour)
      </label>
      <Field
        placeholder="Enter court price"
        id="price"
        name="price"
        className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
      />
      <ErrorMessage name="price" component={TextError} />
    </div>
  );
};
