import { useEffect, useState, useMemo, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { showSuccess } from "../../../redux/Success/successSlice";
import { showError } from "../../../redux/Error/errorSlice";
import { nanoid } from "nanoid";
import { RxCross2 } from "react-icons/rx";
import * as yup from "yup";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  FieldArray,
} from "formik";
import TextError from "../../Error/formError";
import { searchIcon } from "../../../Assests";
import { tournamentEvent } from "../../../Constant/tournament";
import AddPlayerModal from "./AddPlayerModal";
import Button from "../../Common/Button";
const initialValues = {
  name: "",
  format: "",
  grandFinalsDE: "", //grandFinal in DE
  consolationFinal: false,
  roundRobinMode: "", //playCountRR in RR
  numberOfGroups: "", //groupCount in RR
  totalSets: "",
  participants: [],
};
import {
  useUpdateHybridFixture,
  useCreateHybridFixture,
} from "../../../Hooks/useCatgeory";
import {
  getFixtureById,
  getHybridFixtures,
} from "../../../redux/tournament/fixturesActions";
import { useDispatch, useSelector } from "react-redux";

const RoundCreationModal = ({
  toggleModal,
  actionType,
  roundIndex,
  tournamentId,
  categoryId,
  fixtureId,
}) => {
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Round name is required")
      .min(3, "Round name should be minimum 3 characters")
      .max(50, "Round name cannot exceed more than 50 characters."),
    groupName: yup
      .string()
      .optional("Group name is required")
      .min(3, "Group name should be minimum 3 characters")
      .max(50, "Group name cannot exceed more than 50 characters."),

    format: yup.string().required(),

    roundRobinMode: yup.string().optional(),

    consolationFinal: yup.boolean().optional(),

    numberOfGroups: yup.string().optional(),

    totalSets: yup.string().optional(),

    participants: yup
      .array()
      .of(yup.object())
      .required("Participants field is required")
      .min(2, "At least two participant is required"),

    grandFinalsDE: yup.string().optional(),
  });

  const {
    mutate: createHybridFixture,
    isSuccess: isCreateFixtureSuccess,
    isError: isCreateFixtureError,
    error: createFixtureError,
    isPending: isCreateFixturePending,
  } = useCreateHybridFixture();

  const {
    mutate: updateHybridFixture,
    isSuccess: isUpdateFixtureSuccess,
    isError: isUpdateFixtureError,
    error: updateFixtureError,
    isPending: isUpdateFixturePending,
  } = useUpdateHybridFixture();
  const { fixture } = useSelector((state) => state.fixture);
  const getInitialState = () => {
    if (actionType === "edit") {
      const {
        groupCount,
        matchesChildCount,
        roundRobinMode,
        consolationFinal = false,
        grandFinalsDE = "",
      } = fixture?.bracketData?.stage[0]?.settings || {};

      return {
        ...initialValues,
        name: fixture?.name || "",
        groupName: fixture?.groupName || "",
        format: fixture?.format || "",
        participants: fixture?.bracketData?.participant || [],
        totalSets: matchesChildCount?.toString() || "",
        numberOfGroups: groupCount?.toString() || "",
        roundRobinMode: roundRobinMode || "",
        consolationFinal: consolationFinal || false,
        grandFinalsDE: grandFinalsDE || "",
      
      };
    }
    return initialValues;
  };
  const dispatch = useDispatch();
  const [initialState, setInitialState] = useState(getInitialState());
  const [isPlayerOpenModal, setIsPlayerModalOpen] = useState(false);

  const handleUpdateParticipant = useCallback((participants) => {
    setInitialState((prev) => ({
      ...prev,
      participants,
    }));
  }, []);
  const createPayload = (values) => {
    const {
      format,
      name,
      numberOfGroups,
      totalSets,
      roundRobinMode,
      grandFinalsDE,
      participants,
      consolationFinal,
      groupName
    } = values;

    const settings = {
      consolationFinal,
      ...(totalSets && { totalSets }),
      ...(roundRobinMode && { roundRobinMode }),
      ...(numberOfGroups && { numberOfGroups }),
      ...(grandFinalsDE && { grandFinalsDE }),
    };

    const bookings =
      participants?.map((p) => ({ bookingId: p.bookingId })) || [];

    return {
      tournamentId,
      categoryId,
      fixtureData: {
        format,
        name,
        groupName,
        settings,
        bookings,
      },
    };
  };

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const payload = createPayload(values);
      if (actionType === "add") {
        createHybridFixture({ tournamentId, categoryId, payload });
      } else {
        updateHybridFixture({
          tournamentId,
          categoryId,
          fixtureId: fixtureId,
          payload,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (isCreateFixtureSuccess || isUpdateFixtureSuccess) {
      toggleModal();
      dispatch(
        showSuccess({
          message:
            actionType === "add"
              ? "Round added Successfully."
              : "Round updated successfully.",
          onClose: "hideSuccess",
        })
      );
      setTimeout(() => {
        if (actionType === "add") {
          dispatch(
            getHybridFixtures({ tour_Id: tournamentId, eventId: categoryId })
          );
        } else if (actionType === "edit") {
          dispatch(
            getFixtureById({
              tour_Id: tournamentId,
              eventId: categoryId,
              fixtureId,
            })
          );
        }
      }, 1000);
    }
  }, [isCreateFixtureSuccess, isUpdateFixtureSuccess]);
  const togglePlayerModal = useCallback(() => {
    setIsPlayerModalOpen((prev) => !prev);
  }, []);

  const handleRemove = useCallback((index) => {
    setInitialState((prev) => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => index !== i),
    }));
  }, []);
  useEffect(() => {
    if (isUpdateFixtureError || isCreateFixtureError) {
      dispatch(
        showError({
          message:
            actionType === "actionType"
              ? createFixtureError?.message
              : updateFixtureError?.message ||
                `Oops! something went wrong ${
                  actionType === "add"
                    ? "while creating fixture."
                    : "while updating fixture"
                }`,
          onClose: "hideError",
        })
      );
    }
  }, [isUpdateFixtureError, isCreateFixtureError]);

  return (
    <>
      <Dialog
        open={true}
        onClose={() => {
          toggleModal();
        }}
        className="relative z-10 "
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <DialogPanel
              transition
              className="relative transform overflow-hidden scrollbar-hide rounded-lg bg-white px-2 pb-2 pt-3 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-[85%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[40%] max-h-[90vh]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto"
            >
              <div>
                <div className="w-full bg-[#FFFFFF] h-full">
                  <Formik
                    initialValues={initialState}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, values, setFieldValue, setValues }) => (
                      <Form>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between gap-2.5">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-grey-600 tracking-wide opacity-[90%]">
                              {actionType === "add"
                                ? "Add Round"
                                : `Edit Round ${roundIndex + 1}`}
                            </h3>
                            <RxCross2
                              className="cursor-pointer w-6 h-6"
                              onClick={() => {
                                toggleModal();
                              }}
                            />
                          </div>
                          <div className="flex flex-col items-start gap-2.5">
                            <label
                              className="text-sm sm:text-base md:text-lg leading-[19.36px] text-black font-normal sm:font-medium"
                              htmlFor="name"
                            >
                              Round Name
                            </label>
                            <Field
                              placeholder="Enter Round Name"
                              id="name"
                              name="name"
                              className="text-sm sm:text-base md:text-lg w-full px-[19px] text-[#718EBF] border-[2px] border-[#DFEAF2] rounded-xl h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                            />

                            <ErrorMessage name="name" component={TextError} />
                          </div>
                          <div className="flex flex-col items-start gap-2.5">
                            <label
                              className="text-sm sm:text-base md:text-lg leading-[19.36px] text-black font-normal sm:font-medium"
                              htmlFor="groupName"
                            >
                              Group Name
                            </label>
                            <Field
                              placeholder="Enter Group Name"
                              id="groupName"
                              name="groupName"
                              className="text-sm sm:text-base md:text-lg w-full px-[19px] text-[#718EBF] border-[2px] border-[#DFEAF2] rounded-xl h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                            />
                            <ErrorMessage name="groupName" component={TextError} />
                          </div>
                          <EventFormat />
                          <div
                            className="relative w-full"
                            onClick={() => {
                              setInitialState(values);
                              togglePlayerModal();
                            }}
                          >
                            <input
                              readOnly
                              placeholder="Add Players..."
                              className="cursor-pointer w-full px-2 border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base md:text-lg"
                            />
                            <img
                              src={searchIcon}
                              alt="search Venue"
                              className="absolute right-[20px] top-1/2 transform -translate-y-1/2"
                            />
                          </div>
                          {/* Participant list */}
                          {values?.participants?.length > 0 && (
                            <div className="rounded-lg border-2 border-[#DFEAF2]">
                              {/* header */}
                              <div className=" flex items-center py-1.5 border-b-2 border-[#DFEAF2] bg-grey-200">
                                <span className="text-sm sm:text-base md:text-lg flex-[20] text-center text-grey-500 font-medium"></span>
                                <span className="text-sm sm:text-base md:text-lg flex-[35] text-left text-grey-500 font-medium">
                                  Name
                                </span>
                                <span className="text-sm sm:text-base md:text-lg flex-[35] text-left text-grey-500 font-medium">
                                  Phone No
                                </span>
                                <span className="flex-[10] text-left text-grey-500 font-medium"></span>
                              </div>
                              <FieldArray name="participants">
                                {({ form }) => (
                                  <div className="max-h-[130px] overflow-y-auto scrollbar-hide">
                                    {form.values?.participants?.map(
                                      (row, index) => {
                                        const isLast =
                                          index ===
                                          form.values.participants.length - 1;
                                        return (
                                          <div
                                            key={nanoid()}
                                            className={`flex items-center py-1.5 ${
                                              !isLast
                                                ? "border-b-2 border-[#DFEAF2]"
                                                : ""
                                            }`}
                                          >
                                            <span className="flex-[20] text-center text-sm sm:text-base md:text-lg font-medium">
                                              {(index + 1)
                                                .toString()
                                                .padStart(2, "0")}
                                              .
                                            </span>

                                            <div className="flex flex-col flex-[35] text-left">
                                              {row?.players?.map(
                                                (player, index) => (
                                                  <span
                                                    key={nanoid()}
                                                    className="text-sm sm:text-base md:text-lg text-grey-500 font-medium"
                                                  >
                                                    {player.name}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                            <div className="flex flex-col flex-[35] text-left">
                                              {row?.players?.map((player) => (
                                                <span
                                                  key={nanoid()}
                                                  className="text-sm sm:text-base md:text-lg text-grey-500 font-medium"
                                                >
                                                  {player.phone}
                                                </span>
                                              ))}
                                            </div>
                                            <RxCross2
                                              className="flex-[10] cursor-pointer w-4 h-4"
                                              onClick={() => {
                                                handleRemove(index);
                                              }}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          )}
                          <ErrorMessage
                            name="participants"
                            component={TextError}
                          />
                          <div className="">
                            <div className="flex gap-2 sm:gap-4 justify-center ">
                              <Button
                                type="button"
                                className="py-2 px-6 sm:px-8 md:px-10 rounded-[10px] bg-white border-2 border-[#1570EF] text-[#1570EF] text-sm sm:text-base md:text-lg leading-[17px] text-[#232323]"
                                onClick={toggleModal}
                              >
                                Close
                              </Button>
                              <Button
                                className="py-2 px-6 sm:px-8 md:px-10 rounded-[10px] shadow-md bg-[#1570EF] text-sm sm:text-base md:text-lg leading-[17px] text-[#FFFFFF]"
                                type="submit"
                                loading={
                                  isCreateFixturePending ||
                                  isUpdateFixturePending
                                }
                                disabled={
                                  isCreateFixturePending ||
                                  isUpdateFixturePending
                                }
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {isPlayerOpenModal && (
        <AddPlayerModal
          toggleModal={togglePlayerModal}
          participants={initialState?.participants}
          handleUpdateParticipant={handleUpdateParticipant}
        />
      )}
    </>
  );
};
const EventFormat = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values?.format) {
      const isRR = values.format === "RR";
      const isDE = values.format === "DE";
      if (!isRR) {
        setFieldValue("numberOfGroups", "");
        setFieldValue("roundRobinMode", "");
      }

      if (!isDE) {
        setFieldValue("grandFinalsDE", "");
      }
    }
  }, [values.format, setFieldValue]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] "
          htmlFor="format"
        >
          Event Format
        </label>

        <Field
          name="format"
          id="format"
          className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          as="select"
        >
          {tournamentEvent.format.slice(0,4).map((format, index) => (
            <option
              key={`${format.name}`}
              value={index === 0 ? "" : format.shortName}
              className={index !== 0 ? "text-[#232323]" : ""}
            >
              {format.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="format" component={TextError} />
      </div>
      {values?.format === "RR" && (
        <>
          <div className="flex flex-col items-start gap-2">
            <label
              className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] "
              htmlFor="roundRobinMode"
            >
              Participant Play Count
            </label>
            <Field
              className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              as="select"
              name="roundRobinMode"
              id="roundRobinMode"
            >
              {tournamentEvent?.roundRobinMode.map((mode) => (
                <option value={mode?.shortName} key={mode?.id}>
                  {mode?.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="roundRobinMode" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label
              className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] "
              htmlFor="numberOfGroups"
            >
              Number of group
            </label>
            <Field
              placeholder="Enter Number Of Groups"
              id="numberOfGroups"
              name="numberOfGroups"
              className="w-full text-[15px] text-[#718EBF] placeholder-[#718EBF] leading-[18px] px-[12px] border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
            />

            <ErrorMessage name="numberOfGroups" component={TextError} />
          </div>
        </>
      )}

      {values?.format === "DE" && (
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] "
            htmlFor="grandFinalsDE"
          >
            Grand Finals
          </label>
          <Field
            className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            as="select"
            name="grandFinalsDE"
            id="grandFinalsDE"
          >
            {tournamentEvent.grandFinalsDE.map((mode) => (
              <option value={mode?.shortName} key={mode?.id}>
                {mode?.name}
              </option>
            ))}
          </Field>
          <ErrorMessage name="grandFinalsDE" component={TextError} />
        </div>
      )}
      <div className="flex flex-col items-start gap-2">
        <label
          className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] "
          htmlFor="totalSets"
        >
          Number of Sets
        </label>
        <Field
          className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          as="select"
          name="totalSets"
          id="totalSets"
        >
          {tournamentEvent.numberOfSets.map((set) => (
            <option value={set?.shortName} key={nanoid()}>
              {set?.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="totalSets" />
      </div>
    </div>
  );
};

export default RoundCreationModal;
