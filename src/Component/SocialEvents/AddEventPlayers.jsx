import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useAddEventPlayer, useSearchPlayers } from '../../Hooks/SocialEventsHooks';
import { Toast } from '../Common/Toast';
import Button from '../Common/Button';
import TextError from '../Error/formError';
import { crossIcon } from '../../Assests';
import ToggleButton from '../Common/ToggleButton';

const AddEventPlayers = () => {
  const { eventId } = useParams();
  const ownerId = useSelector((state) => state.user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isErrorToast, setIsErrorToast] = useState(false);
  const [isPlayerExist, setIsPlayerExist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const { mutate: addPlayer, isLoading } = useAddEventPlayer();
  const { data: searchResults, isLoading: isSearching } = useSearchPlayers(searchQuery);

  const initialValues = {
    name: '',
    phone: ''
  };

  const validationSchema = yup.object().shape({
    name: !isPlayerExist && yup
      .string()
      .min(3, 'Name should have at least 3 characters')
      .max(50, 'Name should not exceed 50 characters')
      .required('Name is required'),
    phone: !isPlayerExist && yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required')
  });

  useEffect(() => {
    if (selectedPlayer) {
      setSearchQuery('');
    }
  }, [selectedPlayer]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log('Selected Player:', selectedPlayer); // Debug log
      const payload = isPlayerExist && selectedPlayer
        ? {
            eventId,
            ownerId,
            name: selectedPlayer.name,
            phone: selectedPlayer.phone,
            playerId: selectedPlayer._id || selectedPlayer.id // Try both _id and id
          }
        : {
            eventId,
            ownerId,
            ...values
          };

      console.log('Payload:', payload); // Debug log
      await addPlayer(payload, {
        onSuccess: () => {
          setShowToast(true);
          setToastMessage('Player added successfully!');
          setIsErrorToast(false);
          setIsModalOpen(false);
          resetForm();
          setSelectedPlayer(null);
          setIsPlayerExist(false);
        },
        onError: (error) => {
          setShowToast(true);
          setToastMessage(error?.message || 'Failed to add player');
          setIsErrorToast(true);
        }
      });
    } catch (error) {
      setShowToast(true);
      setToastMessage(error?.message || 'Failed to add player');
      setIsErrorToast(true);
    }
  };

  return (
    <>
      <div className="my-4">
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-auto cursor-pointer w-fit"
        >
          Add Players
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlayer(null);
          setIsPlayerExist(false);
        }}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
        />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Player
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPlayer(null);
                    setIsPlayerExist(false);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <img src={crossIcon} alt="close" className="w-6 h-6" />
                </button>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <p className="text-sm text-gray-700">Is player already registered?</p>
                      <div
                        onClick={() => {
                          setIsPlayerExist(!isPlayerExist);
                          setSelectedPlayer(null);
                          setSearchQuery('');
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          isPlayerExist ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            isPlayerExist ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </div>

                    {isPlayerExist ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Search Player
                          </label>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Search by name or phone"
                          />
                        </div>

                        {isSearching && (
                          <div className="text-center py-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                          </div>
                        )}

                        {searchResults?.players && searchResults.players.length > 0 && (
                          <div className="max-h-60 overflow-y-auto border rounded-md">
                            {searchResults.players.map((player) => (
                              <div
                                key={player._id || player.id}
                                onClick={() => {
                                  console.log('Selected player data:', player); // Debug log
                                  setSelectedPlayer({
                                    ...player,
                                    _id: player._id || player.id // Ensure we have the ID
                                  });
                                }}
                                className={`p-3 cursor-pointer hover:bg-gray-50 ${
                                  selectedPlayer?._id === (player._id || player.id) ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-gray-500">{player.phone}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedPlayer && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="font-medium">Selected Player:</div>
                            <div className="text-sm">
                              <div>Name: {selectedPlayer.name}</div>
                              <div>Phone: {selectedPlayer.phone}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter player name"
                          />
                          <ErrorMessage name="name" component={TextError} />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <Field
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter phone number"
                          />
                          <ErrorMessage name="phone" component={TextError} />
                        </div>
                      </>
                    )}

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <Button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        loading={isSubmitting}
                        disabled={isPlayerExist && !selectedPlayer}
                      >
                        Add Player
                      </Button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedPlayer(null);
                          setIsPlayerExist(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {showToast && (
        <Toast
          successMessage={!isErrorToast ? toastMessage : null}
          error={isErrorToast ? toastMessage : null}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default AddEventPlayers;