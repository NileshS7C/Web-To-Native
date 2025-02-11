import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Form, ErrorMessage, Field, useFormikContext } from "formik";

import { createTournamentOwner } from "../../redux/tournament/tournamentOrganiserActions";
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

import {
  TournamentOragniserModalTitle,
  rowsInOnePage,
} from "../../Constant/app";

export const TournamentOrganiserCreation = ({
  dispatch,
  owner,
  isOpen,
  initialValues,
  location,
  validationSchema,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      setHasError(false);
      setErrorMessage("");
      const result = await dispatch(createTournamentOwner(values)).unwrap();
      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Tournament Organiser created successfully.",
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[40%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col justify-between flex-1 items-center gap-3 w-full ">
              <OrganiserModalTitle
                onCancel={() => dispatch(toggleOrganiserModal())}
              />

              {hasError && <ErrorBanner message={errorMessage} />}
              <Formik
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
        <p className="text-lg text-[#343C6A] font-semibold">
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

const BrandEmailAndPhone = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] w-full">
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
          placeholder="Enter Venue Name"
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
};
