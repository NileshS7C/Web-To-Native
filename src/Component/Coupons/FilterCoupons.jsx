import React, { useState } from "react";

const FilterCoupons = ({ label, options, selectedValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className={`inline-flex justify-between w-32 px-4 py-2 text-sm font-medium text-gray-700 
                ${selectedValue ? "bg-lime-500 border-lime-500" : "bg-white border-gray-300"} 
                border rounded-md shadow-sm hover:bg-gray-100`}

                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedValue || label} {/* Shows label when no value is selected */}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </div>
                    ))}
                    <div
                        className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            onChange(""); // Reset filter
                            setIsOpen(false);
                        }}
                    >
                        Clear
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterCoupons