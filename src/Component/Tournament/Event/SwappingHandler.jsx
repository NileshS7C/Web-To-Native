import React, { useEffect, useState } from 'react'
import { swapIcon } from '../../../Assests';
import SelectPlayerModal from './SelectPlayerModal';

const SwappingHandler = ({ swapData, onSwapTargetsChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null); // 'player' or 'partner'
  const [swapTargets, setSwapTargets] = useState({ player: null, partner: null });

  useEffect(() => {
    if (onSwapTargetsChange) onSwapTargetsChange(swapTargets);
  }, [swapTargets, onSwapTargetsChange]);


  const isDoubles = swapData?.bookingItems[0]?.isDoubles;

  const handleSelect = (target) => {
    setModalTarget(target);
    setModalOpen(true);
  };

  const handlePlayerSelected = (data) => {
    setSwapTargets((prev) => ({ ...prev, [modalTarget]: data.player }));
    setModalOpen(false);
    setModalTarget(null);
  };

  const renderSwapTargetBox = (target) => {
    const selected = swapTargets[target];
    if (selected) {
      return (
        <div
          className='flex gap-3 border border-f2f2f2 rounded-md p-1 w-1/2 justify-between items-center cursor-pointer'
          onClick={() => handleSelect(target)}
          title="Click to change selection"
        >
          <p className='text-sm text-gray-500 text-left'>{selected.name}</p>
          <p className='text-sm text-gray-500 text-left'>{selected.phone}</p>
        </div>
      );
    }
    return (
      <div className='text-sm text-gray-500 text-left border border-f2f2f2 rounded-md p-1 w-1/2 cursor-pointer' onClick={() => handleSelect(target)}>
        <p>Select players to swap</p>
      </div>
    );
  };

  const renderLeftBox = (content) => (
    <div className={`flex gap-3 border border-f2f2f2 rounded-md p-1 w-1/2 justify-between items-center`}>
      {content}
    </div>
  );

  const renderPlayerLeft = () => {
    if (!swapData) {
      return renderLeftBox(<p className='text-sm text-gray-400 text-left w-full'>Select booking to swap</p>);
    }
    return renderLeftBox(<>
      <p className='text-sm text-gray-500 text-left'>{swapData?.player?.name}</p>
      <p className='text-sm text-gray-500 text-left'>{swapData?.player?.phone}</p>
    </>);
  };

  const renderPartnerLeft = () => {
    if (!swapData) {
      return renderLeftBox(<p className='text-sm text-gray-400 text-left w-full'>Select booking to swap</p>);
    }
    return renderLeftBox(<>
      <p className='text-sm text-gray-500 text-left'>{swapData?.bookingItems[0]?.partnerDetails?.name}</p>
      <p className='text-sm text-gray-500 text-left'>{swapData?.bookingItems[0]?.partnerDetails?.phone}</p>
    </>);
  };

  return (
    <div>
      {isDoubles && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 justify-between'>
            {/* Left: Original booking player or placeholder */}
            {renderPlayerLeft()}
            <div>
              <img src={swapIcon} alt="swap" className='w-8 h-8 cursor-pointer' onClick={() => handleSelect('player')} />
            </div>
            {/* Right: Swap target */}
            {renderSwapTargetBox('player')}
          </div>
          <div className='flex items-center gap-2 justify-between'>
            {/* Left: Original booking partner or placeholder */}
            {renderPartnerLeft()}
            <div>
              <img src={swapIcon} alt="swap" className='w-8 h-8 cursor-pointer' onClick={() => handleSelect('partner')} />
            </div>
            {/* Right: Swap target */}
            {renderSwapTargetBox('partner')}
          </div>
        </div>
      )}
      {!isDoubles && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 justify-between'>
            {/* Left: Original booking player or placeholder */}
            {renderPlayerLeft()}
            <div>
              <img src={swapIcon} alt="swap" className='w-8 h-8 cursor-pointer' onClick={() => handleSelect('player')} />
            </div>
            {/* Right: Swap target */}
            {renderSwapTargetBox('player')}
          </div>
        </div>
      )}
      <SelectPlayerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handlePlayerSelected}
        title={modalTarget === 'partner' ? 'Select Partner' : 'Select Player'}
        existingPlayer={swapTargets[modalTarget]}
      />
    </div>
  )
}

export default SwappingHandler