import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogBackdrop, DialogPanel, Button } from '@headlessui/react';
import { crossIcon } from '../../../Assests';
import { SearchPlayer } from '../../Common/SeachPlayerModal';
import ToggleButton from '../../Common/ToggleButton';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'User name should have at least 3 characters.')
    .max(50, 'User name should not exceed more than 50 characters.')
    .required('Name is required.'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits and contain only numbers.')
    .required('Phone number is required.'),
});

const SelectPlayerModal = ({ open, onClose, onSelect, title, existingPlayer }) => {
  const [toggleState, setToggleState] = useState({ player: false });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [manualData, setManualData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});

  const isPlayerExist = toggleState.player;

  useEffect(() => {
    if (open && existingPlayer) {
      // If there's existing player data, populate the form
      if (existingPlayer.playerId || existingPlayer._id || existingPlayer.key) {
        // This is an existing player from the system
        setToggleState({ player: true });
        setSelectedPlayer(existingPlayer);
        setManualData({ name: '', phone: '' });
      } else {
        // This is manually entered data
        setToggleState({ player: false });
        setSelectedPlayer(null);
        setManualData({
          name: existingPlayer.name || '',
          phone: existingPlayer.phone || ''
        });
      }
      setErrors({});
    } else if (!open) {
      // Reset form when modal closes
      setToggleState({ player: false });
      setSelectedPlayer(null);
      setManualData({ name: '', phone: '' });
      setErrors({});
    }
  }, [open, existingPlayer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPlayerExist) {
      if (!selectedPlayer) {
        setErrors({ player: 'Please select a player.' });
        return;
      }
      onSelect({
        type: 'existing',
        player: {
          name: selectedPlayer.name,
          phone: selectedPlayer.phone,
          playerId: selectedPlayer.playerId || selectedPlayer._id || selectedPlayer.key,
        },
      });
      onClose();
    } else {
      try {
        await validationSchema.validate(manualData, { abortEarly: false });
        onSelect({ type: 'manual', player: manualData });
        onClose();
      } catch (err) {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPanel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{title || 'Select Player'}</h2>
            <button onClick={onClose}>
              <img src={crossIcon} alt="close" className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <p>Does player already exist?</p>
              <ToggleButton enabled={toggleState.player} setEnabled={setToggleState} type="player" />
            </div>
            {isPlayerExist ? (
              <div className="flex flex-col gap-2.5">
                <p>Select Player</p>
                <SearchPlayer id="player" setChoosenPlayer={setSelectedPlayer} />
                {errors.player && <span className="text-red-500 text-xs">{errors.player}</span>}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="name" className="text-base">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-3 border border-gray-300 rounded h-10"
                    placeholder="Enter name"
                    value={manualData.name}
                    onChange={e => setManualData({ ...manualData, name: e.target.value })}
                  />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="phone" className="text-base">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="w-full px-3 border border-gray-300 rounded h-10"
                    placeholder="Enter phone"
                    value={manualData.phone}
                    onChange={e => setManualData({ ...manualData, phone: e.target.value })}
                  />
                  {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                </div>
              </>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Select</Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

SelectPlayerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string,
  existingPlayer: PropTypes.object,
};

export default SelectPlayerModal; 