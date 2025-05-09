import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ComboboxOptions,
  ComboboxOption,
  Combobox,
  Label,
  ComboboxInput,
  ComboboxButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
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
import SwitchToggle from "../../CMS/HomePage/SwitchToggle";
import { searchIcon } from "../../../Assests";
import {
  tournamentEvent,
  roundRobbinModeOptions,
  grandFinalsDEOption,
} from "../../../Constant/tournament";
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
import { getFixture } from "../../../redux/tournament/fixturesActions";
import { useDispatch } from "react-redux";
const RoundCreationModal = ({
  toggleModal,
  actionType,
  roundDetails,
  roundIndex,
  tournamentId,
  categoryId,
}) => {
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Round name is required")
      .min(3, "Round name should be minimum 3 characters")
      .max(50, "Round name cannot exceed more than 50 characters."),

    format: yup.string().optional(),

    roundRobinMode: yup.string().optional(),

    consolationFinal: yup.boolean().optional(),

    numberOfGroups: yup.string().optional(),

    totalSets: yup.string().optional(),

    participants: yup.array().min(1, "At least one participant is required"),

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

  const getInitialState = () => {
    if (actionType === "edit" && roundDetails) {

      const {
        groupCount,
        matchesChildCount,
        roundRobinMode,
        consolationFinal = false,
        grandFinalsDE = "",
      } = roundDetails?.bracketData?.stage[0]?.settings || {};
      return {
        ...initialValues,
        name: roundDetails?.name || "",
        format: roundDetails?.format || "",
        participants: roundDetails?.bracketData?.participant || [],
        totalSets: matchesChildCount || 0,
        numberOfGroups: groupCount || 0,
        roundRobinMode: roundRobinMode || "",
        consolationFinal: consolationFinal || false,
        grandFinalsDE: grandFinalsDE || "",
      };
    }
    return initialValues;
  };
 const dispatch=useDispatch();
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
       settings,
       bookings,
     },
   };
 };

  const handleSubmit = (values, { setSubmitting }) => {
    try {
       const payload = createPayload(values);
      if (actionType === "add") {
        createHybridFixture({ tournamentId, categoryId,payload });
      } else {
        updateHybridFixture({
          tournamentId,
          categoryId,
          fixtureId: roundDetails._id.toString(),
          payload
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };
 console.log(
   isCreateFixtureSuccess,
   isCreateFixtureError,
   createFixtureError,
   isCreateFixturePending,
   isUpdateFixtureSuccess,
   isUpdateFixtureError,
   updateFixtureError,
   isUpdateFixturePending,
   isUpdateFixturePending
 );
 useEffect(()=>{
    if(isCreateFixtureSuccess || isUpdateFixtureSuccess){
      toggleModal()
     dispatch(getFixture({ tour_Id: tournamentId, eventId:categoryId }))
    }
 },[isCreateFixtureSuccess,isUpdateFixtureSuccess])
  const togglePlayerModal = useCallback(() => {
    setIsPlayerModalOpen((prev) => !prev);
  }, []);

  const handleRemove = useCallback((index) => {
    
    setInitialState((prev) => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => index !== i),
    }));
  }, []);

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
              className="relative transform overflow-hidden scrollbar-hide rounded-lg bg-white px-2 pb-2 pt-3 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-[80%] sm:max-w-[40%] max-h-[90vh]  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto"
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
                            <h3 className="text-lg font-semibold text-grey-600 tracking-wide opacity-[90%]">
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
                              className="text-base leading-[19.36px] text-black  font-medium"
                              htmlFor="name"
                            >
                              Round Name
                            </label>
                            <Field
                              placeholder="Enter Round Name"
                              id="name"
                              name="name"
                              className="w-full px-[19px] text-[#718EBF] border-[2px] border-[#DFEAF2] rounded-xl h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                            />

                            <ErrorMessage name="name" component={TextError} />
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col items-start gap-2.5">
                              <label
                                className="text-base leading-[19.36px] text-black  font-medium"
                                htmlFor="format"
                              >
                                Event Format
                              </label>

                              <Field
                                name="format"
                                id="format"
                                className="w-full  text-[15px] text-[#718EBF] leading-[18px] px-[12px]  border-[1px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                as="select"
                                onChange={(e) => {
                                  setFieldValue("format", e.target.value);
                                }}
                              >
                                {tournamentEvent.hybridFormat.map(
                                  (format, index) => (
                                    <option
                                      key={`${format.name}`}
                                      value={
                                        index === 0 ? "" : format.shortName
                                      }
                                      className={
                                        index !== 0 ? "text-[#232323]" : ""
                                      }
                                    >
                                      {format.name}
                                    </option>
                                  )
                                )}
                              </Field>
                              <ErrorMessage
                                name="format"
                                component={TextError}
                              />
                            </div>
                            {values?.format === "RR" && (
                              <>
                                <div className="flex flex-col items-start gap-2">
                                  <label
                                    className="text-base leading-[19.36px] text-black  font-medium"
                                    htmlFor="roundRobinMode"
                                  >
                                    Round Robin Type
                                  </label>
                                  <Field
                                    className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    as="select"
                                    name="roundRobinMode"
                                    id="roundRobinMode"
                                  >
                                    {roundRobbinModeOptions.map((mode) => (
                                      <option value={mode?.id} key={mode?.id}>
                                        {mode?.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="roundRobinMode" />
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                  <label
                                    className="text-base leading-[19.36px] text-black  font-medium"
                                    htmlFor="numberOfGroups"
                                  >
                                    Number of group
                                  </label>
                                  <Field
                                    placeholder="Enter Number Of Groups"
                                    id="numberOfGroups"
                                    name="numberOfGroups"
                                    className="text-[#718EBF] w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                  />

                                  <ErrorMessage
                                    name="numberOfGroups"
                                    component={TextError}
                                  />
                                </div>
                              </>
                            )}

                            {values?.format === "DE" && (
                              <div className="flex flex-col items-start gap-2.5">
                                <label
                                  className="text-base leading-[19.36px] text-[#232323] text-black  font-medium"
                                  htmlFor="grandFinalsDE"
                                >
                                  Double Elimination Type
                                </label>
                                <Field
                                  className="w-full px-[12px] border-[1px]  text-[15px] text-[#718EBF] leading-[18px] border-[#DFEAF2] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  as="select"
                                  name="grandFinalsDE"
                                  id="grandFinalsDE"
                                >
                                  {grandFinalsDEOption.map((mode) => (
                                    <option value={mode?.id} key={mode?.id}>
                                      {mode?.name}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="grandFinalsDE"
                                  component={TextError}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-start gap-2.5">
                            <label
                              className="text-base leading-[19.36px] text-black  font-medium"
                              htmlFor="totalSets"
                            >
                              Number of Sets
                            </label>
                            <Field
                              placeholder="Enter Number Of Sets"
                              id="totalSets"
                              name="totalSets"
                              className="w-full px-[19px] border-[1px] text-[#718EBF] rounded-[15px] h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="number"
                            />

                            <ErrorMessage
                              name="totalSets"
                              component={TextError}
                            />
                          </div>
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
                              className="cursor-pointer w-full px-2 border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              <div className="flex items-center py-1.5 border-b-2 border-[#DFEAF2] bg-grey-200">
                                <span className="flex-[20] text-center text-grey-500 font-medium"></span>
                                <span className="flex-[35] text-left text-grey-500 font-medium">
                                  Name
                                </span>
                                <span className="flex-[35] text-left text-grey-500 font-medium">
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
                                            key={row.id}
                                            className={`flex items-center py-1.5 ${
                                              !isLast
                                                ? "border-b-2 border-[#DFEAF2]"
                                                : ""
                                            }`}
                                          >
                                            <span className="flex-[20] text-center text-md font-medium">
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
                                                    className="text-md text-grey-500 font-medium"
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
                                                  className="text-md text-grey-500 font-medium"
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
                          <div className="">
                            <div className="flex gap-2 justify-center mb-4">
                              <Button
                                type="button"
                                className="py-3 px-8 rounded-[10px] bg-white border-2 border-[#1570EF] text-[#1570EF] text-[14px] leading-[17px] text-[#232323]"
                                onClick={toggleModal}
                              >
                                Close
                              </Button>
                              <Button
                                className="py-3 px-8 rounded-[10px] shadow-md bg-[#1570EF] text-[14px] leading-[17px] text-[#FFFFFF]"
                                type="submit"
                                loading={isSubmitting}
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

export default RoundCreationModal;
