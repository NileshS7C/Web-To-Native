import { useSelector } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FaGreaterThan } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

export const MatchModal = ({ isOpen, onCancel, tournament }) => {
  const { showConfirmBookingModal, category } = useSelector(
    (state) => state.event
  );

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[70%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-center">
                <MatchModalTitle
                  tournamentName={tournament?.tournamentName}
                  eventName={category?.categoryName}
                />
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const MatchModalTitle = ({ tournamentName, eventName }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-3">
        <p className="text-lg text-[#343C6A] font-semibold">{tournamentName}</p>
        <FaGreaterThan color="#343C6A" className="w-[24px] h-[24px]" />
        <p className="text-lg text-[#343C6A] font-semibold">{eventName}</p>
      </div>
      <IoCloseSharp className="w-[24px] h-[24px] shadow-md" />
    </div>
  );
};

const MatchRound = ({ round = 1 }) => {
  return (
    <div className="bg-[#343C6A]">
      <p className="text-white text-sm font-semibold">
        Round <span>{round}</span>
      </p>
    </div>
  );
};
