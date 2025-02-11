import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import Button from "../Common/Button";
import {
  confirmSubmission,
  setIsConfirmed,
  setRejectionComments,
} from "../../redux/tournament/addTournament";

export const ConfirmationModalTour = ({
  isOpen,
  isLoading,
  message,
  setIsOpen,
  withComments = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      setShowModal(isOpen);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal((prev) => !prev);
    setIsOpen(false);
    dispatch(setIsConfirmed(false));
  }, []);

  const handleConfirm = () => {
    dispatch(confirmSubmission());
  };

  if (!isOpen) return null;

  return (
    <Dialog open={showModal} onClose={handleClose} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative h-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-lg  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-center">
                <div className="flex flex-col items-center justify-between gap-2.5">
                  <h1 className="text-blue-500 text-xl font-semibold">
                    SUBMIT TOURNAMENT FORM
                  </h1>
                  <p className="text-sm text-[#343C6A] align-middle">
                    {message}
                  </p>
                </div>
                {withComments && (
                  <div className="flex flex-col gap-2.5 w-full">
                    <label htmlFor="comment" className="text-sm text-[#343C6A]">
                      Rejection Comments
                    </label>
                    <input
                      name="comment"
                      id="comment"
                      className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        dispatch(setRejectionComments(e?.target?.value));
                      }}
                    />
                  </div>
                )}
                <div className="flex gap-10">
                  <Button
                    type="button"
                    className="w-[150px] h-[50px] rounded-lg border-[1px] border-blue-400 bg-white text-blue-600 shadow-lg hover:bg-blue-400"
                    onClick={handleClose}
                    disable={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="w-[150px] h-[50px] rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-500"
                    onClick={handleConfirm}
                    isLoading={isLoading}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

ConfirmationModalTour.propTypes = {
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  withComments: PropTypes.bool,
  setIsOpen: PropTypes.func,
};
