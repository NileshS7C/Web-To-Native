import { useEffect, useState, useMemo, useCallback } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { showSuccess } from "../../../redux/Success/successSlice";
import { showError } from "../../../redux/Error/errorSlice";
import { nanoid } from "nanoid";
import { RxCross2 } from "react-icons/rx";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext, FieldArray } from "formik";
import TextError from "../../Error/formError";
import { searchIcon } from "../../../Assests";
import { tournamentEvent } from "../../../Constant/tournament";
import AddPlayerModal from "./AddPlayerModal";
import Button from "../../Common/Button";
import { useUpdateHybridFixture, useCreateHybridFixture, useUpdateChildFixture } from "../../../Hooks/useCatgeory";
import { getFixtureById, getHybridFixtures } from "../../../redux/tournament/fixturesActions";
import { useDispatch, useSelector } from "react-redux";
import { checkRoles } from '../../../utils/roleCheck';
import { ADMIN_ROLES } from '../../../Constant/Roles';
import axiosInstance from '../../../Services/axios';

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

const RoundCreationModal = ({ toggleModal, actionType, roundIndex, tournamentId, categoryId, fixtureId }) => {

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Round name is required")
      .min(3, "Round name should be minimum 3 characters")
      .max(50, "Round name cannot exceed more than 50 characters."),
    format: yup.string().required(),
    roundRobinMode: yup.string().optional(),
    consolationFinal: yup.boolean().optional(),
    numberOfGroups: yup
      .string()
      .default("1")
      .when("format", {
        is: "RR",
        then: (schema) =>
          schema.required("Number of groups is required in Round Robin format"),
        otherwise: (schema) => schema.optional(),
      }),
    totalSets: yup.string().optional(),
    participants: yup
      .array()
      .of(yup.object())
      .when('$isChildRound', {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema
          .required("Participants field is required")
          .min(2, "At least two participant is required"),
      }),
    grandFinalsDE: yup.string().optional(),
  });

  const [groupSizes, setGroupSizes] = useState([]);
  const [parentFixtures, setParentFixtures] = useState([]);
  const [parentLoading, setParentLoading] = useState(false);

  const onGroupChangeHandler = (noOfGroups) => {
    if (noOfGroups > groupSizes?.length) {
      const newGroupsLength = noOfGroups - groupSizes.length;
      const newGroups = Array.from({ length: newGroupsLength }, (_, index) => ({
        id: groupSizes.length + index + 1,
        totalParticipants: "",
      }));
      setGroupSizes((prev) => [...prev, ...newGroups]);
    } else if (noOfGroups < groupSizes?.length) {
      const newGroup = groupSizes.slice(0, noOfGroups);
      setGroupSizes(newGroup);
    }
  };

  const handleGroupValueChange = (index, event) => {
    const updatedValue = event.target.value;
    const updatedGroups = [...groupSizes];
    updatedGroups[index].totalParticipants = updatedValue;
    setGroupSizes(updatedGroups);
  };

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

  const {
    mutate: updateChildFixture,
    isSuccess: isUpdateChildFixtureSuccess,
    isError: isUpdateChildFixtureError,
    error: updateChildFixtureError,
    isPending: isUpdateChildFixturePending,
  } = useUpdateChildFixture();

  const { fixture } = useSelector((state) => state.fixture);
  // Check if this is a child round
  const isChildRound = fixture?.isChildFixture;

  const getInitialState = () => {
    if (actionType === "edit") {
      const {
        groupCount,
        matchesChildCount,
        roundRobinMode,
        consolationFinal = false,
        grandFinalsDE = "",
      } = fixture?.bracketData?.stage[0]?.settings || {};
      // For child round, set parentRound to current parent name
      let parentRound = '';
      let pickParticipantOrder = '';
      let participantFromEachGroup = '';
      if (fixture?.isChildFixture && fixture?.parentName) {
        parentRound = fixture.parentName;
      }
      if (fixture?.isChildFixture && fixture?.metaData?.pickParticipantOrder) {
        initialValues.pickParticipantOrder = fixture?.metaData?.pickParticipantOrder;
      }
      if (fixture?.isChildFixture && fixture?.metaData?.participantFromEachGroup) {
        initialValues.participantFromEachGroup = fixture?.metaData?.participantFromEachGroup;
      }
      return {
        ...initialValues,
        name: fixture?.name || "",
        format: fixture?.format || "",
        participants: fixture?.bracketData?.participant || [],
        totalSets: matchesChildCount?.toString() || "",
        numberOfGroups: groupCount?.toString() || "",
        roundRobinMode: roundRobinMode || "",
        consolationFinal: consolationFinal || false,
        grandFinalsDE: grandFinalsDE || "",
        parentRound,
        pickParticipantOrder: fixture?.metaData?.pickParticipantOrder || '',
        participantFromEachGroup: fixture?.metaData?.participantFromEachGroup || ''
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
  useEffect(() => {
    if (actionType === 'edit' && fixture) {
      const { groupSizes } = fixture?.bracketData?.stage[0]?.settings || {};

      if (groupSizes && Array.isArray(groupSizes)) {
        const clonedGroupSizes = groupSizes.map((group) => ({ ...group }));
        setGroupSizes(clonedGroupSizes);
      } else {
        setGroupSizes([]);
      }
    }
  }, [actionType]);

  const validateGroupParticipants = (groups, totalPlayers) => {
    let totalParticipants = 0;

    for (const group of groups) {
      if (!group.totalParticipants) {
        return {
          isValid: false,
          message: "Total participants in the group cannot be empty.",
        };
      }

      if (group.totalParticipants < 2) {
        return {
          isValid: false,
          message: "All groups should contain at least 2 participants",
        };
      }
      totalParticipants += Number(group.totalParticipants);
    }
    if (totalParticipants !== totalPlayers) {
      return {
        isValid: false,
        message:
          "Total participants in all groups must equal the number you selected",
      };
    }

    return { isValid: true, message: "" };
  };
  const checkChangeValue = (initialState, values) => {

    const changed = {};

    for (const key in values) {
      if (key === "participants") {
        // Skip participant changes for child rounds
        if (isChildRound) {
          continue;
        }

        const initialParticipants = fixture?.bracketData?.participant || [];

        const currentParticipants = values.participants || [];
        if (initialParticipants?.length !== currentParticipants?.length) {
          changed.participants = true;
        }
        const changedParticipants = currentParticipants.filter((current, i) => {
          const init = initialParticipants?.[i];
          return init?.id !== current?.id;
        });

        if (changedParticipants.length > 0) {
          changed.participants = true;
        }

      } else if (initialState[key] != values[key]) {
        changed[key] = true;
      }
    }

    return changed;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPayload = (initialState, actionType, values, groupSizes) => {
    const {
      format,
      name,
      numberOfGroups,
      totalSets,
      roundRobinMode,
      grandFinalsDE,
      participants,
      consolationFinal,
      parentRound,
      pickParticipantOrder,
      participantFromEachGroup
    } = values;

    const settings = {
      consolationFinal,
      ...(totalSets && { totalSets }),
      ...(roundRobinMode && { roundRobinMode, groupSizes }),
      ...(numberOfGroups && { numberOfGroups }),
      ...(grandFinalsDE && { grandFinalsDE }),
    };

    // For child round update, use parentId from selected parentRound
    if (isChildRound && actionType === "edit") {
      // Find the selected parent fixture by name
      const selectedParent = parentFixtures.find(f => f.name === parentRound);
      const parentId = selectedParent?._id || selectedParent?.id || fixture?.parentId;
      const changedField = checkChangeValue(initialState, values);
      if (
        (Object.keys(changedField).length === 1 && changedField?.name) ||
        Object.keys(changedField).length === 0
      ) {
        return {
          tournamentId,
          categoryId,
          fixtureData: {
            name,
            parentId,
            metaData: {
              ...fixture?.metaData,
              pickParticipantOrder: pickParticipantOrder.toUpperCase(),
              participantFromEachGroup
            },
          },
        };
      }
      return {
        tournamentId,
        categoryId,
        fixtureData: {
          format,
          name,
          settings,
          parentId,
          metaData: {
            ...fixture?.metaData,
            pickParticipantOrder: pickParticipantOrder.toUpperCase(),
            participantFromEachGroup
          },
        },
      };
    } else {   
      const bookings =
      participants?.map((p) => ({ bookingId: p.bookingId })) || [];
      if (actionType === "edit") {
        const changedField = checkChangeValue(initialState, values);
        console.log(changedField,'changedField');
        if (
        (Object.keys(changedField).length === 1 && changedField?.name) ||
        Object.keys(changedField).length === 0
      ) {
        return {
          tournamentId,
          categoryId,
          fixtureData: {
            name,
          },
        };
      }
    }
    return {
      tournamentId,
      categoryId,
      fixtureData: {
        format,
        name,
        settings,
        bookings,
      },
    };
  }
  };
  const handleSubmit = (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      // Skip participant validation for child rounds
      if (!isChildRound && values?.format === "RR" && values.numberOfGroups > 0) {
        const { isValid, message } = validateGroupParticipants(
          groupSizes,
          values.participants.length
        );
        if (!isValid) {
          dispatch(
            showError({
              message,
              onClose: "hideError",
            })
          );
          return;
        }
      }
      const payload = createPayload(initialState, actionType, values, groupSizes);
      if (actionType === "add") {
        createHybridFixture({
          tournamentId,
          categoryId,
          payload
        });
      } else {
        if (isChildRound) {
          updateChildFixture({
            tournamentId,
            categoryId,
            fixtureId: fixtureId,
            payload
          });
        } else {
          updateHybridFixture({
            tournamentId,
            categoryId,
            fixtureId: fixtureId,
            payload
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (isCreateFixtureSuccess || isUpdateFixtureSuccess || isUpdateChildFixtureSuccess) {
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
            getHybridFixtures({
              tour_Id: tournamentId,
              eventId: categoryId
            })
          );
        } else if (actionType === "edit") {
          dispatch(
            getFixtureById({
              tour_Id: tournamentId,
              eventId: categoryId,
              fixtureId
            })
          );
        }
      }, 1000);
    }
  }, [isCreateFixtureSuccess, isUpdateFixtureSuccess, isUpdateChildFixtureSuccess]);
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
    if (isUpdateFixtureError || isCreateFixtureError || isUpdateChildFixtureError) {
      dispatch(
        showError({
          message:
            actionType === "actionType"
              ? createFixtureError?.message
              : updateFixtureError?.message || updateChildFixtureError?.message ||
              `Oops! something went wrong ${actionType === "add"
                ? "while creating fixture."
                : "while updating fixture"
              }`,
          onClose: "hideError",
        })
      );
    }
  }, [isUpdateFixtureError, isCreateFixtureError, isUpdateChildFixtureError]);

  // Fetch parent rounds if editing a child round
  useEffect(() => {
    const fetchHybridFixtures = async () => {
      setParentLoading(true);
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const endpoint = checkRoles(ADMIN_ROLES)
          ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`
          : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        const response = await axiosInstance.get(endpoint);
        setParentFixtures(response.data?.data?.fixtures || []);
      } catch (error) {
        setParentFixtures([]);
      } finally {
        setParentLoading(false);
      }
    };
    if (isChildRound && actionType === 'edit') {
      fetchHybridFixtures();
    }
  }, [isChildRound, actionType, tournamentId, categoryId]);

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
                    context={{ isChildRound }}
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
                          {/* Parent Round Dropdown for child rounds (just below Round Name) */}
                          {isChildRound && actionType === 'edit' && (
                            <div className="flex flex-col items-start gap-2.5">
                              <label className="text-sm sm:text-base md:text-lg leading-[19.36px] text-black font-normal sm:font-medium">
                                Parent Round
                              </label>
                              <Field
                                as="select"
                                name="parentRound"
                                className="text-sm sm:text-base md:text-lg w-full px-[19px] text-[#718EBF] border-[2px] border-[#DFEAF2] rounded-xl h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={parentLoading}
                              >
                                <option value="">Select Parent Round</option>
                                {parentFixtures
                                  .filter(f => (f._id || f.id) !== fixtureId)
                                  .map((f) => (
                                    <option key={f._id || f.id || f.name} value={f.name}>
                                      {f.name}
                                    </option>
                                  ))}
                              </Field>
                            </div>
                          )}
                          <EventFormat onChange={onGroupChangeHandler} />
                          {(values?.numberOfGroups && values?.numberOfGroups > 0) && (
                            <GroupSize
                              groupSizes={groupSizes}
                              onChange={handleGroupValueChange}
                            />
                          )}

                          {/* Only show player input field for parent rounds or when adding new rounds */}
                          {(!isChildRound || actionType === "add") && (
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
                          )}

                          {/* Always show participant list, but hide delete buttons for child rounds */}
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
                                {/* Only show header for delete column if not a child round */}
                                {(!isChildRound || actionType === "add") && (
                                  <span className="flex-[10] text-left text-grey-500 font-medium"></span>
                                )}
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
                                            className={`flex items-center py-1.5 ${!isLast
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
                                            {/* Only show delete button for parent rounds or when adding new rounds */}
                                            {(!isChildRound || actionType === "add") && (
                                              <RxCross2
                                                className="flex-[10] cursor-pointer w-4 h-4"
                                                onClick={() => {
                                                  handleRemove(index);
                                                }}
                                              />
                                            )}
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
                          {isChildRound && actionType === 'edit' && (
                            <>
                              <div>
                                <label className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] " htmlFor="pickingOrder">Player Picking Order :</label>
                                <div className="flex gap-4 mt-2">
                                  <label className="flex items-center gap-1">
                                    <input type="radio" name="pickParticipantOrder" value="top" checked={initialState.pickParticipantOrder.toUpperCase() === 'TOP'} className="accent-[#1570EF]" onChange={handleChange}/>
                                    <span className='text-sm text-[#667085]'>Top Players</span>
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <input type="radio" name="pickParticipantOrder" value="bottom" checked={initialState.pickParticipantOrder.toUpperCase() === 'BOTTOM'} className="accent-[#1570EF]" onChange={handleChange}  />
                                    <span className='text-sm text-[#667085]'>Bottom Players</span>
                                  </label>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm sm:text-base md:text-lg font-normal sm:font-medium leading-[19.36px] text-[#232323] mb-1" htmlFor="participantFromEachGroup">Players From Each Group</label>
                                <input
                                  type="text"
                                  name="participantFromEachGroup"
                                  value={initialState.participantFromEachGroup}
                                  onChange={handleChange}
                                  placeholder="Enter Number of Players to Pick From Each Group"
                                  className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
                                />
                              </div>
                            </>
                          )}
                          <div className="">
                            <div className="flex gap-2 sm:gap-4 justify-center ">
                              <Button
                                type="button"
                                className="py-2 px-6 sm:px-8 md:px-10 rounded-[10px] bg-white border-2 border-[#1570EF] text-sm sm:text-base md:text-lg leading-[17px] text-[#232323]"
                                onClick={toggleModal}
                              >
                                Close
                              </Button>
                              <Button
                                className="py-2 px-6 sm:px-8 md:px-10 rounded-[10px] shadow-md bg-[#1570EF] text-sm sm:text-base md:text-lg leading-[17px] text-[#FFFFFF]"
                                type="submit"
                                loading={
                                  isCreateFixturePending ||
                                  isUpdateFixturePending ||
                                  isUpdateChildFixturePending
                                }
                                disabled={
                                  isCreateFixturePending ||
                                  isUpdateFixturePending ||
                                  isUpdateChildFixturePending
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
const EventFormat = ({ onChange }) => {
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
  useEffect(() => {
    if (values?.numberOfGroups > 0 && values?.numberOfGroups) {
      onChange(values?.numberOfGroups);
    }
  }, [values?.numberOfGroups]);
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
          {tournamentEvent.format.slice(0, 4).map((format, index) => (
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
              min={1}
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
const GroupSize = ({ groupSizes, onChange }) => {
  return (
    <div className="flex flex-col w-full rounded-md border-2 border-gray-200 ">
      <div className="flex  font-semibold text-gray-700 border-b  py-2 justify-around">
        <h3 className="w-[40%] max-w-[40%] text-center">Group No.</h3>
        <h3 className="w-[60%] max-w-[60%] text-center">
          Total Participants (Each Group)
        </h3>
      </div>
      <div className="flex flex-col gap-3 max-h-[120px] md:max-h-[150px] overflow-y-scroll">
        {groupSizes?.map((group, index) => (
          <div
            key={group.id}
            className="flex w-full border-b-2 justify-around py-2"
          >
            <span className="text-gray-800 text-center w-[40%] max-w-[40%]">
              {group.id}
            </span>
            <div className="flex justify-center max-w-[60%] mx-auto w-full">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={`Enter Group ${index + 1} total participants...`}
                value={group.totalParticipants}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*$/.test(value)) {
                    onChange(index, event);
                  }
                }}
                className="text-[15px] text-[#718EBF] w-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RoundCreationModal;
