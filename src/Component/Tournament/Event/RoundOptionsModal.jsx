import React from 'react'
import { RxCross2 } from "react-icons/rx";

const RoundOptionsModal = ({onTypeSelect, onClose}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded-lg w-full max-w-md'>
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-2xl font-bold text-[#1570EF] text-center'>ADD NEW ROUND</h2>
          <RxCross2
            className="cursor-pointer w-6 h-6"
            onClick={onClose}
          />
        </div>
        <p className='text-base text-[#232323] mt-2'>Is this a Child round or a Parent round?</p>
        <div className='flex justify-around mt-4'>
          <button 
            className='px-4 py-2 rounded-lg bg-[#1570EF] text-white hover:bg-[#1570EF]/90 transition-colors' 
            onClick={() => onTypeSelect("child")}
          >
            Child Round
          </button>
          <button 
            className='px-4 py-2 rounded-lg bg-[#1570EF] text-white hover:bg-[#1570EF]/90 transition-colors' 
            onClick={() => onTypeSelect("parent")}
          >
            Parent Round
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoundOptionsModal