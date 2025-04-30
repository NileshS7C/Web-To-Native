import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import PropTypes from "prop-types";

export const Modal = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative max-h-[90vh] transform overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-full max-w-xs sm:max-w-md lg:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col max-h-[80vh] ">
              <div className="flex justify-between items-center sticky top-0 bg-white py-2 z-10">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h2>
                <button onClick={onClose}>
                  <IoCloseCircleOutline className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
                {children}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
