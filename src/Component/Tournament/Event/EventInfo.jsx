import { searchIcon } from "../../../Assests";
import Button from "../../Common/Button";
import { EventTable } from "./EventTable";
import { stepReducer } from "../../../redux/tournament/addTournament";
import { toggleModal } from "../../../redux/tournament/eventSlice";
import { useDispatch, useSelector } from "react-redux";

function EventInfo() {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((state) => state.Tournament);

  return (
    <div className="grid grid-cols-1 gap-[50px]">
      <div className="flex items-center">
        <p className="text-[18px] font-[500] text-[#232323] justify-self-start leading-[28px]">
          Events
        </p>
        <div className="flex ml-auto gap-[10px]">
          <SearchEvents />
        </div>
      </div>
      <EventTable />

      <Button
        className="text-[15px] text-[#FFFFFF] bg-[#1570EF] w-[190px] h-[50px] rounded-[10px] leading-[18.15px] ml-auto"
        onClick={() => dispatch(toggleModal())}
      >
        Add New Event
      </Button>
      <Button
        className="text-[18px] text-[#FFFFFF] bg-[#1570EF] w-[190px] h-[50px] rounded-[10px] leading-[21.5px] ml-auto"
        onClick={() => dispatch(stepReducer(currentStep))}
      >
        Next
      </Button>
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

export default EventInfo;
