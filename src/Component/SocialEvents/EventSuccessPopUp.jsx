import PropTypes from "prop-types";
import { SuccessPopUp } from "../../Assests";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export const EventSuccessPopUp = ({ open }) => {
  const handleClose = () => {};
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative h-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-lg  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col items-center justify-center bg-customColor rounded-[15px]">
              <img
                src={SuccessPopUp}
                alt="SucessIcon"
                className="w-[113px] h-[113px]"
              />
              <p className="font-normal text-base text-customColor leading-[19.36px]">
                Add New Event Request Submitted Successfully !!
              </p>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

EventSuccessPopUp.propTypes = {
  open: PropTypes.bool,
};
