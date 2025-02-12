import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleCategory } from "../../../redux/tournament/tournamentActions";
import Spinner from "../../Common/Spinner";
import ErrorBanner from "../../Common/ErrorBanner";
import { locationIcon } from "../../../Assests";
import { tournamentEvent } from "../../../Constant/tournament";
import { MdCurrencyRupee } from "react-icons/md";

function EventDescription() {
  const dispatch = useDispatch();
  const params = useParams();
  const { tournamentId, eventId } = params;
  const { category, loadingSingleCategory, SingleCategoryError } = useSelector(
    (state) => state.event
  );

  useEffect(() => {
    if (eventId && tournamentId) {
      dispatch(getSingleCategory({ tour_Id: tournamentId, eventId: eventId }));
    }
  }, [eventId]);

  if (loadingSingleCategory) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (SingleCategoryError) {
    return (
      <ErrorBanner message="We're having trouble loading category information right now. Please try again later." />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-col-3 gap-10 items-start justify-center bg-[#FFFFFF] rounded-[20px] p-[20px] sm:p-[40px]">
      <EventNameAndDate
        name={category?.categoryName}
        format={category?.format}
        maxPlayer={category?.maxPlayers}
      />
      <EventFormatAndCategory
        date={category?.categoryStartDate}
        category={category?.type}
        minPlayer={category?.minPlayers}
      />

      <EventPlayers
        fee={category?.registrationFee}
        skillLevel={category?.skillLevel}
      />

      <EventLocationAndImage image="" address={category?.categoryLocation} />
    </div>
  );
}

const EventNameAndDate = ({ name, format, maxPlayer }) => {
  const eventFormatName = tournamentEvent.format.find(
    (item) => item.shortName === format
  );

  return (
    <div className="flex flex-col items-start flex-1 gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg ">
          Event Name
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg whitespace-nowrap">
          {name}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg ">
          Event Format
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {eventFormatName?.name ?? ""}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg">
          Max Players
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg ">
          {maxPlayer || ""}
        </p>
      </div>
    </div>
  );
};

const EventFormatAndCategory = ({ date, category, minPlayer }) => {
  const categoryName = tournamentEvent.category.find(
    (item) => item.shortName === category
  );
  return (
    <div className="flex flex-col items-start flex-1 gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg ">
          Date
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {date}
        </p>
      </div>

      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg whitespace-nowrap">
          Event Category
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {categoryName?.name ?? ""}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg ">
          Min Players
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {minPlayer || ""}
        </p>
      </div>
    </div>
  );
};

const EventPlayers = ({ fee, skillLevel }) => {
  return (
    <div className="flex flex-col items-start gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color  text-xs sm:text-sm md:text-md lg:text-lg whitespace-nowrap">
          Registration Fee (INR)
        </p>
        <p className="inline-flex items-center text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {fee && <MdCurrencyRupee />}
          {fee}
        </p>
      </div>

      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-xs sm:text-sm md:text-md lg:text-lg">
          Skill Level
        </p>
        <p className="text-customColor font-semibold text-xs sm:text-sm md:text-md lg:text-lg">
          {skillLevel?.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

const EventLocationAndImage = ({ image, address }) => {
  const venueAddress = `${address?.line1 || ""}, ${address?.line2 || ""}, ${
    address?.city || ""
  }, ${address?.state || ""}, ${address?.postalCode || ""}`;

  const googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(
    venueAddress
  )}`;

  const isLocationExist = address && !Object.keys(address).length;

  return (
    <>
      {isLocationExist && (
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
      )}
    </>
  );
};
EventNameAndDate.propTypes = {
  name: PropTypes.string,
  format: PropTypes.string,
  maxPlayer: PropTypes.number,
};

EventFormatAndCategory.propTypes = {
  date: PropTypes.string,
  category: PropTypes.string,
  minPlayer: PropTypes.number,
};

EventPlayers.propTypes = {
  fee: PropTypes.number,
  skillLevel: PropTypes.string,
};

EventLocationAndImage.propTypes = {
  image: PropTypes.string,
  address: PropTypes.object,
};

export default EventDescription;
