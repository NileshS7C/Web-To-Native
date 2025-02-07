import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookingModal } from "../../../redux/tournament/eventSlice";
import { crossIcon } from "../../../Assests";
import * as yup from "yup";
import TextError from "../../Error/formError";
import { useParams, useSearchParams } from "react-router-dom";
import {
  createConfirmBooking,
  getAllBookings,
} from "../../../redux/tournament/tournamentActions";
import ErrorBanner from "../../Common/ErrorBanner";
import { bookingLimit } from "../../../Constant/tournament";

const AddUserModalTitle = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between mb-[30px]">
      <p className="text-[18px] leading-[21.7px] font-[600] text-[#343C6A]">
        Add New User
      </p>
      <button
        onClick={() => dispatch(toggleBookingModal())}
        className="shadow-sm "
      >
        <img src={crossIcon} alt="close" className="w-8 h-8" />
      </button>
    </div>
  );
};

const AddParticipants = () => {
  const initialValues = {
    name: "",
    phone: "",
    bookingItems: [
      {
        categoryId: "",
        partnerDetails: {
          name: "",
          phone: "",
        },
      },
    ],
  };
  const dispatch = useDispatch();
  const { eventId, tournamentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const [hasError, setHasError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { showConfirmBookingModal, category } = useSelector(
    (state) => state.event
  );
  const { bookingErrorMessage } = useSelector((state) => state.tourBookings);

  const [initialState, setInitialState] = useState(initialValues);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "User name should have at least 3 characters.")
      .max(50, "User name should not exceed more than 50 characters.")
      .required("Name is required."),
    phone: yup
      .string()
      .matches(
        /^[0-9]{10}$/,
        "Phone number must be exactly 10 digits and contain only numbers."
      )
      .required("Phone number is required."),
    bookingItems:
      isChecked &&
      yup.object().shape({
        partnerDetails: yup.object().shape({
          name: yup.string().required("Partner Name is required."),
          phone: yup
            .string()
            .matches(
              /^[0-9]{10}$/,
              "Phone number must be exactly 10 digits and contain only numbers."
            )
            .required("Partner Phone number is required."),
        }),
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      setHasError(false);
      let updatedValues;

      if (isChecked && initialState?.bookingItems?.length) {
        const updatedBookingItems = initialState?.bookingItems.map((item) => ({
          ...item,
          categoryId: eventId,
        }));
        updatedValues = {
          ...initialState,
          tournamentId,
          bookingItems: updatedBookingItems,
        };
      } else {
        updatedValues = {
          ...values,
          tournamentId,
          bookingItems: [
            {
              categoryId: eventId,
            },
          ],
        };
      }

      const result = await dispatch(
        createConfirmBooking({ data: updatedValues })
      ).unwrap();
      if (!result?.responseCode) {
        resetForm();
        dispatch(toggleBookingModal());
        dispatch(
          getAllBookings({
            currentPage: currentPage || 1,
            limit: bookingLimit,
            tour_Id: tournamentId,
            eventId,
          })
        );
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log("error while creating confirm booking", err);
      }
      setHasError(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showConfirmBookingModal) {
      setInitialState((prevState) => {
        return { ...initialValues, ...prevState };
      });
    }
  }, [showConfirmBookingModal]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Dialog
          open={showConfirmBookingModal}
          onClose={() => {
            dispatch(toggleBookingModal());
          }}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white pb-2 px-2 xl:px-4 xl:pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-full sm:max-w-md lg:max-w-[40%] xl:max-w-[30%]   sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className="w-full bg-[#FFFFFF] p-[10px] lg:px-[20px] overflow-y-auto">
                  <AddUserModalTitle />

                  {hasError && <ErrorBanner message={bookingErrorMessage} />}

                  <Form>
                    <div className="grid grid-col-1 gap-[20px]">
                      <div className="flex flex-col flex-1 items-start gap-2.5">
                        <label
                          className="text-base leading-[19.36px]"
                          htmlFor="name"
                        >
                          User Name
                        </label>
                        <Field
                          name="name"
                          id="name"
                          type="text"
                          className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your name"
                        />
                        <ErrorMessage name="name" component={TextError} />
                      </div>
                      {/* <div className="flex flex-col items-start gap-2.5">
                        <label
                          className="text-base leading-[19.36px]"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <Field
                          id="email"
                          name="email"
                          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component={TextError} />
                      </div> */}
                      <div className="flex flex-col items-start gap-2.5">
                        <label
                          className="text-base leading-[19.36px]"
                          htmlFor="phone"
                        >
                          Phone Number
                        </label>
                        <Field
                          id="phone"
                          name="phone"
                          type="phone"
                          className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone"
                        />
                        <ErrorMessage name="phone" component={TextError} />
                      </div>

                      {category?.format !== "SE" && (
                        <>
                          <div className="flex gap-2.5 items-center justify-start flex-wrap flex-1">
                            <input
                              type="checkbox"
                              id="add_partner"
                              name="add_partner"
                              className="sm:w-3 sm:h-3 md:sm-4 md:h-4 lg:w-4 lg:h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
                              checked={isChecked}
                              onChange={(e) => {
                                setIsChecked(e.target.checked);
                              }}
                            />
                            <label
                              htmlFor="add_partner"
                              className="text-[15px] text-[#718EBF] leading-[18px]"
                            >
                              Add Partner
                            </label>
                          </div>

                          {isChecked && (
                            <div className="flex flex-col gap-2.5">
                              <div className="flex flex-col items-start gap-2.5">
                                <label
                                  className="text-base leading-[19.36px]"
                                  htmlFor="bookingItems.partnerDetails.name"
                                >
                                  Name
                                </label>
                                <Field
                                  id="bookingItems.partnerDetails.name"
                                  name="bookingItems.partnerDetails.name"
                                  type="phone"
                                  className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your partner phone"
                                />
                                <ErrorMessage
                                  name="bookingItems.partnerDetails.name"
                                  component={TextError}
                                />
                              </div>
                              <div className="flex flex-col items-start gap-2.5">
                                <label
                                  className="text-base leading-[19.36px]"
                                  htmlFor="bookingItems.partnerDetails.phone"
                                >
                                  Phone Number
                                </label>
                                <Field
                                  id="bookingItems.partnerDetails.phone"
                                  name="bookingItems.partnerDetails.phone"
                                  type="bookingItems.partnerDetails.phone"
                                  className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your partner phone"
                                />
                                <ErrorMessage
                                  name="bookingItems.partnerDetails.phone"
                                  component={TextError}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex flex-1 items-center justify-center gap-5 px-[50px]">
                        <button
                          onClick={() => dispatch(toggleBookingModal())}
                          type="button"
                          disabled={isSubmitting}
                          className="inline-flex text-black border-1 border-blue-500  w-full items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-xl hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <Button
                          type="submit"
                          className="inline-flex w-full min-w-fit items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
                          loading={isSubmitting}
                          onClick={() => {
                            console.log("is submitting", isSubmitting);
                          }}
                        >
                          Add Participant
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddParticipants;
