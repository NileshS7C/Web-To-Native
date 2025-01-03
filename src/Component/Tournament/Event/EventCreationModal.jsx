import { useDispatch, useSelector } from "react-redux";
import { crossIcon } from "../../../Assests";
import Button from "../../Common/Button";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { toggleModal } from "../../../redux/tournament/eventSlice";
import { tournamentEvent } from "../../../Constant/tournament";

const AddEventTitle = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between mb-[30px] mx-[20px]">
      <p className="text-[18px] leading-[21.7px] font-[600] text-[#343C6A]">
        Add New Event
      </p>
      <button onClick={() => dispatch(toggleModal())} className="shadow-sm ">
        <img src={crossIcon} alt="close" className="w-5 h-5" />
      </button>
    </div>
  );
};

const EventFormat = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323] " htmlFor="event_htmlFormat">
          Event Format
        </label>

        <select
          name="event_htmlFormat"
          id="event_htmlFormat"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tournamentEvent.format.map((format, index) => (
            <option
              key={`${format}`}
              value={index === 0 ? "select" : format.split(" ")[0]}
              className={index !== 0 ? "text-[#232323]" : ""}
            >
              {format}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="category">
          Event Category
        </label>
        <select className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="select">Select Event Format</option>
          <option value="single" className="text-[#232323]">
            Single Elimination
          </option>
          <option value="double" className="text-[#232323]">
            Double Elimination
          </option>
          <option value="round" className="text-[#232323]">
            Round Robbins
          </option>
        </select>
      </div>
    </div>
  );
};

const RegistrationFee = () => {
  return (
    <div className="grid grid-cols-1 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323] ">Registration Fees</label>
        <input
          placeholder="Enter Registration Fees"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const SelectPlayers = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323] ">Max Players</label>
        <input
          placeholder="Max Players Count"
          className="w-full text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323] ">Min Players</label>
        <input
          placeholder="Enter Registration Fees"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const SelectSkillLevel = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label className="text-xs text-[#232323] " htmlFor="skill">
        Skill level
      </label>

      <select
        name="skill"
        id="skill"
        className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="select">Skill level</option>
        <option value="single" className="text-[#232323]">
          Beginner
        </option>
        <option value="double" className="text-[#232323]">
          Intermediate
        </option>
        <option value="round" className="text-[#232323]">
          Advance
        </option>
      </select>
    </div>
  );
};

const VenueSelection = () => {
  return (
    <div className="grid grid-cols-1 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <p className="text-xs text-[#232323] ">Venue Selection</p>
        <div className="flex gap-[50px] w-full">
          <div className="flex gap-[10px] items-center">
            <input
              type="radio"
              id="venue_final"
              name="venue"
              value=""
              className="appearance-none w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
            />
            <label
              htmlFor="venue"
              className="text-[15px] text-[#718EBF] leading-[18px]"
            >
              Venue is Finalized
            </label>
          </div>
          <div className="flex gap-[10px] items-center">
            <input
              type="radio"
              id="venue_NFinal"
              name="venue"
              value=""
              className="appearance-none w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
            />
            <label
              htmlFor="venue"
              className="text-[15px] text-[#718EBF] leading-[18px]"
            >
              To be Decided
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventTimings = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-[16px] leading-[19.3px] text-[#232323]">
          Date
        </label>
        <input
          placeholder="Select Date"
          type="date"
          className="w-full px-[19px] text-[14px] text-[#718EBF] leading-[20px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-[16px] leading-[19.3px] text-[#232323]">
            Select Time
          </label>
          <input
            placeholder="Select Date"
            type="time"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

const StaffMembers = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label className="text-xs text-[#232323] " htmlFor="skill">
        Staff Selection
      </label>

      <select
        name="skill"
        id="skill"
        className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="select">Select Staff Member</option>
        <option value="single" className="text-[#232323]">
          Beginner
        </option>
        <option value="double" className="text-[#232323]">
          Intermediate
        </option>
        <option value="round" className="text-[#232323]">
          Advance
        </option>
      </select>
    </div>
  );
};
export const EventCreationModal = () => {
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.event);

  return (
    <Dialog
      open={showModal}
      onClose={() => dispatch(toggleModal())}
      className="relative z-10 "
    >
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-lg  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="w-full bg-[#FFFFFF] px-[20px] ">
                <AddEventTitle />

                <div className="grid grid-col-1 gap-[20px]">
                  <EventFormat />
                  <RegistrationFee />
                  <SelectPlayers />
                  <SelectSkillLevel />
                  <VenueSelection />
                  <EventTimings />
                  <StaffMembers />
                  <div className="grid justify-self-end gap-[10px]">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-white text-[14px] leading-[17px] text-[#232323] ml-auto"
                        onClick={() => dispatch(toggleModal())}
                      >
                        Close
                      </Button>
                      <Button
                        className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                        type="button"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
