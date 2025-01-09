import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { locationIcon } from "../../Assests";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "../Common/ImageCarousel";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import Tabs from "../Common/Tabs";
import { venueTabs as initialVenueTabs } from "../../Constant/venue";
import { CourtListing } from "./CourtListing";
import { cleanPublishState, onPageChange } from "../../redux/Venue/getVenues";
import Button from "../Common/Button";
import { getSingleVenue, publishVenue } from "../../redux/Venue/venueActions";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { showSuccess } from "../../redux/Success/successSlice";
import { showError } from "../../redux/Error/errorSlice";
import { SuccessModal } from "../Common/SuccessModal";
import Spinner from "../Common/Spinner";

export default function VenueDescription() {
  const [venueTabs, setVenueTabs] = useState(initialVenueTabs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    isPublished,
    isPublishing,
    isErrorInPublish,
    publishedErrorMessage,
    isLoading,
    isSuccess,
    venue,
  } = useSelector((state) => state.getVenues);
  const handleTabChange = (value) => {
    const updatedTabs = venueTabs.map((tab) => ({
      ...tab,
      current: tab.name === value,
    }));
    setVenueTabs(updatedTabs);
  };

  useEffect(() => {
    if (id) {
      dispatch(getSingleVenue(id));
    }
  }, [id]);

  dispatch(cleanPublishState());
  useEffect(() => {
    if (isPublished) {
      dispatch(
        showSuccess({
          message: "Venue published successfully",
          onClose: "hideSuccess",
        })
      );

      navigate("/venues");
    } else if (isErrorInPublish) {
      dispatch(
        showError({
          message: publishedErrorMessage || "Something went wrong!",
          onClose: "hideError",
        })
      );
      dispatch(cleanPublishState());
    }
  }, [isPublished, isErrorInPublish]);

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
      {venueTabs.find((venue) => venue.name === "Overview").current ? (
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] p-[50px] rounded-3xl">
          <button
            className="w-[200px] h-[80px] bg-orange-400 hover:bg-slate-300 shadow-lg "
            onClick={() => {
              dispatch(publishVenue(id));
            }}
            loading={isPublishing}
            disabled={venue?.status === "PUBLISHED"}
          >
            {venue?.status !== "PUBLISHED"
              ? "Publish Venue"
              : "Venue Published"}
          </button>
          {isPublished && <SuccessModal />}
          <div className="mb-5">
            <Slider images={venue.bannerImages || []} />
          </div>

          <Address address={venue.address || {}} />
          <Description description={venue.description || ""} />
          <div className="grid grid-cols-3 justify-start">
            <VenueAvailableDays days={venue.availableDays || []} />
            <OpeningTime
              openingTime={venue.availableDays || []}
              allDaysSelected={venue.allDaysSelected || ""}
              globalTime={venue.globalOpeningTime || ""}
            />
            <ClosingTime
              closingTime={venue.availableDays || []}
              allDaysSelected={venue.allDaysSelected || ""}
              globalTime={venue.globalClosingTime || ""}
            />
          </div>

          <Amenities amenities={venue.amenities || []} />
          <Equipments equipment={venue.equipments || []} />
          <LayoutImages images={venue.layoutImages || []} />
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
      <h3 className="text-xs text-[#667085]">About Venue</h3>
      <textarea
        id="about-venue"
        className="w-full h-[250px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={description}
      >
        {description}
      </textarea>
    </div>
  );
};
const fixedDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const VenueAvailableDays = ({ days }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-xs text-[#667085]">Available Days</p>
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

const OpeningTime = ({ openingTime, allDaysSelected, globalTime }) => {
  let openingTiming;
  if (allDaysSelected) {
    openingTiming = globalTime;
  } else {
    openingTiming = openingTime.length > 0 ? openingTime[0].openingTime : "";
  }
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs text-[#667085]">Opening Time</h3>
      <p>{openingTiming}</p>
    </div>
  );
};

const ClosingTime = ({ closingTime, allDaysSelected, globalTime }) => {
  let closingTiming;
  if (allDaysSelected) {
    closingTiming = globalTime;
  } else {
    closingTiming = closingTime?.length > 0 ? closingTime[0].closingTime : "";
  }
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs text-[#667085]">Closing Time</h3>
      <p>{closingTiming}</p>
    </div>
  );
};

const Amenities = ({ amenities }) => {
  return (
    <div className="flex flex-col gap-2.5 items-start">
      <p className="text-xs text-[#667085]">Amenities</p>
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
      <p className="text-xs text-[#667085]">Amenities</p>
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
            <img
              src={image.url}
              alt={image?.caption || index}
              width="500px"
              height="500px"
              className="object-cover rounded-lg "
            />
          </div>
        );
      })}
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
