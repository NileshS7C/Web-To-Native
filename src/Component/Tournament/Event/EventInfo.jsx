import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { stepReducer } from "../../../redux/tournament/addTournament";
import { toggleModal, resetAllCategories, resetCurrentPage } from "../../../redux/tournament/eventSlice";
import { searchIcon } from "../../../Assests";
import Button from "../../Common/Button";
import { EventTable } from "./EventTable";
import { useEffect, useState } from "react";
import { resetGlobalLocation } from "../../../redux/Location/locationSlice";
import { getAllCategories } from "../../../redux/tournament/tournamentActions";
import { useParams } from "react-router-dom";
import EventOrder from "./EventOrder";

function EventInfo({ disabled }) {

  const dispatch = useDispatch();
  const { currentStep } = useSelector((state) => state.Tournament);
  const { categories, currentPage } = useSelector((state) => state.event);
  const { tournamentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(resetAllCategories());
    dispatch(
      getAllCategories({
        currentPage,
        limit: 10,
        sort: "position",
        id: tournamentId,
      })
    );
  }, [currentPage, tournamentId]);

  useEffect(() => {
    dispatch(resetGlobalLocation());
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentPage());
    }
  }, [])

  const handleEventOrderModal = () => {
    setIsOpen(!isOpen);
  }

  const refetchCategories = () => {
    dispatch(
      getAllCategories({
        currentPage,
        limit: 10,
        sort: "position",
        id: tournamentId,
      })
    );
  };


  return (
    <div className="grid grid-cols-1 gap-[50px] pb-20">
      <div className="flex items-center">
        <div className="flex ml-auto gap-[10px] flex-wrap">
          {categories.length > 0 && (
            <Button
              className="text-[18px] text-[#FFFFFF] bg-[#1570EF] w-[190px] h-[50px] rounded-[10px] leading-[21.5px] ml-auto"
              onClick={() => dispatch(toggleModal())}
              disabled={disabled}
            >
              Add New Event
            </Button>
          )}
          {categories.length > 0 && (
            <Button
              className="text-[18px] text-[#FFFFFF] bg-[#1570EF] w-[190px] h-[50px] rounded-[10px] leading-[21.5px] ml-auto"
              onClick={handleEventOrderModal}
              disabled={disabled}
            >
              Change Event Order
            </Button>
          )}
        </div>
      </div>

      <EventTable isDisable={disabled} categories={categories} />

      <Button
        className="text-[18px] text-[#FFFFFF] bg-[#1570EF] w-[190px] h-[50px] rounded-[10px] leading-[21.5px] ml-auto"
        onClick={() => dispatch(stepReducer(currentStep))}
        disabled={disabled}
      >
        Save & Continue
      </Button>

      {isOpen && (
        <EventOrder
          tournamentId={tournamentId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onRefresh={refetchCategories}
        />
      )}
    </div>
  );
}

const SearchEvents = () => {
  return (
    <div className="relative ">
      <img
        src={searchIcon}
        alt="search events"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder="Events"
        className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

EventInfo.propTypes = {
  disabled: PropTypes.bool
};

export default EventInfo;
