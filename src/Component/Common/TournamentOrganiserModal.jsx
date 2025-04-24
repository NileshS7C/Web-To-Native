import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Form, ErrorMessage, Field, useFormikContext } from "formik";

import {
  createTournamentOwner,
  updateTournamentOwner,
} from "../../redux/tournament/tournamentOrganiserActions";
import { resetGlobalLocation } from "../../redux/Location/locationSlice";
import { toggleOrganiserModal } from "../../redux/tournament/tournamentOrganiserSlice";
import { showSuccess } from "../../redux/Success/successSlice";
import { getAll_TO } from "../../redux/tournament/tournamentActions";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";

import TextError from "../Error/formError";
import Button from "./Button";
import ErrorBanner from "./ErrorBanner";
import LocationSearchInput from "./LocationSearch";
import Spinner from "./Spinner";

import {
  TournamentOragniserModalTitle,
  passRegex,
  rowsInOnePage,
} from "../../Constant/app";

export const TournamentOrganiserCreation = ({
  dispatch,
  owner,
  isOpen,
  initialValues,
  location,
  validationSchema,
  organiserId,
  actionPending,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      setHasError(false);
      setErrorMessage("");
      let updadatedValues;

      if (organiserId) {
        const { password } = values;
        if (password) {
          const isValid = passRegex.test(password);
          if (!isValid) {
            return setFieldError(
              "password",
              "Password must have at least 8 characters, including uppercase, lowercase, a number, and a special character."
            );
          }
          updadatedValues = values;
        } else {
          const { password, ...restOfValues } = values;
          updadatedValues = restOfValues;
        }
      }
      const result = !organiserId
        ? await dispatch(createTournamentOwner(values)).unwrap()
        : await dispatch(
          updateTournamentOwner({
            formData: updadatedValues,
            ownerId: organiserId,
          })
        ).unwrap();
      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: !organiserId
              ? "Tournament Organiser created successfully."
              : "Tournament Organiser updated successfully.",
            onClose: "hideSuccess",
          })
        );
        dispatch(
          getAll_TO({
            currentPage: searchParams.get("page") || 1,
            limit: rowsInOnePage,
          })
        );

        dispatch(toggleOrganiserModal());
      }
    } catch (err) {
      console.log(
        " Error occured while creating the tournament organiser",
        err
      );

      setErrorMessage(
        err.data.message ||
        "Oops! some thing went wrong while creating the organiser. Please try again."
      );

      setHasError(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHasError(false);
      setErrorMessage("");
      dispatch(resetGlobalLocation());
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(toggleOrganiserModal())}
      className="relative z-10 "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative max-h-[90vh] transform overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[40%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex w-full">
              {actionPending && (
                <div className="flex items-center justify-center h-full w-full">
                  <Spinner />
                </div>
              )}
              {!actionPending && (
                <div className="flex flex-col justify-between flex-1 items-between gap-3 w-full ">
                  <OrganiserModalTitle
                    onCancel={() => dispatch(toggleOrganiserModal())}
                  />

                  {hasError && <ErrorBanner message={errorMessage} />}
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="flex flex-col justify-between w-full gap-4 flex-1">
                          <OrganiserBasicDetails />
                          <OrganiserPhoneAndPassword />
                          <BrandEmailAndPhone />
                          <BrandPhoneAndLocation />
                          <OrganiserAddress location={location} />

                          <Button
                            className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                            type="submit"
                            loading={isSubmitting}
                          >
                            Save
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export const OrganiserModalTitle = ({ onCancel }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-3">
        <p className="text-lg text-[#343C6A] font-semibold pb-6">
          {TournamentOragniserModalTitle}
        </p>
      </div>
      <IoCloseSharp
        className="w-[24px] h-[24px] shadow-md cursor-pointer"
        onClick={onCancel}
      />
    </div>
  );
};

const OrganiserBasicDetails = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="name"
        >
          Name
        </label>
        <Field
          placeholder="Enter Organiser Name"
          id="name"
          name="name"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5 w-full">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="email"
        >
          Email
        </label>

        <Field
          placeholder="Enter Organiser Email"
          id="email"
          name="email"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="email" component={TextError} />
      </div>
    </div>
  );
};

const OrganiserPhoneAndPassword = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="phone"
        >
          Phone
        </label>
        <Field
          placeholder="Enter Organiser Phone"
          id="phone"
          name="phone"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="phone" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5 w-full flex-wrap">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="password"
        >
          Password
        </label>

        <Field
          placeholder="Enter Organiser Password"
          id="password"
          name="password"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="password" component={TextError} />
      </div>
    </div>
  );
};

const BrandEmailAndPhone = () => {  const { setFieldValue, values } = useFormikContext();
  const [brandImage, setBrandImage] = useState(null);
  const [brandImageUrl, setBrandImageUrl] = useState(values?.ownerDetails?.brandLogoImage || "");

  useEffect(() => {
    if (values?.ownerDetails?.brandLogoImage && typeof values.ownerDetails.brandLogoImage === 'string') {
      setBrandImageUrl(values.ownerDetails.brandLogoImage);
      setBrandImage(null);
    } else if (values?.ownerDetails?.brandLogoImage instanceof File) {

      if (!brandImageUrl || !brandImageUrl.startsWith('blob:')) {
         const localUrl = URL.createObjectURL(values.ownerDetails.brandLogoImage);
         setBrandImageUrl(localUrl);
         setBrandImage(values.ownerDetails.brandLogoImage);
       }
    } else {
      if (brandImageUrl) {
         if (brandImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(brandImageUrl);
         }
         setBrandImageUrl("");
      }
      setBrandImage(null);
    }

    const currentUrl = brandImageUrl;
    return () => {
      if (currentUrl && currentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [values?.ownerDetails?.brandLogoImage, brandImageUrl]);


  const handleBrandImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (brandImageUrl && brandImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(brandImageUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setBrandImage(file);
    setBrandImageUrl(localUrl);
    setFieldValue("ownerDetails.brandLogoImage", file);
  };

  const handleDeleteImage = () => {
    if (brandImageUrl && brandImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(brandImageUrl);
    }
    setBrandImage(null);
    setBrandImageUrl("");
    setFieldValue("ownerDetails.brandLogoImage", null);

    const fileInput = document.getElementById("brandImageInput");
    if (fileInput) {
      fileInput.value = ""; // Reset the input value
    }
  };


  // Clean up object URL on unmount - Handled in the main useEffect now
  // useEffect(() => { ... }); // This separate cleanup useEffect can be removed or kept if preferred


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className=" text-[#232323] text-base leading-[19.36px]"
            htmlFor="ownerDetails.brandName"
          >
            Brand Name
          </label>
          <Field
            placeholder="Enter Organiser Brand Name"
            id="ownerDetails.brandName"
            name="ownerDetails.brandName"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="ownerDetails.brandName" component={TextError} />
        </div>
        <div className="flex flex-col items-start gap-2.5 w-full">
          <label
            className=" text-[#232323] text-base leading-[19.36px]"
            htmlFor="ownerDetails.brandEmail"
          >
            Brand Email
          </label>
          <Field
            placeholder="Enter Organiser Brand Email"
            id="ownerDetails.brandEmail"
            name="ownerDetails.brandEmail"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[6vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="ownerDetails.brandEmail" component={TextError} />
        </div>
      </div>


      <div className="flex flex-col items-start gap-2.5 w-full mt-4">
        <label className="text-[#232323] text-base leading-[19.36px] mb-2" htmlFor="brandImageInput"> {/* Changed htmlFor */}
          Brand Image
        </label>
        <div className="flex flex-col w-full gap-4">
          {/* Removed the separate image preview div */}
          <div
            className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#B2B2B2] rounded-lg p-4 w-full cursor-pointer bg-[#FAFAFA] min-h-[120px] overflow-hidden" // Added relative and overflow-hidden
            onClick={() => !brandImageUrl && document.getElementById("brandImageInput").click()} // Prevent opening file dialog if image exists
          >
            {brandImageUrl ? (
              <>
                <img
                  src={brandImageUrl} // Use the state variable for the source
                  alt="Brand Preview"
                  className="w-full h-full object-contain max-h-[200px]" // Adjusted styling for containment
                />
                <button
                  type="button" // Prevent form submission
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the container's onClick
                      handleDeleteImage();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Delete image"
                >
                  <IoCloseSharp className="w-4 h-4" /> {/* Use the close icon */}
                </button>
              </>
            ) : (
              // Content to show when no image is selected
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#F4F4F4] rounded-full p-2 mb-2">
                  <svg width="24" height="24" fill="none" stroke="#1570EF" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="4" y="16" width="16" height="4" rx="2" fill="#F4F4F4" stroke="#B2B2B2" />
                  </svg>
                </div>
                <span className="text-[#1570EF] font-medium cursor-pointer">
                  Click to upload
                </span>
                <span className="text-[#8C8C8C] text-xs mt-1">(Max. File size: 5MB)</span>
                <span className="text-[#8C8C8C] text-xs">(Image Size: 800x400)</span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="brandImageInput" // Changed id to avoid conflict with label's htmlFor if it was 'brandImage'
            accept="image/*"
            onChange={handleBrandImageChange}
            className="hidden"
          />
          {/* Add Formik error message for the image field if needed */}
          <ErrorMessage name="ownerDetails.brandLogoImage" component={TextError} />
        </div>
      </div>
    </>
  );
};

const BrandPhoneAndLocation = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="ownerDetails.brandPhone"
        >
          Brand Phone
        </label>
        <Field
          placeholder="Enter Brand Phone"
          id="ownerDetails.brandPhone"
          name="ownerDetails.brandPhone"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="ownerDetails.brandPhone" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5 w-full">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="ownerDetails.address.location"
        >
          Google Map
        </label>

        <LocationSearchInput
          id="ownerDetails.address.location"
          name="ownerDetails.address.location"
        />
        <ErrorMessage
          name="ownerDetails.address.location.coordinates"
          component={TextError}
        />
      </div>
    </div>
  );
};

const OrganiserAddress = ({ location }) => {
  const { setFieldValue } = useFormikContext();
  useEffect(() => {
    if (location.city || location.state) {
      setFieldValue(
        "ownerDetails.address.location.coordinates[0]",
        location?.lng
      );
      setFieldValue(
        "ownerDetails.address.location.coordinates[1]",
        location?.lat
      );
      setFieldValue("ownerDetails.address.line1", location?.address_line1);
      setFieldValue("ownerDetails.address.line2", location.address_line2);
      setFieldValue("ownerDetails.address.city", location.city);
      setFieldValue("ownerDetails.address.state", location.state);
      setFieldValue("ownerDetails.address.postalCode", location.pin_code);
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
      <p className=" text-base leading-[19.36px] text-[#232323]">Address</p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="ownerDetails.address.line1"
          >
            Line 1
          </label>
          <Field
            placeholder="Enter Line 1 Address"
            id="ownerDetails.address.line1"
            name="ownerDetails.address.line1"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="ownerDetails.address.line1"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="ownerDetails.address.line2"
          >
            Line 2
          </label>
          <Field
            placeholder="Enter Line 2 Address"
            id="ownerDetails.address.line2"
            name="ownerDetails.address.line2"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="ownerDetails.address.line2"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="ownerDetails.address.city"
          >
            City
          </label>
          <Field
            placeholder="Enter City "
            id="ownerDetails.address.city"
            name="ownerDetails.address.city"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="ownerDetails.address.city"
            component={TextError}
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="ownerDetails.address.state"
          >
            State
          </label>
          <Field
            placeholder="Enter State"
            id="ownerDetails.address.state"
            name="ownerDetails.address.state"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="ownerDetails.address.state"
            component={TextError}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="ownerDetails.address.postalCode"
          >
            Pincode
          </label>
          <Field
            placeholder="Enter PostalCode"
            id="ownerDetails.address.postalCode"
            name="ownerDetails.address.postalCode"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="ownerDetails.address.postalCode"
            component={TextError}
          />
        </div>
      </div>
    </div>
  );
};

OrganiserAddress.propTypes = {
  location: PropTypes.object,
};

OrganiserModalTitle.propTypes = {
  onCancel: PropTypes.func,
};

TournamentOrganiserCreation.propTypes = {
  owner: PropTypes.object,
  dispatch: PropTypes.func,
  isOpen: PropTypes.bool,
  initialValues: PropTypes.object,
  location: PropTypes.object,
  validationSchema: PropTypes.object,
  organiserId: PropTypes.string,
  actionPending: PropTypes.bool,
};
