import React, { useState } from 'react';
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
  const updateGroupNameMutation = useUpdateGroupName();
  const updateRoundNameMutation = useUpdateRoundName();

  const handleSave = () => {
    if (!newTitle.trim()) {
      alert('Please enter a valid name');
      return;
    }

    if (type === 'group') {
      updateGroupNameMutation.mutate({
        tournamentID,
        categoryId,
        fixtureId,
        groupObj: {
          groupId,
          groupName: newTitle,
        },
      }, {
        onSuccess: () => {
          onClose();
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
        },
      }, {
        onSuccess: () => {
          onClose();
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
            />
          </div>
        </div>
        <div className='flex justify-end gap-2 mt-4'>
          <button className='bg-gray-500 text-white p-2 rounded-lg w-full mt-4' onClick={onClose}>Cancel</button>
          <button className='bg-blue-500 text-white p-2 rounded-lg w-full mt-4' onClick={handleSave}>
            {updateGroupNameMutation.isLoading || updateRoundNameMutation.isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAndRoundNameModal;
