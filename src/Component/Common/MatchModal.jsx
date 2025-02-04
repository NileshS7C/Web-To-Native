import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import Button from "./Button";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FaGreaterThan } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { calenderIcon } from "../../Assests";
import { Field, Formik, Form, useFormikContext, ErrorMessage } from "formik";
import TextError from "../Error/formError";

const initialValues = {
  opponent1: {},
  opponent2: {},
  metaData: {
    location: {
      name: "",
    },
    date: "",
    time: {
      startTime: "",
      endTime: "",
    },
    court: 0,
  },
};

export const MatchModal = ({
  isOpen,
  onCancel,
  tournament,
  matchDetails,
  participants = [],
}) => {
  const validationSchema = yup.object().shape({
    metaData: yup.object().shape({
      location: yup.object().shape({
        name: yup.string().required("Venue Name is required."),
      }),
      date: yup.date().required("Match Start Date is required."),
      time: yup.object().shape({
        startTime: yup
          .string()
          .required("Start time of the match is required."),
        endTime: yup.string().required("End time of the match is required."),
      }),
      court: yup.number().optional(),
    }),
  });
  const { category } = useSelector((state) => state.event);
  const [roundNumber, setRoundNumber] = useState(null);
  const [playersData, setPlayersData] = useState({
    opponent1: "",
    opponent2: "",
  });

  useEffect(() => {
    if (participants.length > 0 && matchDetails) {
      const { opponent1 = {}, opponent2 = {} } = matchDetails;
      setPlayersData((prev) => ({ ...prev, opponent1: "", opponent2: "" }));
      const oppenent1Data = participants.find(
        (participant) => participant.id === opponent1?.id
      );

      const oppenent2Data = participants.find(
        (participant) => participant.id === opponent2?.id
      );

      if (oppenent1Data) {
        setPlayersData((prev) => ({ ...prev, opponent1: oppenent1Data.name }));
      }
      if (oppenent2Data) {
        setPlayersData((prev) => ({
          ...prev,
          opponent2: oppenent2Data.name,
        }));
      }

      setRoundNumber(matchDetails?.metadata?.roundNumber);
    }
  }, [matchDetails]);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(" values", values);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel(false)}
      className="relative z-10 "
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-xs sm:max-w-md lg:max-w-[40%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <div className="w-full bg-[#FFFFFF] px-[20px] flex flex-col gap-5 items-between justify-between">
                    <MatchModalTitle
                      tournamentName={tournament?.tournamentName}
                      eventName={category?.categoryName}
                      onCancel={onCancel}
                    />
                    <MatchRound round={roundNumber} />
                    <PlayersDetails playersData={playersData} />
                    <MatchDateAndTime />
                    <VenueLocationAndCourt />
                    <Button
                      className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                      loading={isSubmitting}
                      disabled={!isValid}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const MatchModalTitle = ({ tournamentName, eventName, onCancel }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-3">
        <p className="text-lg text-[#343C6A] font-semibold">{tournamentName}</p>
        <FaGreaterThan color="#343C6A" className="w-[24px] h-[24px]" />
        <p className="text-lg text-[#343C6A] font-semibold">{eventName}</p>
      </div>
      <IoCloseSharp
        className="w-[24px] h-[24px] shadow-md cursor-pointer"
        onClick={() => {
          onCancel(false);
        }}
      />
    </div>
  );
};

const MatchRound = ({ round }) => {
  return (
    <div className="flex justify-center w-full items-center py-3 rounded-lg bg-[#343C6A]">
      <p className="text-white text-lg font-semibold">
        Round <span>{round}</span>
      </p>
    </div>
  );
};

const PlayersDetails = ({ playersData }) => {
  return (
    <div className="flex items-center gap-3 w-full text-[#718EBF]">
      <div className="flex items-center gap-3 w-full ">
        <Field
          placeholder="Opponent 1"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={playersData.opponent1}
          disabled
        />
        <div>
          <span className="text-md text-[#343C6A]">VS</span>
        </div>
      </div>

      <div className="w-full">
        <Field
          placeholder="Opponent 2"
          id="handle"
          name="handle"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={playersData.opponent2}
          disabled
        />
      </div>
    </div>
  );
};

const MatchDateAndTime = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full text-[#718EBF]">
      <div className="flex flex-col gap-2  items-start">
        <label className="text-base leading-[19.36px]" htmlFor="metaData.date">
          Date
        </label>
        <div className="relative">
          <Field name="metaData.date">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="metaData.date"
                  name="metaData.date"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  className="w-[300px] z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("metaData.date", date);
                    }
                  }}
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage component={TextError} name="metaData.date" />
      </div>

      <div className="flex flex-col items-start  gap-2 w-full">
        <label
          className="text-base leading-[19.36px]"
          htmlFor="metaData.time.startTime"
        >
          Start Time
        </label>
        <Field
          type="time"
          name="metaData.time.startTime"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage component={TextError} name="metaData.time.startTime" />
      </div>

      <div className="flex flex-col items-start  gap-2 w-full">
        <label
          className="text-base leading-[19.36px]"
          htmlFor="metaData.time.endTime"
        >
          End Time
        </label>
        <Field
          type="time"
          name="metaData.time.endTime"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage component={TextError} name="metaData.time.endTime" />
      </div>
    </div>
  );
};

const VenueLocationAndCourt = () => {
  return (
    <div className="flex items-start text-[#718EBF] gap-3">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-2 items-start justify-between w-full">
          <label
            className="text-base leading-[19.36px]"
            htmlFor="metaData.location.name"
          >
            Venue
          </label>
          <Field
            placeholder="Enter Venue name"
            id="metaData.location.name"
            name="metaData.location.name"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ErrorMessage component={TextError} name="metaData.location.name" />
      </div>

      <div className="flex flex-col gap-2 items-start justify-center w-full">
        <label className="text-base leading-[19.36px]" htmlFor="metaData.court">
          Court
        </label>
        <Field
          placeholder="Enter Court No."
          id="metaData.court"
          name="metaData.court"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
        />
      </div>
    </div>
  );
};

MatchModalTitle.propTypes = {
  tournamentName: PropTypes.string,
  eventName: PropTypes.string,
  onCancel: PropTypes.func,
};

MatchRound.propTypes = {
  round: PropTypes.number,
};

PlayersDetails.propTypes = {
  playersData: PropTypes.object,
};

MatchModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  tournament: PropTypes.object,
  matchDetails: PropTypes.object,
  participants: PropTypes.array,
};
