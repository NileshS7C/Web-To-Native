import React, { useState } from 'react'
import { swapIcon } from '../../../Assests'
import { NotDoublesCategory } from '../../../Constant/tournament';
import { useSelector, useDispatch } from 'react-redux';
import SearchBookings from './SearchBookings';
import { useEffect } from 'react';
import SwappingHandler from './SwappingHandler';
import { swapEventBooking } from '../../../api/TournamentEvents';
import { getAllBookings } from '../../../redux/tournament/tournamentActions';

const SwapParticipants = ({ tournamentId, eventId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [swapData, setSwapData] = useState(null);
  const [swapTargets, setSwapTargets] = useState({ player: null, partner: null });
  const { category } = useSelector((state) => state.event);
  const isSingleCategory = NotDoublesCategory.includes(category?.type);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!swapData) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const bookingId = swapData._id;
    const isDoubles = swapData?.bookingItems[0]?.isDoubles;
    let bookingData = {};
    let replace = '';
    if (isDoubles) {
      const playerChanged = !!swapTargets.player;
      const partnerChanged = !!swapTargets.partner;
      if (playerChanged && partnerChanged) {
        bookingData = {
          name: swapTargets.player.name,
          phone: swapTargets.player.phone,
          ...(swapTargets.player.playerId && { playerId: swapTargets.player.playerId }),
          partnerDetails: {
            name: swapTargets.partner.name,
            phone: swapTargets.partner.phone,
            ...(swapTargets.partner.playerId && { playerId: swapTargets.partner.playerId }),
          }
        };
        replace = 'both';
      } else if (playerChanged) {
        bookingData = {
          name: swapTargets.player.name,
          phone: swapTargets.player.phone,
          ...(swapTargets.player.playerId && { playerId: swapTargets.player.playerId }),
        };
        replace = 'primary';
      } else if (partnerChanged) {
        bookingData = {
          partnerDetails: {
            name: swapTargets.partner.name,
            phone: swapTargets.partner.phone,
            ...(swapTargets.partner.playerId && { playerId: swapTargets.partner.playerId }),
          }
        };
        replace = 'partner';
      } else {
        setError('No changes to save.');
        setIsLoading(false);
        return;
      }
    } else {
      if (!swapTargets.player) {
        setError('No changes to save.');
        setIsLoading(false);
        return;
      }
      bookingData = {
        name: swapTargets.player.name,
        phone: swapTargets.player.phone,
        ...(swapTargets.player.playerId && { playerId: swapTargets.player.playerId }),
      };
      replace = 'primary';
    }
    try {
      await swapEventBooking({
        tournamentId,
        categoryId: eventId,
        bookingId,
        bookingData,
        replace,
      });
      setSuccess('Swap successful!');
      setIsOpen(false);
      // Refresh bookings after swap
      dispatch(getAllBookings({
        currentPage: 1,
        limit: 10,
        tour_Id: tournamentId,
        eventId
      }));
    } catch (err) {
      setError(err.message || 'Swap failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center gap-2 cursor-pointer text-blue-700 px-2 py-1 rounded-md border border-blue-700' onClick={() => setIsOpen(true)}>
        <img src={swapIcon} alt="swap" className='w-8 h-8' />
        <p className='text-sm'>Swap Players</p>
      </div>
      {isOpen && (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-md w-full max-w-[700px] flex flex-col gap-4'>
            <h2 className='text-lg font-bold capitalize text-left'>Swap Participants</h2>
            {error && <div className='text-red-500'>{error}</div>}
            {success && <div className='text-green-600'>{success}</div>}
            <SearchBookings
              tournamentId={tournamentId}
              eventId={eventId}
              isSingleCategory={isSingleCategory}
              onSelectBooking={(booking) => {
                setSwapData(booking);
                setSwapTargets({ player: null, partner: null });
                setError(null);
                setSuccess(null);
              }}
            />
            <SwappingHandler
              swapData={swapData}
              onSwapTargetsChange={setSwapTargets}
            />
            <div className='flex items-center gap-2 justify-end'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50'
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-md'
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SwapParticipants