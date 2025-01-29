import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookingModal } from "../../../redux/tournament/eventSlice";
import { crossIcon } from "../../../Assests";
import * as yup from "yup";
import TextError from "../../Error/formError";

const AddUserModalTitle = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between mb-[30px]">
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
  const dispatch = useDispatch();
  const { showConfirmBookingModal } = useSelector((state) => state.event);
  const initialValues = {
    name: "",
    email: "",
    phone: "",
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "User name should have at least 3 characters.")
      .max(50, "User name should not exceed more than 50 characters.")
      .required("Name is required."),
    email: yup
      .string()
      .email("Invalid email format.")
      .required("Email is required."),
    phone: yup
      .string()
      .matches(
        /^[0-9]{10}$/,
        "Phone number must be exactly 10 digits and contain only numbers."
      )
      .required("Phone number is required."),
  });

  return (
    <Dialog
      open={showConfirmBookingModal}
      onClose={() => dispatch(toggleBookingModal())}
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[30%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="w-full bg-[#FFFFFF] px-[20px] overflow-y-auto">
              <AddUserModalTitle />
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("Form values:", values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="grid grid-col-1 gap-[20px]">
                      <div className="flex flex-col items-start gap-2.5">
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
                          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your name"
                        />
                        <ErrorMessage name="name" component={TextError} />
                      </div>
                      <div className="flex flex-col items-start gap-2.5">
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
                      </div>
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
                          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone"
                        />
                        <ErrorMessage name="phone" component={TextError} />
                      </div>
                      <div className="flex gap-5 px-[50px]">
                        <button
                          onClick={() => dispatch(toggleBookingModal())}
                          type="button"
                          disabled={isSubmitting}
                          className="inline-flex text-black border-1 border-blue-500  w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-xl hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
                        >
                          Add Participant
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddParticipants;
