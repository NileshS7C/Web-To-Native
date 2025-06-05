import React, { useState, useEffect } from 'react';

const WhatToExpectTable = ({ onChange = () => {}, disabled = false }) => {
  const [expectations, setExpectations] = useState([
    { title: '', description: '' }
  ]);

  useEffect(() => {
    onChange(expectations);
  }, [expectations]);

  const addExpectation = () => {
    setExpectations([...expectations, { title: '', description: '' }]);
  };

  const removeExpectation = (index) => {
    if (expectations.length > 1) {
      const updated = expectations.filter((_, i) => i !== index);
      setExpectations(updated);
    }
  };

  const updateExpectation = (index, field, value) => {
    const updated = expectations.map((expectation, i) =>
      i === index ? { ...expectation, [field]: value } : expectation
    );
    setExpectations(updated);
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-base leading-[19.36px] text-[#232323] font-medium'>What To Expect</h3>
        <button
          type="button"
          onClick={addExpectation}
          className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors'
          disabled={disabled}
        >
          Add Expectation
        </button>
      </div>

      <div className='space-y-4'>
        {expectations.map((expectation, index) => (
          <div key={index} className='border border-[#DFEAF2] rounded-[15px] p-4'>
            <div className='flex justify-between items-center mb-3'>
              <span className='text-sm font-medium text-[#232323]'>Expectation #{index + 1}</span>
              {expectations.length > 1 && !disabled && (
                <button
                  type="button"
                  onClick={() => removeExpectation(index)}
                  className='text-red-500 hover:text-red-700 text-sm font-medium'
                >
                  Remove
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='flex flex-col items-start gap-2'>
                <label className='text-sm leading-[16.36px] text-[#232323]'>Title</label>
                <input
                  type="text"
                  value={expectation.title}
                  onChange={(e) => updateExpectation(index, 'title', e.target.value)}
                  className='w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter expectation title'
                  disabled={disabled}
                />
              </div>

              <div className='flex flex-col items-start gap-2'>
                <label className='text-sm leading-[16.36px] text-[#232323]'>Description</label>
                <textarea
                  value={expectation.description}
                  onChange={(e) => updateExpectation(index, 'description', e.target.value)}
                  rows="2"
                  className='w-full px-[19px] py-3 border-[1px] border-[#DFEAF2] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                  placeholder='Enter expectation description'
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatToExpectTable;
