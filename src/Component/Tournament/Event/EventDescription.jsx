import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSingleCategory } from "../../../redux/tournament/tournamentActions";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../Common/Spinner";
import ErrorBanner from "../../Common/ErrorBanner";
import { locationIcon } from "../../../Assests";

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
    <div className="grid grid-cols-3 bg-[#FFFFFF] rounded-[20px] p-[40px]">
      <EventNameAndDate
        name={category?.categoryName}
        format={category?.format}
        maxPlayer={category?.maxPlayer}
      />
      <EventFormatAndCategory
        date={category?.categoryStartDate}
        category={category?.type}
        minPlayer={category?.minPlayer}
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
  return (
    <div className="flex flex-col items-start gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-md ">Event Name</p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {name}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">
          Event Format
        </p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {format}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">Max Players</p>
        <p className="text-customColor font-semibold text-md @lg:text-sm ">
          {maxPlayer || 0}
        </p>
      </div>
    </div>
  );
};

const EventFormatAndCategory = ({ date, category, minPlayer }) => {
  return (
    <div className="flex flex-col items-start gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">Date</p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {date}
        </p>
      </div>

      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">
          Event Category
        </p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {category}
        </p>
      </div>
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">Min Players</p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {minPlayer || 0}
        </p>
      </div>
    </div>
  );
};

const EventPlayers = ({ fee, skillLevel }) => {
  return (
    <div className="flex flex-col items-start gap-10">
      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color  text-md @lg:text-sm ">
          Registration Fee
        </p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {fee}
        </p>
      </div>

      <div className="flex flex-wrap flex-col items-start gap-2.5">
        <p className="text-tour_List_Color text-md @lg:text-sm ">Skill level</p>
        <p className="text-customColor font-semibold text-md @lg:text-sm">
          {skillLevel}
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

export default EventDescription;
