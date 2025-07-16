import React from 'react'
import ToggleButton from "../../Common/ToggleButton";
import { Button } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookingModal } from "../../../redux/tournament/eventSlice";
import { checkRoles } from "../../../utils/roleCheck";
import { ADMIN_ROLES } from "../../../Constant/Roles";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getAllBookings } from '../../../redux/tournament/tournamentActions';
import axiosInstance from '../../../Services/axios';

const AddTbdPlayer = ({ onTbdToggle }) => {
  const user = useSelector((state) => state.user);
  const [isTbdPlayer, setIsTbdPlayer] = React.useState({
    tbd: false
  });
  const dispatch = useDispatch();
  const { tournamentId, eventId: categoryId } = useParams();

  const handleTbdToggle = () => {
    setIsTbdPlayer((prev) => {
      const newState = { ...prev, tbd: !prev.tbd };
      onTbdToggle(newState.tbd);
      return newState;
    });
  };

  const handleAddTbdPlayer = async () => {
    try {
      const ownerId = user?.id;
      const baseURL = import.meta.env.VITE_BASE_URL;
      const endpoint = checkRoles(ADMIN_ROLES) 
        ? `/users/admin/bookings/owner/${ownerId}/tbd-bookings`
        : `/users/tournament-owner/bookings/owner/${ownerId}/tbd-bookings`;

      const response = await axiosInstance.post(`${baseURL}${endpoint}`, {
        tournamentId,
        categoryId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to add TBD player');
      }

      toast.success('TBD player added successfully');
      dispatch(toggleBookingModal());
      // Refresh bookings after adding TBD player
      dispatch(getAllBookings({
        currentPage: 1,
        limit: 10,
        tour_Id: tournamentId,
        eventId: categoryId
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add TBD player');
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <p className='text-base'>Add player as TBD?</p>
        <button
          type="button"
          aria-pressed={isTbdPlayer.tbd}
          onClick={handleTbdToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${isTbdPlayer.tbd ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isTbdPlayer.tbd ? 'translate-x-5 bg-indigo-500' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {isTbdPlayer.tbd && (
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 p-3 bg-slate-200 shadow-sm text-sm">Confirm adding player as TBD</p>
          <div className="flex items-center justify-center gap-5 px-[50px]">
            <button
              onClick={() => dispatch(toggleBookingModal())}
              type="button"
              className="inline-flex text-black border-1 border-blue-500 w-full items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-300"
            >
              Cancel
            </button>
            <Button
              type="button"
              onClick={handleAddTbdPlayer}
              className="inline-flex w-full min-w-fit items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
            >
              Add TBD Player
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

AddTbdPlayer.propTypes = {
  onTbdToggle: PropTypes.func.isRequired
};

export default AddTbdPlayer