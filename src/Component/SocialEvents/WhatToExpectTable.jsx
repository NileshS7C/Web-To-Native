
import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

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
    <div className="grid grid-cols-1 gap-2.5 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-base text-[#232323] justify-self-start font-medium">What To Expect</p>
        <button
          type="button"
          onClick={addExpectation}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          disabled={disabled}
        >
          Add Expectation
        </button>
      </div>

      <div className="overflow-x-auto rounded-md w-full">
        <table className="border border-[#EAECF0] rounded-[8px] table-auto min-w-[700px] w-full">
          <thead>
            <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b h-[44px]">
              <th className="text-left p-2">S.No.</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expectations.map((item, index) => (
              <tr key={index} className="text-sm text-[#667085]">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateExpectation(index, 'title', e.target.value)}
                    placeholder="Enter title"
                    className="w-[90%] px-[10px] border border-[#DFEAF2] rounded-[10px] h-[40px]"
                    disabled={disabled}
                  />
                </td>
                <td className="p-2">
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateExpectation(index, 'description', e.target.value)}
                    placeholder="Enter description"
                    className="w-[90%] px-[10px] py-[6px] border border-[#DFEAF2] rounded-[10px] resize-none"
                    disabled={disabled}
                  />
                </td>
                <td className="p-2">
                  {!disabled && expectations.length > 1 && (
                    <RiDeleteBin6Line
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => removeExpectation(index)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhatToExpectTable;
