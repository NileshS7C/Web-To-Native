import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Button from "./Button";
import { resetConfirmationState } from "../../redux/Confirmation/confirmationSlice";

import { setRejectionComments } from "../../redux/tournament/addTournament";

export const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  message,
  withComments = false,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const handleClose = () => {
    dispatch(onCancel());
  };

  const handleConfirm = () => {
    dispatch(onConfirm());
  };

  useEffect(() => {
    dispatch(resetConfirmationState());
  }, [dispatch]);

  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-10 ">
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
              <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-center">
                <div className="flex gap-2.5">
                  <ExclamationCircleIcon
                    width="30px"
                    height="30px"
                    color="red"
                  />
                  <p className="text-sm text-[#343C6A] align-middle">
                    {message}
                  </p>
                </div>
                {withComments && (
                  <div className="flex flex-col gap-2.5 w-full">
                    <label htmlFor="comment" className="text-sm text-[#343C6A]">
                      Rejection Comments <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="comment"
                      id="comment"
                      className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setInputValue(e?.target?.value);
                        dispatch(setRejectionComments(e?.target?.value));
                      }}
                      required={true}
                    />
                  </div>
                )}
                <div className="flex gap-10">
                  <Button
                    type="button"
                    className="w-20 h-10 rounded-md bg-white text-black shadow-lg hover:bg-slate-300"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="w-20 h-10 rounded-md bg-red-600 text-white shadow-lg hover:bg-red-500"
                    onClick={handleConfirm}
                    loading={isLoading}
                    disabled={withComments && !inputValue}
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

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
  withComments: PropTypes.bool,
  message: PropTypes.string,
};
