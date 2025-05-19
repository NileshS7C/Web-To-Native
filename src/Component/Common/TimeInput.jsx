import React from "react";

const TimeInput = ({ label, value = "", onChange, className = "" }) => {
  const handleInputChange = (e) => {
    let input = e.target.value.replace(/[^0-9:]/g, "");

    
    if (input.length > 5) return;

    
    if (input.length === 2 && !input.includes(":")) {
      input = `${input}:`;
    }

    const digitCount = input.replace(/:/g, "").length;
    if (digitCount > 4) return;
    const cleanTime = input.replace(/[^0-9]/g, "");
    if (cleanTime.length === 4) {
      const hours = cleanTime.slice(0, 2);
      const minutes = cleanTime.slice(2);
      const numHours = parseInt(hours, 10);
      const numMinutes = parseInt(minutes, 10);

      if (numHours > 23 || numMinutes > 59) return;

      input = `${hours}:${minutes}`;
    }

    onChange(input);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      placeholder="HH:MM"
      className={className}
      aria-label={label}
    />
  );
};

export default TimeInput;
