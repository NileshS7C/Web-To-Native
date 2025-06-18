import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { tournamentEvent } from '../../../Constant/tournament';
import { checkRoles } from '../../../utils/roleCheck';
import { ADMIN_ROLES } from '../../../Constant/Roles';
import { useDispatch } from 'react-redux';
import { getHybridFixtures } from '../../../redux/tournament/fixturesActions';

const ChildRoundModal = ({ tournamentId, categoryId, toggleModal }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [parentFixtures, setParentFixtures] = useState([]);
  const [form, setForm] = useState({
    name: '',
    parentRound: '',
    eventType: '',
    playCount: '',
    numberOfGroups: '',
    grandFinalsDE: '',
    totalSets: '',
    pickingOrder: 'top',
    playersFromEachGroup: ''
  });
  const [groupSizes, setGroupSizes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchHybridFixtures = async () => {
      setLoading(true);
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const endpoint = checkRoles(ADMIN_ROLES) 
          ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`
          : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid`;
        const response = await fetch(`${baseURL}${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setParentFixtures(data?.data?.fixtures || []);
      } catch (error) {
        setParentFixtures([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHybridFixtures();
  }, [tournamentId, categoryId]);

  // Reset conditional fields when eventType changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      playCount: '',
      numberOfGroups: '',
      grandFinalsDE: '',
      totalSets: '',
    }));
    setGroupSizes([]);
  }, [form.eventType]);

  // Update groupSizes array when numberOfGroups changes (only for RR)
  useEffect(() => {
    if (form.eventType === 'RR') {
      const num = parseInt(form.numberOfGroups, 10);
      if (!isNaN(num) && num > 0) {
        setGroupSizes((prev) => {
          const arr = [...prev];
          if (arr.length < num) {
            // Add new groups
            for (let i = arr.length; i < num; i++) {
              arr.push({ id: i + 1, totalParticipants: '' });
            }
          } else if (arr.length > num) {
            // Remove extra groups
            arr.length = num;
          }
          return arr;
        });
      } else {
        setGroupSizes([]);
      }
    } else {
      setGroupSizes([]);
    }
  }, [form.numberOfGroups, form.eventType]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : value
    }));
  };

  const handleGroupSizeChange = (index, event) => {
    const value = event.target.value;
    setGroupSizes((prev) => {
      const arr = [...prev];
      arr[index].totalParticipants = value;
      return arr;
    });
  };

  const getParentFixtureId = () => {
    const selected = parentFixtures.find(f => f.name === form.parentRound);
    return selected?._id || selected?.id || selected?.categoryId || '';
  };

  const buildPayload = () => {
    const settings = {
      totalSets: form.totalSets ? Number(form.totalSets) : undefined,
      consolationFinal: false,
    };
    if (form.eventType === 'DE') {
      settings.grandFinalsDE = form.grandFinalsDE;
    }
    if (form.eventType === 'RR') {
      settings.numberOfGroups = form.numberOfGroups ? Number(form.numberOfGroups) : undefined;
      settings.roundRobinMode = form.playCount;
      settings.groupSizes = groupSizes.map(g => ({
        id: g.id,
        totalParticipants: g.totalParticipants ? Number(g.totalParticipants) : 0
      }));
    }
    return {
      tournamentId,
      categoryId,
      fixtureData: {
        format: form.eventType,
        name: form.name,
        settings,
        parentId: getParentFixtureId(),
        metaData: {
          pickParticipantOrder: form.pickingOrder?.toUpperCase(),
          participantFromEachGroup: form.playersFromEachGroup ? Number(form.playersFromEachGroup) : undefined,
        },
      },
    };
  };

  const isFormValid = () => {
    if (!form.name || !form.parentRound || !form.eventType || !form.totalSets || !form.playersFromEachGroup) return false;
    if (form.eventType === 'DE' && !form.grandFinalsDE) return false;
    if (form.eventType === 'RR' && (!form.playCount || !form.numberOfGroups)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const endpoint = checkRoles(ADMIN_ROLES)
        ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/knockout`
        : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/hybrid/knockout`;
      const payload = buildPayload();
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.message || 'Failed to create child round');
      }
      setSuccess('Child round created successfully!');
      toggleModal();
      setTimeout(() => {
        dispatch(
          getHybridFixtures({
            tour_Id: tournamentId,
            eventId: categoryId
          })
        );
      }, 1000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-[90%] md:max-w-lg p-6 relative'>
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-xl font-bold text-[#343C6A]'>Add Child Round</h2>
          <RxCross2 className="cursor-pointer w-6 h-6" onClick={toggleModal} />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#232323] text-left mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Round Name"
              className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#232323] text-left mb-1">Select Parent Round</label>
            <select
              name="parentRound"
              value={form.parentRound}
              onChange={handleChange}
              className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
            >
              <option value="">Search Round</option>
              {parentFixtures.map((f) => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 flex-col">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#232323] text-left mb-1">Event Type</label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
              >
                <option value="">Select Event Type</option>
                <option value="SE">Single elimination</option>
                <option value="DE">Double elimination</option>
                <option value="RR">Round Robin</option>
              </select>
            </div>
            {/* Conditional: RR only */}
            {form.eventType === 'RR' && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#232323] text-left mb-1">Participant Play Count</label>
                <select
                  name="playCount"
                  value={form.playCount}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
                >
                  {tournamentEvent.roundRobinMode.map((mode) => (
                    <option value={mode.shortName} key={mode.shortName}>{mode.name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Conditional: DE only */}
            {form.eventType === 'DE' && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#232323] text-left mb-1">Grand Finals</label>
                <select
                  name="grandFinalsDE"
                  value={form.grandFinalsDE}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
                >
                  {tournamentEvent.grandFinalsDE.map((mode) => (
                    <option value={mode.shortName} key={mode.shortName}>{mode.name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Conditional: RR only */}
            {form.eventType === 'RR' && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#232323] text-left mb-1">Number of Groups</label>
                <input
                  type="number"
                  name="numberOfGroups"
                  value={form.numberOfGroups}
                  onChange={handleChange}
                  min={1}
                  className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
                  placeholder="Enter Number Of Groups"
                />
              </div>
            )}
          </div>
          {/* Group Size Table for RR */}
          {form.eventType === 'RR' && groupSizes.length > 0 && (
            <div className="flex flex-col w-full rounded-md border-2 border-gray-200 ">
              <div className="flex font-semibold text-gray-700 border-b py-2 justify-around">
                <h3 className="w-[40%] max-w-[40%] text-center">Group No.</h3>
                <h3 className="w-[60%] max-w-[60%] text-center">Total Participants (Each Group)</h3>
              </div>
              <div className="flex flex-col gap-3 max-h-[120px] md:max-h-[150px] overflow-y-scroll">
                {groupSizes.map((group, index) => (
                  <div key={group.id} className="flex w-full border-b-2 justify-around py-2">
                    <span className="text-gray-800 text-center w-[40%] max-w-[40%]">{group.id}</span>
                    <div className="flex justify-center max-w-[60%] mx-auto w-full">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`Enter Group ${index + 1} total participants...`}
                        value={group.totalParticipants}
                        onChange={(event) => handleGroupSizeChange(index, event)}
                        className="text-[15px] text-[#718EBF] w-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Always show Number of Sets */}
          <div>
            <label className="block text-sm font-medium text-[#232323] text-left mb-1">Number of Sets</label>
            <select
              name="totalSets"
              value={form.totalSets}
              onChange={handleChange}
              className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
            >
              {tournamentEvent.numberOfSets.map((set) => (
                <option value={set.shortName} key={set.shortName}>{set.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#232323] text-left mb-1">Player Picking Order :</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="pickingOrder"
                  value="top"
                  checked={form.pickingOrder === 'top'}
                  onChange={handleChange}
                  className="accent-[#1570EF]"
                />
                <span className='text-sm text-[#667085]'>Top Players</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="pickingOrder"
                  value="bottom"
                  checked={form.pickingOrder === 'bottom'}
                  onChange={handleChange}
                  className="accent-[#1570EF]"
                />
                <span className='text-sm text-[#667085]'>Bottom Players</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#232323] text-left mb-1">Players From Each Group</label>
            <input
              type="text"
              name="playersFromEachGroup"
              value={form.playersFromEachGroup}
              onChange={handleChange}
              placeholder="Enter Number of Players to Pick From Each Group"
              className="w-full border border-[#DFEAF2] text-[#718EBF] placeholder:text-[#718EBF] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1570EF]"
            />
          </div>
          {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm mt-2">{success}</div>}
          <div className="flex justify-center gap-4 mt-6">
            <button type="button" className="px-6 py-2 rounded-lg border border-[#1570EF] text-[#1570EF] bg-white font-medium" onClick={toggleModal}>Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-[#1570EF] text-white font-medium" disabled={loading || !isFormValid()}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-lg">Loading...</div>}
      </div>
    </div>
  );
};

export default ChildRoundModal;