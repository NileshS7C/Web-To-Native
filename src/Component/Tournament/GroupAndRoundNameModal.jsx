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
  existingMetaData = {},
  eventFormat = '',
}) => {
  const [newTitle, setNewTitle] = useState(changedName);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [pointsEachSet, setPointsEachSet] = useState(0);
  const [error, setError] = useState('');
  
  const updateGroupNameMutation = useUpdateGroupName();
  const updateRoundNameMutation = useUpdateRoundName();

  // Download logic
  const [downloadType, setDownloadType] = useState('matchWise');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Determine available download types
  const downloadOptions = [
    { value: 'matchWise', label: 'Match Wise' },
    ...(eventFormat === 'RR' && type === 'group' ? [{ value: 'groupWise', label: 'Group Wise' }] : []),
    ...((eventFormat === 'SE' || eventFormat === 'DE') && type === 'round' ? [{ value: 'roundWise', label: 'Round Wise' }] : []),
  ];

  // Determine key
  const key = type === 'group' ? groupId : roundId;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      const url = `/users/admin/tournaments/${tournamentID}/categories/${categoryId}/fixtures/${fixtureId}/export-matches/${downloadType}/${key}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // Add auth headers if needed
        },
      });
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      // Try to get filename from headers
      let filename = 'exported-matches.pdf';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setDownloadError(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Parse date from DD/MM/YYYY format to YYYY-MM-DD for input
  const parseDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Handle DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Handle YYYY-MM-DD format (already in correct format)
    if (dateString.includes('-')) {
      return dateString;
    }
    
    return '';
  };

  // Initialize form fields with existing metadata
  useEffect(() => {
    setNewTitle(changedName);
    
    // Prefill date field
    if (existingMetaData.date) {
      const parsedDate = parseDateForInput(existingMetaData.date);
      setDate(parsedDate);
    }
    
    // Prefill start time field
    if (existingMetaData.startTime) {
      setStartTime(existingMetaData.startTime);
    }
    
    // Prefill child count field
    if (existingMetaData.childCount !== undefined && existingMetaData.childCount !== null) {
      setChildCount(existingMetaData.childCount);
    }
    
    // Prefill points per set field
    if (existingMetaData.pointsEachSet !== undefined && existingMetaData.pointsEachSet !== null) {
      setPointsEachSet(existingMetaData.pointsEachSet);
    }
  }, [changedName, existingMetaData]);

  const handleSave = () => {
    if (!newTitle.trim()) {
      setError('Please enter a valid name');
      return;
    }

    setError(''); // Clear any previous errors

    // Always include all fields that have some data in metaData, skip empty fields
    const formattedDate = date ? formatDate(date) : '';
    const metaData = {};
    const finalDate = formattedDate || existingMetaData.date || '';
    if (finalDate) metaData.date = finalDate;
    const finalStartTime = startTime || existingMetaData.startTime || '';
    if (finalStartTime) metaData.startTime = finalStartTime;
    const finalChildCount = childCount !== '' ? Number(childCount) : existingMetaData.childCount;
    if (finalChildCount > 0) metaData.childCount = finalChildCount;
    const finalPointsEachSet = pointsEachSet !== '' ? Number(pointsEachSet) : existingMetaData.pointsEachSet;
    if (finalPointsEachSet > 0) metaData.pointsEachSet = finalPointsEachSet;

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
            <label className='text-sm text-left capitalize'>Date:</label>
            <input
              type="date"
              className='border border-gray-300 p-2'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left capitalize'>Start Time:</label>
            <input
              type="time"
              className='border border-gray-300 p-2'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left capitalize'>No. of Sets:</label>
            <input
              type="number"
              min="1"
              className='border border-gray-300 p-2'
              value={childCount}
              onChange={(e) => setChildCount(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-left capitalize'>Points per set:</label>
            <input
              type="number"
              min="1"
              className='border border-gray-300 p-2'
              value={pointsEachSet}
              onChange={(e) => setPointsEachSet(e.target.value)}
            />
          </div>
        </div>

        {/* Download Section */}
        <div className='flex flex-col gap-2 my-2'>
          <label className='text-sm text-left'>Download Matches:</label>
          <div className='flex gap-2 items-center'>
            <select
              className='border border-gray-300 p-2 rounded'
              value={downloadType}
              onChange={e => setDownloadType(e.target.value)}
              disabled={downloading || downloadOptions.length === 1}
            >
              {downloadOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className='bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-300'
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
          {downloadError && <div className='text-red-500 text-xs'>{downloadError}</div>}
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