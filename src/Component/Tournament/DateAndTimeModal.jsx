import { Dialog } from "@headlessui/react";
import React, { useState, useRef } from "react";
import * as yup from "yup";
import { Formik, Form, ErrorMessage, useFormikContext, Field } from "formik";
import { useUpdateDateAndTime } from "../../Hooks/fixtureHooks";
import { DialogPanel } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calenderIcon } from "../../Assests";
// import ErrorBanner from "../ErrorBanner";
import Button from "../Common/Button";
import ErrorBanner from "../Common/ErrorBanner";
import { formattedDate } from "../../utils/dateUtils";
import { getFixtureById } from "../../redux/tournament/fixturesActions";
import { useDispatch } from "react-redux";
const DateAndTimeModal = ({
  showModal,
  handleShowModal,
  fixtureId,
  tournamentId,
  categoryId,
}) => {
  const initialState = {
    date: "",
    startTime: "",
  };
  const dispatch = useDispatch();
  const modalContentRef = useRef(null);
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };

  const updateDateAndTimeMutation = useUpdateDateAndTime();
  const validationSchema = yup.object().shape({
    date: yup.string().required("Date is required"),
    startTime: yup.string().required("Start time is required"),
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      updateDateAndTimeMutation.mutate(
        {
          tournamentId,
          categoryId,
          fixtureId,
          data: {
            date: formattedDate(values.date),
            startTime: values.startTime,
          },
        },
        {
          onSuccess: () => {
            setHasError(false);
            handleShowModal();
            dispatch(
              getFixtureById({
                tour_Id: tournamentId,
                eventId: categoryId,
                fixtureId,
              })
            );
            setSubmitting(false);
          },
          onError: (error) => {
            setHasError(true);
            setErrorMessage(
              error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
            scrollToTop();
            setSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.message || "Something went wrong");
    }
  };
  return (
    <Dialog
      open={true}
      onClose={() => {
        handleShowModal();
      }}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-xl rounded bg-white p-6 w-full">
          <div className="relative">
            <div className=" overflow-y-auto px-3" ref={modalContentRef}>
              {hasError && <ErrorBanner message={errorMessage} />}
              <Formik
                enableReinitialize
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
                validateOnSubmit={true}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-[30px] mx-[10px]">
                      <p className="text-[18px] leading-[21.7px] font-[600] text-[#343C6A]">
                        Update Date & Time
                      </p>
                    </div>
                    <TimeAndDate />
                    <div className="mt-2">
                      <div className="flex gap-2 justify-end mb-4">
                        <Button
                          type="button"
                          className="py-2 px-5 rounded-[10px] shadow-md bg-white text-[14px] leading-[17px] text-[#232323]"
                          onClick={() => handleShowModal()}
                          disabled={isSubmitting}
                        >
                          Close
                        </Button>
                        <Button
                          className="py-2 px-5 rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF]"
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const TimeAndDate = () => {
  return (
    <div className="flex flex-col xs:flex-row justify-between mx-[10px] gap-4">
      <div className="flex flex-col items-start gap-1 sm:gap-2.5 w-full xs:w-1/2">
        <label className="text-base text-[#232323]" htmlFor="date">
          Date:
        </label>
        <div className="relative w-full">
          <Field name="date">
            {({ field, form }) => (
              <>
                <DatePicker
                  id="date"
                  name="date"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => form.setFieldValue("date", date)}
                  className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  popperPlacement="bottom-start"
                  popperClassName="z-[100]"
                  withPortal
                  minDate={new Date()}
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
          <ErrorMessage
            name="date"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-2.5 w-full xs:w-1/2">
        <label className="text-base text-[#232323]" htmlFor="startTime">
          Start Time:
        </label>
        <Field
          type="time"
          name="startTime"
          id="startTime"
          className="w-full border border-gray-300 p-2 rounded-[10px]"
        />
        <ErrorMessage
          name="startTime"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    </div>
  );
};

export default DateAndTimeModal;
