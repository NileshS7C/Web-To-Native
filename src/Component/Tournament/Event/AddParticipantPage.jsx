import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
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
import { bookingLimit, NotDoublesCategory } from "../../../Constant/tournament";
import { SearchPlayer } from "../../Common/SeachPlayerModal";
import ToggleButton from "../../Common/ToggleButton";


const PlayerExistenceSelector = ({ handlePlayerExist, type }) => {
  const [isPlayerExist, setIsPlayerExist] = useState({
    player: false,
    partner: false,
  });

  useEffect(() => {
    handlePlayerExist(isPlayerExist);
  }, [isPlayerExist]);

  return (
    <div className="flex items-center gap-2.5">
      <p>Does player already exist?</p>

      <ToggleButton
        enabled={isPlayerExist[type]}
        setEnabled={setIsPlayerExist}
        type={type}
      />
    </div>
  );
};

const SearchPlayerWrapper = ({ id, setSelectedPlayer, setRemovedPlayer }) => {
  const [choosenPlayer, setChoosenPlayer] = useState(null);

  useEffect(() => {
    if (choosenPlayer) {
      setSelectedPlayer({ player: choosenPlayer, id });
    }
  }, [choosenPlayer]);

  return (
    <div className="flex flex-col gap-2.5 items-start">
      <SearchPlayer
        id={id}
        setChoosenPlayer={setChoosenPlayer}
        setRemovedPlayer={setRemovedPlayer}
      />
    </div>
  );
};

const AddUserModalTitle = ({ isPlayerExist }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between mb-[30px]">
      <p className="text-[18px] leading-[21.7px] font-[600] text-[#343C6A]">
        Add User
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
  const [validationError, setValidationError] = useState({
    player: "",
    partner: "",
  });
  const [isPlayerExist, setIsPlayerExist] = useState({
    player: false,
    partner: false,
  });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [removedPlayer, setRemovedPlayer] = useState(null);
  const { showConfirmBookingModal, category } = useSelector(
    (state) => state.event
  );
  const { tournament } = useSelector((state) => state.GET_TOUR);
  const { bookingErrorMessage } = useSelector((state) => state.tourBookings);

  const [initialState, setInitialState] = useState(initialValues);
  const [existingPlayerDetails, setExistingPlayerDetails] = useState({
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
  });

  const handlePlayerExist = (type, newState) => {
    setIsPlayerExist((prevStates) => ({
      ...prevStates,
      [type]: newState[type],
    }));
  };
  const validationSchema = yup.object().shape({
    name:
      !isPlayerExist.player &&
      yup
        .string()
        .min(3, "User name should have at least 3 characters.")
        .max(50, "User name should not exceed more than 50 characters.")
        .required("Name is required."),
    phone:
      !isPlayerExist.player &&
      yup
        .string()
        .matches(
          /^[0-9]{10}$/,
          "Phone number must be exactly 10 digits and contain only numbers."
        )
        .required("Phone number is required."),
    bookingItems:
      isChecked &&
      !isPlayerExist.partner &&
      yup.array().of(
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
        })
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      setHasError(false);
      let updatedValues;

      if (isPlayerExist.player) {
        const notDetailsFilled =
          !existingPlayerDetails.name || !existingPlayerDetails.phone;

        if (notDetailsFilled) {
          setValidationError((prev) => ({
            ...prev,
            player: "Player details are required.",
          }));
          return;
        } else {
          setValidationError((prev) => ({
            ...prev,
            player: "",
          }));
        }
      }

      if (isPlayerExist.partner) {
        const filteredPartners = existingPlayerDetails.bookingItems.filter(
          (item) =>
            !item.categoryId ||
            !item?.partnerDetails?.name ||
            !item?.partnerDetails?.phone
        );

        if (filteredPartners.length > 0) {
          setValidationError((prev) => ({
            ...prev,
            partner: "Partner details are required.",
          }));

          return;
        } else {
          setValidationError((prev) => ({
            ...prev,
            partner: "",
          }));
        }
      }

      if (isChecked && initialState?.bookingItems?.length) {
        const updatedBookingItems = !isPlayerExist.partner
          ? values?.bookingItems.map((item) => ({
              ...item,
              categoryId: eventId,
            }))
          : existingPlayerDetails.bookingItems.map((item) => ({
              ...item,
              categoryId: eventId,
            }));
        updatedValues = !isPlayerExist.player
          ? {
              ...values,
              tournamentId,
              bookingItems: updatedBookingItems,
            }
          : {
              ...existingPlayerDetails,
              tournamentId,
              bookingItems: updatedBookingItems,
            };
      } else {
        updatedValues = !isPlayerExist.player
          ? {
              ...values,
              tournamentId,
              bookingItems: [
                {
                  categoryId: eventId,
                },
              ],
            }
          : {
              ...existingPlayerDetails,
              tournamentId,
              bookingItems: [
                {
                  categoryId: eventId,
                },
              ],
            };
      }

      const result = await dispatch(
        createConfirmBooking({
          data: updatedValues,
          ownerId: tournament?.ownerUserId,
        })
      ).unwrap();
      if (!result?.responseCode) {
        resetForm();
        dispatch(toggleBookingModal());
        dispatch(
          getAllBookings({
            currentPage: currentPage || 1,
            limit: bookingLimit,
            tour_Id: tournamentId,
            eventId
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

  /* 
   Refactor the values with the selected players
  */

  useEffect(() => {
    if (selectedPlayer?.player) {
      let updatedValues = {};
      let bookingItems = [{ categoryId: eventId }];

      const { name, phone, _id } = selectedPlayer?.player;
      if (selectedPlayer?.id === "player") {
        updatedValues = {
          ...updatedValues,
          name,
          phone,
          playerId: _id,
          tournamentId,
        };

        setExistingPlayerDetails((prevState) => ({
          ...prevState,
          ...updatedValues,
        }));
      }

      if (selectedPlayer?.id === "partner") {
        const bookingItems = [
          {
            categoryId: eventId,
            partnerDetails: {
              name: name,
              playerId: _id,
              phone: phone,
            },
          },
        ];
        updatedValues = { ...updatedValues, bookingItems };

        setExistingPlayerDetails((prevState) => ({
          ...prevState,
          ...updatedValues,
        }));
      } else {
        setExistingPlayerDetails((prevState) => ({
          ...prevState,
          bookingItems,
        }));
      }
    }
  }, [selectedPlayer?.id, selectedPlayer]);

  useEffect(() => {
    if (removedPlayer) {
      const id = removedPlayer.id;

      switch (id) {
        case "player":
          setExistingPlayerDetails((prev) => ({
            ...prev,
            name: "",
            phone: "",
            playerId: "",
            tournamentId: "",
          }));

          break;

        case "partner":
          setExistingPlayerDetails((prev) => ({
            ...prev,
            bookingItems: prev.bookingItems.map((item) => {
              if (item.partnerDetails.playerId === removedPlayer.key) {
                return {
                  ...item,
                  partnerDetails: {
                    ...item.partnerDetails,
                    name: "",
                    phone: "",
                    playerId: "",
                  },
                };
              }
              return item;
            }),
          }));

          break;
      }
    }
  }, [removedPlayer]);

  useEffect(() => {
    if (showConfirmBookingModal) {
      setInitialState((prevState) => {
        return { ...initialValues, ...prevState };
      });
      setHasError(false);
    }
  }, [showConfirmBookingModal]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
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
          <div className="fixed  inset-0 z-10 overflow-y-hidden">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white pb-2 px-2 xl:px-4 xl:pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in  w-full max-w-full sm:max-w-md lg:max-w-[60%] xl:max-w-[30%]   sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className="w-full max-h-[40vw] bg-[#FFFFFF] p-[10px] lg:px-[20px] overflow-y-auto ">
                  <AddUserModalTitle isPlayerExist={isPlayerExist} />

                  {hasError && <ErrorBanner message={bookingErrorMessage} />}

                  {(validationError.player || validationError.partner) && (
                    <ErrorBanner
                      message={
                        validationError.player || validationError.partner
                      }
                    />
                  )}

                  <Form>
                    <div className="grid grid-col-1 gap-[20px]">
                      <PlayerDetails
                        handlePlayerExist={handlePlayerExist}
                        setSelectedPlayer={setSelectedPlayer}
                        setRemovedPlayer={setRemovedPlayer}
                        isPlayerExist={isPlayerExist}
                      />

                      {!NotDoublesCategory.includes(category?.type) && (
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
                              <PlayerExistenceSelector
                                handlePlayerExist={(newState) =>
                                  handlePlayerExist("partner", newState)
                                }
                                type="partner"
                              />

                              {isPlayerExist.partner && (
                                <div className="flex flex-col justify-start w-full gap-2.5">
                                  <p>Select Player</p>
                                  <SearchPlayerWrapper
                                    id="partner"
                                    setSelectedPlayer={setSelectedPlayer}
                                    setRemovedPlayer={setRemovedPlayer}
                                  />
                                  <ErrorMessage
                                    id="partner"
                                    name="partner"
                                    component={TextError}
                                  />
                                </div>
                              )}
                              <div className="flex flex-col items-start gap-2.5">
                                <label
                                  className="text-base leading-[19.36px]"
                                  htmlFor="bookingItems[0].partnerDetails.name"
                                >
                                  Name
                                </label>
                                <Field
                                  id="bookingItems[0].partnerDetails.name"
                                  name="bookingItems[0].partnerDetails.name"
                                  type="phone"
                                  className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your partner name"
                                  disabled={isPlayerExist.partner}
                                />
                                <ErrorMessage
                                  name="bookingItems[0].partnerDetails.name"
                                  component={TextError}
                                />
                              </div>
                              <div className="flex flex-col items-start gap-2.5">
                                <label
                                  className="text-base leading-[19.36px]"
                                  htmlFor="bookingItems[0].partnerDetails.phone"
                                >
                                  Phone Number
                                </label>
                                <Field
                                  id="bookingItems[0].partnerDetails.phone"
                                  name="bookingItems[0].partnerDetails.phone"
                                  type="bookingItems[0].partnerDetails.phone"
                                  className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your partner phone"
                                  disabled={isPlayerExist.partner}
                                />
                                <ErrorMessage
                                  name="bookingItems[0].partnerDetails.phone"
                                  component={TextError}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <PartnerDetails
                        dispatch={dispatch}
                        toggleBookingModal={toggleBookingModal}
                        isSubmitting={isSubmitting}
                        isPlayerExist={isPlayerExist}
                      />
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

const PlayerDetails = (props) => {
  const { setFieldError, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (props.isPlayerExist.player) {
      setFieldError("name", "");
      setFieldValue("name", "");
      setFieldError("phone", "");
      setFieldValue("phone", "");
    }
  }, [props.isPlayerExist]);
  return (
    <div>
      <div className="flex flex-col flex-1 items-start gap-2.5">
        <PlayerExistenceSelector
          handlePlayerExist={(newState) =>
            props.handlePlayerExist("player", newState)
          }
          type="player"
        />

        {props.isPlayerExist.player && (
          <div className="flex flex-col justify-start w-full gap-2.5">
            <p>Select Player</p>
            <SearchPlayerWrapper
              id="player"
              setSelectedPlayer={props.setSelectedPlayer}
              setRemovedPlayer={props.setRemovedPlayer}
            />

            <ErrorMessage id="player" name="player" component={TextError} />
          </div>
        )}
        <label className="text-base leading-[19.36px]" htmlFor="name">
          Name
        </label>
        <Field
          name="name"
          id="name"
          type="text"
          className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
          disabled={props.isPlayerExist.player}
        />
        <ErrorMessage name="name" component={TextError} />
      </div>

      <div className="flex flex-col items-start gap-2.5">
        <label className="text-base leading-[19.36px]" htmlFor="phone">
          Phone
        </label>
        <Field
          id="phone"
          name="phone"
          type="phone"
          className="w-full min-w-fit max-w-full sm:max-w-full md:max-w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your phone"
          disabled={props.isPlayerExist.player}
        />
        <ErrorMessage name="phone" component={TextError} />
      </div>
    </div>
  );
};

const PartnerDetails = (props) => {
  const { setFieldError, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (props.isPlayerExist.partner) {
      setFieldError("bookingItems[0].partnerDetails.name", "");
      setFieldValue("bookingItems[0].partnerDetails.name", "");
      setFieldError("bookingItems[0].partnerDetails.phone", "");
      setFieldValue("bookingItems[0].partnerDetails.phone", "");
    }
  }, [props.isPlayerExist]);
  return (
    <div className="flex flex-1 items-center justify-center gap-5 px-[50px]">
      <button
        onClick={() => props.dispatch(props.toggleBookingModal())}
        type="button"
        disabled={props.isSubmitting}
        className="inline-flex text-black border-1 border-blue-500  w-full items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-xl hover:bg-gray-300"
      >
        Cancel
      </button>
      <Button
        type="submit"
        className="inline-flex w-full min-w-fit items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
        loading={props.isSubmitting}
      >
        Add Participant
      </Button>
    </div>
  );
};
PlayerExistenceSelector.propTypes = {
  handlePlayerExist: PropTypes.func,
};

SearchPlayerWrapper.propTypes = {
  id: PropTypes.string,
  setSelectedPlayer: PropTypes.func,
  setRemovedPlayer: PropTypes.func,
};

AddUserModalTitle.propTypes = {
  isPlayerExist: PropTypes.bool,
};

export default AddParticipants;
