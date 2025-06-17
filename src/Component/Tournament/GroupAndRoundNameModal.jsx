import React, { useState, useEffect } from 'react';
import { useUpdateGroupName, useUpdateRoundName } from '../../Hooks/fixtureHooks';

const GroupAndRoundNameModal = ({
  groupId,
  roundId,
  type,
  currentTitle,
  onClose,
  tournamentID,
  categoryId,
  fixtureId,
  changedName = '',
}) => {
  const [newTitle, setNewTitle] = useState(changedName);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [pointsEachSet, setPointsEachSet] = useState(0);
  const [error, setError] = useState('');
  
  const updateGroupNameMutation = useUpdateGroupName();
  const updateRoundNameMutation = useUpdateRoundName();

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update the input value when changedName prop changes
  useEffect(() => {
    setNewTitle(changedName);
  }, [changedName]);

  const handleSave = () => {
    if (!newTitle.trim()) {
      setError('Please enter a valid name');
      return;
    }

    setError(''); // Clear any previous errors

    const metaData = {
      date: formatDate(date),
      startTime,
      childCount: Number(childCount),
      pointsEachSet: Number(pointsEachSet)
    };

    if (type === 'group') {
      updateGroupNameMutation.mutate({
        tournamentID,
        categoryId,
        fixtureId,
        groupObj: {
          groupId,
          groupName: newTitle,
          metaData
        },
      }, {
        onSuccess: (data) => {
          onClose();
        },
        onError: (error) => {
          setError(error.response?.data?.message || 'Failed to update group name');
        }
      });
    } else if (type === 'round') {
      updateRoundNameMutation.mutate({
        tournamentID,
        categoryId,
        fixtureId,
        roundObj: {
          groupId,
          roundId,
          roundName: newTitle,
          metaData
        },
      }, {
        onSuccess: (data) => {
          onClose();
        },
        onError: (error) => {
          setError(error.response?.data?.message || 'Failed to update round name');
        }
      });
    }
  };

  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 w-full h-full z-10 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='max-w-[90%] md:max-w-[40%] w-full bg-white rounded-lg shadow-md m-auto p-4'> 
        <p className='text-center text-lg font-semibold'>
          {type === 'group' ? 'Change Group Name' : 'Change Round Name'}
        </p>
        <div className='flex gap-2 my-4 md:flex-row flex-col'>
          <div className='flex items-start gap-2 flex-col w-full'>
            <p className='text-sm w-full text-left'>
              {type === 'group' ? 'Current Group Name:' : 'Current Round Name:'}
            </p>
            <input type="text" className='w-full border border-gray-300 p-2' disabled value={currentTitle} />
          </div>
          <div className='flex items-start gap-2 flex-col w-full'>
            <p className='text-sm w-full text-left'>
              {type === 'group' ? 'Enter New Group Name:' : 'Enter New Round Name:'}
            </p>
            <input
              type="text"
              className='w-full border border-gray-300 p-2'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={changedName ? changedName : currentTitle}
            />
          </div>
        </div>

        {/* New Fields */}
        <div className='grid grid-cols-2 gap-4 my-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left'>Date:</label>
            <input
              type="date"
              className='border border-gray-300 p-2'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left'>Start Time:</label>
            <input
              type="time"
              className='border border-gray-300 p-2'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left'>Child Count:</label>
            <input
              type="number"
              min="1"
              className='border border-gray-300 p-2'
              value={childCount}
              onChange={(e) => setChildCount(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left'>Points per Set:</label>
            <input
              type="number"
              min="1"
              className='border border-gray-300 p-2'
              value={pointsEachSet}
              onChange={(e) => setPointsEachSet(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <div className='flex justify-end gap-2 mt-4'>
          <button className='bg-gray-500 text-white p-2 rounded-lg w-full mt-4' onClick={onClose}>Cancel</button>
          <button 
            className='bg-blue-500 text-white p-2 rounded-lg w-full mt-4' 
            onClick={handleSave}
            disabled={updateGroupNameMutation.isLoading || updateRoundNameMutation.isLoading}
          >
            {updateGroupNameMutation.isLoading || updateRoundNameMutation.isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAndRoundNameModal;