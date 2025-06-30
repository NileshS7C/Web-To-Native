import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Button from "../Common/Button";

export const ConfirmationModalEvent = ({
  isOpen,
  isLoading,
  message,
  setIsOpen,
  onConfirm,
  withComments = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(isOpen);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal((prev) => !prev);
    setIsOpen(false);
  }, [setIsOpen]);

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={showModal} onClose={handleClose} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative h-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-lg  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="flex flex-col items-center justify-center gap-5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-900">
                    Confirm Submission
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 md:gap-10">
                <Button
                  type="button"
                  className="w-[120px] md:w-[150px] h-[50px] rounded-lg border-[1px] border-blue-400 bg-white text-blue-600 shadow-lg hover:bg-blue-400"
                  onClick={handleClose}
                  disable={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="w-[120px] md:w-[150px] h-[50px] rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-500"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

ConfirmationModalEvent.propTypes = {
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  withComments: PropTypes.bool,
  setIsOpen: PropTypes.func,
  onConfirm: PropTypes.func,
};
