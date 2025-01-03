import { useState } from "react";
import PropTypes from "prop-types";
import { locationIcon } from "../../Assests";
import { useSelector } from "react-redux";
import { Slider } from "../Common/ImageCarousel";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import Tabs from "../Common/Tabs";
import { venueTabs as initialVenueTabs } from "../../Constant/venue";
import { CourtListing } from "./CourtListing";
import { onPageChange } from "../../redux/Venue/getVenues";

export default function VenueDescription() {
  const { venue } = useSelector((state) => state.getVenues);
  const [venueTabs, setVenueTabs] = useState(initialVenueTabs);
  const handleTabChange = (value) => {
    const updatedTabs = venueTabs.map((tab) => ({
      ...tab,
      current: tab.name === value,
    }));
    setVenueTabs(updatedTabs);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="py-[15px] px-[20px] bg-[#FFFFFF] rounded-lg">
        <Tabs options={venueTabs} onChange={handleTabChange} />
      </div>
      {venueTabs.find((venue) => venue.name === "Overview").current ? (
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] p-[50px] rounded-3xl">
          <div className="mb-5">
            <Slider images={venue.bannerImages || []} />
          </div>

          <Address address={venue.address || {}} />
          <Description description={venue.description || ""} />
          <div className="grid grid-cols-3 justify-start">
            <VenueAvailableDays days={venue.availableDays || []} />
            <OpeningTime openingTime={venue.openingTime || ""} />
            <ClosingTime closingTime={venue.closingTime || ""} />
          </div>

          <Amenities amenities={venue.amenities || []} />
          <Equipments equipment={venue.equipments || []} />
          <LayoutImages />
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
          PlayAll Badminton Arena, Sector 73, Near Noida Pet Clinic, Noida
        </p>
      </div>

      <div className="flex gap-2">
        <img
          src={locationIcon}
          alt="view location"
          width="24px"
          height="24px"
        />
        <p className="text-sm text-[#718EBF]">View Location</p>
      </div>
    </div>
  );
};

const Description = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <h3 className="text-xs text-[#667085]">About Venue</h3>
      <textarea
        id="about-venue"
        className="w-full h-[250px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      >
        PlayAll Sports Complex was constructed to host 9th Asian Games held in
        year 1982 and later upgraded with latest state of art facilities for
        hosting Commonwealth Games-2010. The stadium is being maintained &
        utilized by SAI on behalf of Ministry of Sports and Youth Affairs,
        Government of India, as part of legacy to promote & develop sports
        activities and to implement plans and schemes for the promotion of
        sports . This situated in New Delhi is one of the most famous and
        popular stadiums in India. It has been a witness to several important
        sports events. This sports stadium that has hosted some major sports
        events was established in 1982 by the government of India. This stadium
        contains a wide range of stadiums that are required to hold various
        events including soccer and several others.
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
                days.includes(day) ? "text-[#101828]" : "text-[#667085]"
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

const OpeningTime = ({ openingTime }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs text-[#667085]">Opening Time</h3>
      <p>{openingTime}</p>
    </div>
  );
};

const ClosingTime = ({ closingTime }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs text-[#667085]">Closing Time</h3>
      <p>{closingTime}</p>
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
const images = [
  {
    url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Beautiful Sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Mountain View",
  },
  {
    url: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Calm Beach",
  },
  {
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Forest Path",
  },
  {
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Starry Night",
  },
];
const LayoutImages = () => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {images.map((image) => {
        return (
          <div key={`${image.url}`} className="group relative">
            <ArrowsPointingOutIcon
              width="30px"
              height="30px"
              color="white"
              className="absolute right-0 top-1 transform transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-[-4px]"
            />
            <img
              src={image.url}
              alt={image.caption}
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
