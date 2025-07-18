import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import Button from "./Button";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FaGreaterThan } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { calenderIcon } from "../../Assests";
import { Field, Formik, Form, ErrorMessage, useFormikContext } from "formik";
import TextError from "../Error/formError";
import TimeInput from "./TimeInput";
import {
  updateMatch,
  getFixture,
  getFixtureById,
} from "../../redux/tournament/fixturesActions";
import { showSuccess } from "../../redux/Success/successSlice";
import { showError } from "../../redux/Error/errorSlice";
import { formattedDate, parseDate, timeInMins } from "../../utils/dateUtils";
import { checkRoles } from "../../utils/roleCheck";
import { ADMIN_ROLES } from "../../Constant/Roles";
import axiosInstance from "../../Services/axios";

const initialValues = {
  id: "",
  stage_id: "",
  group_id: "",
  round_id: "",
  opponent1: {
    id: "",
  },
  opponent2: {
    id: "",
  },
  metaData: {
    date: "",
    time: {
      startTime: "",
    },
    // court: 1,
  },
};

export const MatchModal = ({
  isOpen,
  onCancel,
  tournament,
  matchDetails,
  participants = [],
  fixtureId,
  tournamentId,
  eventId,
  metaData,
}) => {

  const validationSchema = yup.object().shape({
    metaData: yup.object().shape({
      date: yup.date().required("Match Start Date is required."),
      time: yup.object().shape({
        startTime: yup
          .string()
          .required("Start time of the match is required."),
      }),
      // court: yup.number().optional(),
    }),
  });

  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.event);
  const [roundNumber, setRoundNumber] = useState(null);
  const [initialState, setInitialState] = useState(initialValues);
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [playersData, setPlayersData] = useState({
    opponent1: "",
    opponent2: "",
  });

  useEffect(() => {
    if (participants.length > 0 && matchDetails) {
      const {
        opponent1 = {},
        opponent2 = {},
        id,
        stage_id,
        group_id,
        round_id,
      } = matchDetails;
      setPlayersData((prev) => ({ ...prev, opponent1: "", opponent2: "" }));
      const oppenent1Data = participants.find(
        (participant) => participant.id === opponent1?.id
      );

      const oppenent2Data = participants.find(
        (participant) => participant.id === opponent2?.id
      );

      if (oppenent1Data) {
        setPlayersData((prev) => ({ ...prev, opponent1: oppenent1Data.name }));
        setInitialState((prev) => ({
          ...prev,
          opponent1: {
            id: oppenent1Data.id,
          },
        }));
      }
      if (oppenent2Data) {
        setPlayersData((prev) => ({
          ...prev,
          opponent2: oppenent2Data.name,
        }));
        setInitialState((prev) => ({
          ...prev,
          opponent2: {
            id: oppenent2Data.id,
          },
        }));
      }

      setRoundNumber(matchDetails?.metadata?.roundNumber);
      setInitialState((prev) => ({
        ...prev,
        id,
        group_id,
        stage_id,
        round_id,
        metaData: {
          ...prev.metaData,
          // court: metaData?.court,
          date: metaData?.date && parseDate(metaData?.date),
          time: {
            ...prev.metaData.time,
            startTime: metaData?.time?.startTime,
          },
        },
      }));
    }
  }, [matchDetails]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const updatedValues = {
        ...values,
        metaData: {
          ...values.metaData,
          date: formattedDate(values.metaData.date),
        },
      };

      const result = await dispatch(
        updateMatch({
          tour_Id: tournamentId,
          eventId,
          formData: updatedValues,
          fixtureId,
        })
      ).unwrap();

      if (!result.responseCode) {
        dispatch(
          showSuccess({
            message: "Match Updated Successfully",
            onClose: "hideSuccess",
          })
        );
        onCancel(false);

        dispatch(getFixtureById({ tour_Id: tournamentId, eventId, fixtureId }));
      }
    } catch (err) {
      console.log("Error in updating the match", err);

      dispatch(
        showError({
          message:
            err?.data?.message ||
            "Opps! something went wrong while updating the match.",
          onClose: "hideError",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleMatchSheet = async () => {
    const key = matchDetails?.id;
    setDownloadError('');
    setDownloading(true);
    try {
      // Get the base URL from environment
      const baseURL = import.meta.env.VITE_BASE_URL;
      const ENDPOINT = checkRoles(ADMIN_ROLES)
        ? `/users/admin/tournaments/${tournamentId}/categories/${eventId}/fixtures/${fixtureId}/export-matches/matchWise/${key}`
        : `/users/tournament-owner/tournaments/${tournamentId}/categories/${eventId}/fixtures/${fixtureId}/export-matches/matchWise/${key}`;
      const url = `${baseURL}${ENDPOINT}`;
      const response = await axiosInstance.get(url, {
        responseType: 'blob', // Important for file downloads
        headers: {
          'Accept': 'application/pdf',
        },
      });

      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Try to get filename from headers
      let filename = 'exported-matches.pdf';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(err.response?.data?.message || err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  }

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

      <div className="fixed inset-0 z-[11] w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative max-h-[90vh] overflow-y-auto transform  rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[70%]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <Formik
              enableReinitialize
              initialValues={initialState}
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
                    {/* <VenueLocationAndCourt /> */}
                    <div className="flex gap-2 justify-end">
                      <Button
                        className="w-[148px] h-[40px] rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF] ml-auto"
                        loading={isSubmitting}
                        disabled={!isValid}
                        type="submit"
                      >
                        Save
                      </Button>
                      <p className="text-sm bg-green-700 text-white flex items-center justify-center px-3 rounded-md leading-0 capitalize leading-none cursor-pointer" onClick={handleMatchSheet}>{downloading ? 'Downloading...' : 'Download'}</p>
                    </div>
                    {downloadError && <div className='text-red-500 text-xs'>{downloadError}</div>}
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

export const MatchModalTitle = ({ tournamentName, eventName, onCancel }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col gap-1 md:gap-2">
        <p className="text-sm md:text-md lg:text-lg text-[#343C6A] font-semibold">
          {tournamentName}
        </p>
        <p className="text-sm md:text-md lg:text-lg text-[#343C6A] font-semibold">
          {eventName}
        </p>
      </div>
      <IoCloseSharp
        className="sm:w-10 sm:h-10 w-6 h-6 shadow-md cursor-pointer"
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
      <p className="text-white text-xs sm:text-sm md:text-md lg:text-lg font-semibold">
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
  const { values, setFieldValue } = useFormikContext();

  const handleStartTimeChange = (startTime) => {
    setFieldValue("metaData.time.startTime", startTime);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-[#718EBF]">
      <div className="flex flex-col gap-2 items-start">
        <label className="text-base leading-[19.36px]" htmlFor="metaData.date">
          Date
        </label>
        <div className="relative w-full">
          <Field name="metaData.date">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="metaData.date"
                  name="metaData.date"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    if (date) {
                      form.setFieldValue("metaData.date", date);
                    }
                  }}
                />
                <img
                  src={calenderIcon}
                  alt="calendar icon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage component={TextError} name="metaData.date" />
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        <label
          className="text-base leading-[19.36px]"
          htmlFor="metaData.time.startTime"
        >
          Start Time <span className="text-[11px] ">( 24 hour format )</span>
        </label>
        <TimeInput
          label="Enter Start Time"
          value={values?.metaData?.time?.startTime || ""}
          onChange={handleStartTimeChange}
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage component={TextError} name="metaData.time.startTime" />
      </div>
    </div>
  );
};


const VenueLocationAndCourt = () => {
  return (
    <div className="flex items-start text-[#718EBF] gap-3">

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
  tournamentId: PropTypes.string,
  eventId: PropTypes.string,
  fixtureId: PropTypes.string,
  metaData: PropTypes.object,
};
