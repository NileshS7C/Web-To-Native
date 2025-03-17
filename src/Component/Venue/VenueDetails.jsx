import PropTypes from "prop-types";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { showSuccess } from "../../redux/Success/successSlice";
import { showError } from "../../redux/Error/errorSlice";

import { locationIcon } from "../../Assests";

import { Slider } from "../Common/ImageCarousel";
import Tabs from "../Common/Tabs";
import { venueTabs as initialVenueTabs, fixedDays } from "../../Constant/venue";
import { CourtListing } from "./CourtListing";
import {
  onPageChange,
  setPublish,
  checkVenue,
} from "../../redux/Venue/getVenues";
import Button from "../Common/Button";
import { getSingleVenue, publishVenue } from "../../redux/Venue/venueActions";

import { SuccessModal } from "../Common/SuccessModal";
import Spinner from "../Common/Spinner";
import {
  showConfirmation,
  onCofirm,
  onCancel,
} from "../../redux/Confirmation/confirmationSlice";
import { ConfirmationModal } from "../Common/ConfirmationModal";
import { ErrorModal } from "../Common/ErrorModal";
import AlertBanner from "../Common/AlertBanner";
import { setTabs } from "../../redux/Venue/addVenue";

export default function VenueDescription() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const [venueTabs, setVenueTabs] = useState(initialVenueTabs);

  const { isOpen, message, isConfirmed, type, confirmationId } = useSelector(
    (state) => state.confirm
  );
  const {
    venue,
    venueWithNoCourt,
    isPublished,
    isPublishing,
    isErrorInPublish,
    publishedErrorMessage,
    isLoading,
  } = useSelector((state) => state.getVenues);

  const handleTabChange = (value) => {
    const updatedTabs = venueTabs.map((tab) => ({
      ...tab,
      current: tab.name === value,
    }));
    setVenueTabs(updatedTabs);
  };

  useEffect(() => {
    dispatch(setPublish());
    if (id) {
      dispatch(getSingleVenue(id));
    }
  }, [id]);

  useEffect(() => {
    if (isConfirmed && type === "Venue" && !confirmationId) {
      dispatch(publishVenue(id));
      dispatch(onCancel());
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isErrorInPublish) {
      dispatch(
        showError({
          message: publishedErrorMessage || "Something went wrong!",
          onClose: "hideError",
        })
      );
    }
    dispatch(onCancel());
  }, [isErrorInPublish, publishedErrorMessage]);

  useEffect(() => {
    if (isPublished) {
      dispatch(getSingleVenue(id));
      dispatch(
        showSuccess({
          message: "Venue published successfully",
          onClose: "hideSuccess",
        })
      );
    }
  }, [isPublished]);

  useEffect(() => {
    if (venue.name) {
      const isVenueWithNoCourt = !venue.courts.length;
      dispatch(checkVenue(isVenueWithNoCourt));
    }
  }, [venue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="py-[15px] px-[20px] bg-[#FFFFFF] rounded-lg">
        <Tabs options={venueTabs} onChange={handleTabChange} />
      </div>
      {venueWithNoCourt && (
        <AlertBanner description="You Will Need to Add Courts to publish this venue." />
      )}
      <SuccessModal />
      <ErrorModal />
      <ConfirmationModal
        isOpen={isOpen}
        isLoading={isPublishing}
        onConfirm={onCofirm}
        onCancel={onCancel}
        message={message}
      />
      {venueTabs.find((venue) => venue.name === "Overview").current ? (
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] p-[50px]">
          <div className="mb-5">
            <Slider images={venue.bannerImages || []} />
          </div>

          <Address address={venue?.address || {}} />
          <Description description={venue?.description || ""} />

          <VenueAvailability
            days={venue?.availableDays || []}
            allDaysSelected={venue?.allDaysSelected || ""}
            globalClosingTime={venue?.globalClosingTime || ""}
            globalOpeningTime={venue?.globalOpeningTime || ""}
          />

          <Amenities amenities={venue?.amenities || []} />
          <Equipments equipment={venue?.equipments || []} />
          <LayoutImages images={venue?.layoutImages || []} />
        </div>
      ) : (
        <CourtListing
          courts={venue.courts}
          currentPage={1}
          totalVenues={1}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

const Address = ({ address }) => {
  const venueAddress = `${address?.line1 || ""}, ${address?.line2 || ""}, ${
    address?.city || ""
  }, ${address?.state || ""}, ${address?.postalCode || ""}`;

  const googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(
    venueAddress
  )}`;
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-sm font-medium">
        {address.line1} | {address.line2}
      </p>
      <div className="flex gap-2">
        <img
          src={locationIcon}
          alt="view location"
          width="24px"
          height="24px"
        />
        <p className="text-sm text-[#101828]">
          <span>{address?.line1 || ""}</span>
          {","}
          <span>{address?.line2 || ""}</span>
          {","}
          <span>{address?.city || ""}</span>
          {","}
          <span>{address?.state || ""}</span>
          {","}
          <span>{address?.postalCode || ""}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <img
          src={locationIcon}
          alt="view location"
          width="24px"
          height="24px"
        />
        <p className="text-sm text-[#718EBF] cursor-pointer">
          {" "}
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View Location
          </a>
        </p>
      </div>
    </div>
  );
};

const Description = ({ description }) => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <h3 className="text-sm text-[#667085]">About Venue</h3>
      <div
        id="about-venue"
        className="text-left overflow-auto w-full h-[250px]  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

const VenueAvailability = ({
  days,
  allDaysSelected,
  globalClosingTime,
  globalOpeningTime,
}) => {
  const updatedDays = [...days].slice(1);

  return (
    <>
      {!allDaysSelected ? (
        <div>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="py-3.5 text-left text-sm font-semibold text-[#667085] ">
                  Day
                </th>
                <th className="py-3.5 text-left text-sm font-semibold text-[#667085] ">
                  Opening Time
                </th>
                <th className="py-3.5 text-left text-sm font-semibold text-[#667085] ">
                  Closing Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {updatedDays.map((data, index) => {
                const {
                  day = "",
                  openingTime = "",
                  closingTime = "",
                  active,
                } = data;
                return (
                  <tr key={`${day}`}>
                    <td className="text-left" scope="row">
                      {fixedDays[index]}
                    </td>
                    <td className="text-left">{active && openingTime}</td>
                    <td className="text-left">{active && closingTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 justify-start">
          <VenueAvailableDays days={days} />
          <OpeningTime
            availableDays={days}
            globalTime={globalOpeningTime || ""}
          />
          <ClosingTime
            availableDays={days || []}
            globalTime={globalClosingTime || ""}
          />
        </div>
      )}
    </>
  );
};
const VenueAvailableDays = ({ days }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-sm text-[#667085]">Available Days</p>
      <div className="flex gap-2.5 flex-wrap">
        {fixedDays.map((day) => {
          return (
            <div
              key={`${day}`}
              className={
                days.map((item) => item === day)
                  ? "text-[#101828]"
                  : "text-[#667085]"
              }
            >
              {day.slice(0, 3)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OpeningTime = ({ globalTime }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-sm text-[#667085]">Opening Time</h3>
      <p>{globalTime}</p>
    </div>
  );
};

const ClosingTime = ({ globalTime }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-sm text-[#667085]">Closing Time</h3>
      <p>{globalTime}</p>
    </div>
  );
};

const Amenities = ({ amenities }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-sm text-[#667085]">Amenities</p>
      <div className="flex gap-10 flex-wrap">
        {amenities.map((item) => {
          return (
            <ul key={`${item}`} className="list-disc pl-5">
              <li>{item}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

const Equipments = ({ equipment }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-sm text-[#667085]">Amenities</p>
      <div className="flex gap-10 flex-wrap">
        {equipment.map((item) => {
          return (
            <ul key={`${item}`} className="list-disc pl-4">
              <li> {item}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

const LayoutImages = ({ images }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-sm text-[#667085]">Venue Layout</p>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((image, index) => {
          return (
            <div key={`${image.url}`} className="group relative">
              {/* <ArrowsPointingOutIcon
              width="30px"
              height="30px"
              color="white"
              className="absolute right-0 top-1 transform transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-[-4px]"
            /> */}

              <a href={image?.url} target="_blank">
                <img
                  src={image?.url}
                  alt={image?.caption || index}
                  width="320px"
                  height="320px"
                  className="object-cover rounded-lg "
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

VenueAvailableDays.propTypes = {
  days: PropTypes.array,
};

OpeningTime.propTypes = {
  openingTime: PropTypes.string,
};
Amenities.propTypes = {
  amenities: PropTypes.array,
};
Equipments.propTypes = {
  equipment: PropTypes.array,
};
LayoutImages.propTypes = {
  images: PropTypes.array,
};
