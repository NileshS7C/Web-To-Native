import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { hideError } from "../../redux/Error/errorSlice";
import { useEffect } from "react";
export const ErrorModal = () => {
  const dispatch = useDispatch();
  const { isOpen, message, onClose } = useSelector((state) => state.error);

  const handleClose = () => {
    if (onClose) {
      dispatch(hideError());
    }
  };

  useEffect(() => {
    return () => {
      dispatch(hideError());
    };
  }, [dispatch]);

  if (!isOpen) return null;
  return (
    <Dialog open={true} onClose={handleClose} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 max-h-[90vh] overflow-y-auto data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-lg  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-center">
                <div className="flex gap-2.5">
                  <ExclamationCircleIcon
                    color="red"
                    width="24px"
                    height="24px"
                  />
                  <p className="text-sm text-red-600 align-middle">{message}</p>
                </div>
                <Button
                  type="button"
                  className="w-20 h-10 rounded-md text-black bg-white shadow-lg hover:bg-slate-200 active:bg-slate-200"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
